import { useState, useEffect } from "react";
import { usePeriodos } from "../../hook/usePeriodos";
import Paginador from '../../components/paginador';
import { ToastContainer, toast } from "react-toastify";
import { fetchCliente } from "../../api/fetchCliente";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Periodo } from "../../interfaces/Periodo";

export default function Periodos() {
    const { periodos, loading, error, setPeriodos } = usePeriodos();

    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editRegistro, setEditRegistro] = useState<Periodo | null>(null);
    const [deleteRegistro, setDeleteRegistro] = useState<Periodo | null>(null);

    const [nuevoPeriodo, setNuevoPeriodo] = useState<Periodo>({
        id_periodo: '',
        nombre: '',
        fecha_inicio: '',
        fecha_finalizacion: ''
    });

    const validate = (p: Periodo) => {
        if (!p.nombre.trim()) return 'Nombre es obligatorio';
        if (!p.fecha_inicio) return 'Fecha de inicio es obligatoria';
        if (!p.fecha_finalizacion) return 'Fecha de finalización es obligatoria';
        return null;
    };

    const handleAdd = async () => {
        const msg = validate(nuevoPeriodo);
        if (msg) return toast.error(msg);

        try {
            const res = await fetchCliente(`/api/periodos/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoPeriodo)
            });
            setPeriodos(prev => [...prev, { ...nuevoPeriodo, id_periodo: res.id_periodo }]);
            toast.success('Periodo agregado');
            setShowAddModal(false);
            setNuevoPeriodo({ id_periodo: '', nombre: '', fecha_inicio: '', fecha_finalizacion: '' });
        } catch {
            toast.error('Error al agregar');
        }
    };

    const openEdit = (p: Periodo) => {
        setEditRegistro(p);
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editRegistro) return;
        const msg = validate(editRegistro);
        if (msg) return toast.error(msg);

        try {
            await fetchCliente(`/api/periodos/update/${editRegistro.id_periodo}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editRegistro)
            });

            setPeriodos(prev => prev.map(p => p.id_periodo === editRegistro.id_periodo ? editRegistro : p));
            toast.success('Periodo actualizado');
            setShowEditModal(false);
        } catch {
            toast.error('Error al actualizar');
        }
    };

    const handleDelete = async () => {
        if (!deleteRegistro) return;
        try {
            await fetchCliente(`/api/periodos/delete/${deleteRegistro.id_periodo}`, { method: 'DELETE' });
            setPeriodos(prev => prev.filter(p => p.id_periodo !== deleteRegistro.id_periodo));
            toast.success('Periodo eliminado');
            setDeleteRegistro(null);
        } catch {
            toast.error('Error al eliminar');
        }
    };

    const filtered = (Array.isArray(periodos) ? periodos : []).filter(e =>
        e.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, itemsPerPage]);

    return (
        <div className="container">
            <ToastContainer />
            <h2>Periodos</h2>

            <div className="d-flex justify-content-between mb-3">
                <div className="form-group col-3">
                    <input type="text" className="form-control"
                        onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    Agregar
                </button>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Finalización</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(e => (
                        <tr key={e.id_periodo}>
                            <td>{e.nombre}</td>
                            <td>{e.fecha_inicio}</td>
                            <td>{e.fecha_finalizacion}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => openEdit(e)}><FaEdit /></button>
                                <button className="btn btn-danger" onClick={() => setDeleteRegistro(e)}><FaTrash /></button>
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
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nuevo Periodo</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
                                <div className="modal-body">
                                    <label htmlFor="">Nombre</label>
                                    <input type="text" className="form-control mb-2" placeholder="Nombre"
                                        value={nuevoPeriodo.nombre}
                                        onChange={e => setNuevoPeriodo({ ...nuevoPeriodo, nombre: e.target.value })} />
                                    
                                    <label htmlFor="">Fecha de inicio</label>
                                    <input type="date" className="form-control mb-2"
                                        value={nuevoPeriodo.fecha_inicio}
                                        onChange={e => setNuevoPeriodo({ ...nuevoPeriodo, fecha_inicio: e.target.value })} />
                                    
                                    <label htmlFor="">Fecha de finalizacion</label>
                                    <input type="date" className="form-control"
                                        value={nuevoPeriodo.fecha_finalizacion}
                                        onChange={e => setNuevoPeriodo({ ...nuevoPeriodo, fecha_finalizacion: e.target.value })} />
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
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Periodo</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                                <div className="modal-body">
                                    
                                    <label htmlFor="">Nombre</label>
                                    <input type="text" className="form-control mb-2" placeholder="Nombre"
                                        value={editRegistro.nombre}
                                        onChange={e => setEditRegistro({ ...editRegistro, nombre: e.target.value })} />
                                    
                                    <label htmlFor="">Fecha de inicio</label>
                                    <input type="date" className="form-control mb-2"
                                        value={editRegistro.fecha_inicio}
                                        onChange={e => setEditRegistro({ ...editRegistro, fecha_inicio: e.target.value })} />
                                    
                                    <label htmlFor="">Fecha de finalizacion</label>
                                    <input type="date" className="form-control"
                                        value={editRegistro.fecha_finalizacion}
                                        onChange={e => setEditRegistro({ ...editRegistro, fecha_finalizacion: e.target.value })} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {deleteRegistro && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Eliminar Periodo</h5>
                            </div>
                            <div className="modal-body">
                                ¿Está seguro que desea eliminar el periodo <strong>{deleteRegistro.nombre}</strong>?
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
