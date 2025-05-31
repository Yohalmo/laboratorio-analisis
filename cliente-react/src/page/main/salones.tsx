import { useState, useEffect } from "react";
import { useSalones } from "../../hook/useSalones";
import Paginador from '../../components/paginador';
import { toast, ToastContainer } from "react-toastify";
import { fetchCliente } from "../../api/fetchCliente";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Salon } from "../../interfaces/Salon";

export default function Salones() {
    const { salones, loading, error, setSalones } = useSalones();

    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editRegistro, setEditRegistro] = useState<Salon | null>(null);
    const [deleteRegistro, setDeleteRegistro] = useState<Salon | null>(null);

    const [nuevoSalon, setNuevoSalon] = useState<Salon>({
        id_salon: '',
        nombre: '',
        capacidad: 0,
        ubicacion: '',
        observaciones: ''
    });

    const validate = (s: Salon) => {
        if (!s.nombre.trim()) return 'Nombre obligatorio';
        if (!s.capacidad || s.capacidad <= 0) return 'Capacidad inválida';
        if (!s.ubicacion.trim()) return 'Ubicación obligatoria';
        return null;
    };

    const handleAdd = async () => {
        const msg = validate(nuevoSalon);
        if (msg) return toast.error(msg);

        try {
            const res = await fetchCliente('/api/salones/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoSalon)
            });
            setSalones(prev => [...prev, { ...nuevoSalon, id_salon: res.id_salon }]);
            toast.success('Salón agregado');
            setShowAddModal(false);
            setNuevoSalon({ id_salon: '', nombre: '', capacidad: 0, ubicacion: '', observaciones: '' });
        } catch (ex) {
            console.log(ex);
            toast.error('Error al agregar');
        }
    };

    const openEdit = (salon: Salon) => {
        setEditRegistro(salon);
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editRegistro) return;

        const msg = validate(editRegistro);
        if (msg) return toast.error(msg);

        try {
            await fetchCliente(`/api/salones/update/${editRegistro.id_salon}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editRegistro)
            });
            setSalones(prev => prev.map(s => s.id_salon === editRegistro.id_salon ? editRegistro : s));
            toast.success('Salón actualizado');
            setShowEditModal(false);
        } catch {
            toast.error('Error al actualizar');
        }
    };

    const handleDelete = async () => {
        if (!deleteRegistro) return;

        try {
            await fetchCliente(`/api/salones/delete/${deleteRegistro.id_salon}`, {
                method: 'DELETE'
            });
            setSalones(prev => prev.filter(s => s.id_salon !== deleteRegistro.id_salon));
            toast.success('Salón eliminado');
            setDeleteRegistro(null);
        } catch {
            toast.error('Error al eliminar');
        }
    };

    const lstsalones = Array.isArray(salones) ? salones : [];
    const filtered = lstsalones.filter(e => e.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, itemsPerPage]);

    return (
        <div className="container">
            <ToastContainer />
            <h2>Salones</h2>
            <div className="d-flex justify-content-between">
                <div className="form-group col-3">
                    <input type="text" className="form-control"
                        onChange={e => setSearchTerm(e.target.value)} />
                </div>

                <button className="btn btn-primary" type="button"
                    onClick={() => setShowAddModal(true)}>
                    Agregar
                </button>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Capacidad</th>
                        <th>Ubicación</th>
                        <th>Observaciones</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(e => (
                        <tr key={e.id_salon}>
                            <td>{e.nombre}</td>
                            <td>{e.capacidad}</td>
                            <td>{e.ubicacion}</td>
                            <td>{e.observaciones ?? '---'}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => openEdit(e)}><FaEdit /></button>
                                <button className="btn btn-danger" onClick={() => setDeleteRegistro(e)}><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Paginador currentPage={currentPage} totalPages={totalPages} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} setItemsPerPage={setItemsPerPage} />

            {showAddModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={e => { e.preventDefault(); handleAdd(); }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Nuevo Salón</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" className="form-control" value={nuevoSalon.nombre} onChange={e => setNuevoSalon({ ...nuevoSalon, nombre: e.target.value })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Capacidad</label>
                                        <input type="number" className="form-control" value={nuevoSalon.capacidad} onChange={e => setNuevoSalon({ ...nuevoSalon, capacidad: Number(e.target.value) })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ubicación</label>
                                        <input type="text" className="form-control" value={nuevoSalon.ubicacion} onChange={e => setNuevoSalon({ ...nuevoSalon, ubicacion: e.target.value })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Observaciones</label>
                                        <input type="text" className="form-control" value={nuevoSalon.observaciones} onChange={e => setNuevoSalon({ ...nuevoSalon, observaciones: e.target.value })} />
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
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar Salón</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" className="form-control" value={editRegistro.nombre} onChange={e => setEditRegistro({ ...editRegistro, nombre: e.target.value })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Capacidad</label>
                                        <input type="number" className="form-control" value={editRegistro.capacidad} onChange={e => setEditRegistro({ ...editRegistro, capacidad: Number(e.target.value) })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ubicación</label>
                                        <input type="text" className="form-control" value={editRegistro.ubicacion} onChange={e => setEditRegistro({ ...editRegistro, ubicacion: e.target.value })} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Observaciones</label>
                                        <input type="text" className="form-control" value={editRegistro.observaciones} onChange={e => setEditRegistro({ ...editRegistro, observaciones: e.target.value })} />
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
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Eliminar Salón</h5>
                                <button type="button" className="btn-close" onClick={() => setDeleteRegistro(null)}></button>
                            </div>
                            <div className="modal-body">
                                ¿Está seguro que desea eliminar el salón <strong>{deleteRegistro.nombre}</strong>?
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setDeleteRegistro(null)}>Cancelar</button>
                                <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
