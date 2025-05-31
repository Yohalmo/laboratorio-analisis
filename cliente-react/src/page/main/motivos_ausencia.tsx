import { useState, useEffect } from "react";
import { useMotivosAusencia } from "../../hook/useMotivosAusencia";
import Paginador from '../../components/paginador';
import { fetchCliente } from '../../api/fetchCliente';
import { ToastContainer, toast } from 'react-toastify';
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Motivo } from '../../interfaces/Motivo';

export default function MotivosAusencia() {
    const { motivos, loading, error, setMotivos } = useMotivosAusencia();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editRegistro, setEditRegistro] = useState<Motivo | null>(null);
    const [deleteRegistro, setDeleteRegistro] = useState<Motivo | null>(null);

    const [nuevoMotivo, setNuevoMotivo] = useState<Motivo>({
        id_motivo: '',
        descripcion: ''
    });

    const validate = (m: Motivo) => {
        if (!m.descripcion.trim()) return 'La descripción es obligatoria';
        return null;
    };

    const handleAdd = async () => {
        const msg = validate(nuevoMotivo);
        if (msg) return toast.error(msg);

        try {
            const res = await fetchCliente<{ id: string }>('/api/motivos_ausencia/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoMotivo)
            });

            setMotivos(prev => [...prev, { ...nuevoMotivo, id_motivo: res.id }]);
            toast.success('Motivo agregado');
            setShowAddModal(false);
            setNuevoMotivo({ id_motivo: '', descripcion: '' });
        } catch {
            toast.error('Error al agregar');
        }
    };

    const openEdit = (m: Motivo) => {
        setEditRegistro(m);
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editRegistro) return;

        const msg = validate(editRegistro);
        if (msg) return toast.error(msg);

        try {
            await fetchCliente(`/api/motivos_ausencia/update/${editRegistro.id_motivo}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editRegistro)
            });

            setMotivos(prev => prev.map(m => m.id_motivo === editRegistro.id_motivo ? editRegistro : m));
            toast.success('Motivo actualizado');
            setShowEditModal(false);
        } catch {
            toast.error('Error al actualizar');
        }
    };

    const handleDelete = async () => {
        if (!deleteRegistro) return;

        try {
            await fetchCliente(`/api/motivos_ausencia/delete/${deleteRegistro.id_motivo}`, {
                method: 'DELETE'
            });
            setMotivos(prev => prev.filter(m => m.id_motivo !== deleteRegistro.id_motivo));
            toast.success('Motivo eliminado');
            setDeleteRegistro(null);
        } catch {
            toast.error('Error al eliminar');
        }
    };

    const lstmotivos = Array.isArray(motivos) ? motivos : [];
    const filtered = lstmotivos.filter(e => e.descripcion.toLowerCase().includes(searchTerm.trim().toLowerCase()));

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, itemsPerPage]);

    if (loading) return <p className="text-center">Cargando Alumnos...</p>;
    if (error) return <p className="text-center text-danger">{error}...</p>;

    return (
        <div className="container">
            <ToastContainer />
            <h2 className="my-4">Motivos de Ausencia</h2>

            <div className="d-flex justify-content-between mb-3">
                <div className="form-group col-3">
                    <input type="text" className="form-control"
                        onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    Agregar
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr><th>ID</th><th>Descripción</th><th>#</th></tr>
                    </thead>
                    <tbody>
                        {pageData.length > 0 ? (
                            pageData.map(e => (
                                <tr key={e.id_motivo}>
                                    <td>{e.id_motivo}</td>
                                    <td>{e.descripcion}</td>
                                    <td>
                                        <button className="btn btn-warning me-2" onClick={() => openEdit(e)}><FaEdit /></button>
                                        <button className="btn btn-danger" onClick={() => setDeleteRegistro(e)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={3} className="text-center">No se encontraron motivos de ausencia</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Paginador
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
            />

            {showAddModal && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nuevo Motivo</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <input type="text" placeholder="Descripción" value={nuevoMotivo.descripcion} onChange={e => setNuevoMotivo({ ...nuevoMotivo, descripcion: e.target.value })} className="form-control" required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && editRegistro && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Motivo</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <input type="text" placeholder="Descripción" value={editRegistro.descripcion} onChange={e => setEditRegistro({ ...editRegistro, descripcion: e.target.value })} className="form-control" required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Actualizar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {deleteRegistro && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Eliminar Motivo</h5>
                                <button type="button" className="btn-close" onClick={() => setDeleteRegistro(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Eliminar motivo <strong>{deleteRegistro.descripcion}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setDeleteRegistro(null)}>Cancelar</button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
