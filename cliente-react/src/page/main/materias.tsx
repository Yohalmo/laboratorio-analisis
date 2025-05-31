import { useState, useEffect, FormEvent } from "react";
import { useMaterias } from "../../hook/useMaterias";
import Paginador from '../../components/paginador';
import { toast, ToastContainer } from "react-toastify";
import { fetchCliente } from "../../api/fetchCliente";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Materia } from "../../interfaces/Materia";

export default function Materias() {
    const { materias, loading, error, setMaterias } = useMaterias();

    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editRegistro, setEditRegistro] = useState<Materia | null>(null);
    const [deleteRegistro, setDeleteRegistro] = useState<Materia | null>(null);

    const [nuevoMateria, setNuevoMateria] = useState<Materia>({
        id_materia: '',
        nombre: '',
        descripcion: ''
    });

    const validate = (m: Materia) => {
        if (!m.nombre.trim()) return 'Nombre es obligatorio';
        if (!m.descripcion.trim()) return 'Descripción es obligatoria';
        return null;
    };

    const handleAdd = async () => {
        const msg = validate(nuevoMateria);
        if (msg) return toast.error(msg);

        try {
            const res = await fetchCliente('/api/materias/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoMateria)
            });

            setMaterias(prev => [...prev, { ...nuevoMateria, id_materia: res.id }]);
            toast.success('Materia agregada');
            setShowAddModal(false);
            setNuevoMateria({ id_materia: '', nombre: '', descripcion: '' });
        } catch (err) {
            toast.error('Error al agregar');
        }
    };

    const openEdit = (materia: Materia) => {
        setEditRegistro(materia);
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editRegistro) return;

        const msg = validate(editRegistro);
        if (msg) return toast.error(msg);

        try {
            await fetchCliente(`/api/materias/update/${editRegistro.id_materia}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editRegistro)
            });

            setMaterias(prev => prev.map(m => m.id_materia === editRegistro.id_materia ? editRegistro : m));
            toast.success('Materia actualizada');
            setShowEditModal(false);
        } catch (err) {
            toast.error('Error al actualizar');
        }
    };

    const handleDelete = async () => {
        if (!deleteRegistro) return;

        try {
            await fetchCliente(`/api/materias/delete/${deleteRegistro.id_materia}`, {
                method: 'DELETE'
            });

            setMaterias(prev => prev.filter(m => m.id_materia !== deleteRegistro.id_materia));
            toast.success('Materia eliminada');
            setDeleteRegistro(null);
        } catch (err) {
            toast.error('Error al eliminar');
        }
    };

    const lstmaterias = Array.isArray(materias) ? materias : [];
    const filtered = lstmaterias.filter(e => `${e.nombre} ${e.descripcion}`.toLowerCase().includes(searchTerm.trim().toLowerCase()));

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => setCurrentPage(1), [searchTerm, itemsPerPage]);

    return (
        <div className="container">
            <ToastContainer />
            <h2 className="my-4">Materias</h2>

            <div className="d-flex justify-content-between mb-3">
                <div className="form-group col-3">
                    <input type="text" className="form-control"
                        onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    Agregar
                </button>
            </div>

            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(m => (
                        <tr key={m.id_materia}>
                            <td>{m.id_materia}</td>
                            <td>{m.nombre}</td>
                            <td>{m.descripcion}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => openEdit(m)}><FaEdit /></button>
                                <button className="btn btn-danger" onClick={() => setDeleteRegistro(m)}><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Paginador
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
                setItemsPerPage={setItemsPerPage}
            />

            {showAddModal && (
                <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleAdd(); }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Agregar Materia</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <label htmlFor="">Nombre</label>
                                    <input className="form-control mb-3" placeholder="Nombre" value={nuevoMateria.nombre} onChange={e => setNuevoMateria({ ...nuevoMateria, nombre: e.target.value })} required />
                                    <label htmlFor="">Descripcion</label>
                                    <textarea className="form-control" placeholder="Descripción" value={nuevoMateria.descripcion} onChange={e => setNuevoMateria({ ...nuevoMateria, descripcion: e.target.value })} required />
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-success">Guardar</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && editRegistro && (
                <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleUpdate(); }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar Materia</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    
                                    <label htmlFor="">Nombre</label>
                                    <input className="form-control mb-3" placeholder="Nombre" value={editRegistro.nombre} onChange={e => setEditRegistro({ ...editRegistro, nombre: e.target.value })} required />
                                    
                                    <label htmlFor="">Descripcion</label>
                                    <textarea className="form-control" placeholder="Descripción" value={editRegistro.descripcion} onChange={e => setEditRegistro({ ...editRegistro, descripcion: e.target.value })} required />
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-success">Guardar</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {deleteRegistro && (
                <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Eliminar Materia</h5>
                                <button type="button" className="btn-close" onClick={() => setDeleteRegistro(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Está seguro que desea eliminar <strong>{deleteRegistro.nombre}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={handleDelete}>Confirmar</button>
                                <button className="btn btn-secondary" onClick={() => setDeleteRegistro(null)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
