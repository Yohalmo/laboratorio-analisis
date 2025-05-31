import { useState, useEffect } from "react";
import { useTelefonos } from "../../hook/useTelefonos";
import Paginador from '../../components/paginador';
import { toast, ToastContainer } from "react-toastify";
import { fetchCliente } from "../../api/fetchCliente";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Telefono } from "../../interfaces/Telefono";

export default function Telefonos() {
    const { telefonos, loading, error, setTelefonos } = useTelefonos();

    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editRegistro, setEditRegistro] = useState<Telefono | null>(null);
    const [deleteRegistro, setDeleteRegistro] = useState<Telefono | null>(null);

    const [nuevoTelefono, setNuevoTelefono] = useState<Telefono>({
        id_telefono: '',
        fecha_creacion: '',
        numero_telefono: '',
        nombre: '',
        codigo_pais: ''
    });

    const validate = (t: Telefono) => {
        if (!t.nombre.trim()) return 'Nombre es obligatorio';
        if (!t.numero_telefono.trim()) return 'Número de teléfono es obligatorio';
        if (!t.codigo_pais.trim()) return 'Código de país es obligatorio';
        if (!t.fecha_creacion.trim()) return 'Fecha de creación es obligatoria';
        return null;
    };

    const formatDateForBackend = (iso: string): string => {
        const [y, m, d] = iso.split('-');
        return `${d}/${m}/${y}`;
    };

    const handleAdd = async () => {
        const msg = validate(nuevoTelefono);
        if (msg) return toast.error(msg);

        try {
            nuevoTelefono.fecha_creacion = formatDateForBackend(nuevoTelefono.fecha_creacion);

            const res = await fetchCliente('/api/telefonos/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoTelefono)
            });
            setTelefonos(prev => [...prev, { ...nuevoTelefono, id_telefono: res.id }]);
            toast.success('Teléfono agregado');
            setShowAddModal(false);
            setNuevoTelefono({ id_telefono: '', fecha_creacion: '', numero_telefono: '', nombre: '', codigo_pais: '' });
        } catch {
            toast.error('Error al agregar');
        }
    };

    const openEdit = (t: Telefono) => {
        setEditRegistro(t);
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editRegistro) return;
        const msg = validate(editRegistro);
        if (msg) return toast.error(msg);

        try {
            editRegistro.fecha_creacion = formatDateForBackend(editRegistro.fecha_creacion);
            await fetchCliente(`/api/telefonos/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editRegistro)
            });
            setTelefonos(prev => prev.map(t => t.id_telefono === editRegistro.id_telefono ? editRegistro : t));
            toast.success('Teléfono actualizado');
            setShowEditModal(false);
        } catch {
            toast.error('Error al actualizar');
        }
    };

    const handleDelete = async () => {
        if (!deleteRegistro) return;
        try {
            await fetchCliente(`/api/telefonos/delete/${deleteRegistro.id_telefono}`, { method: 'DELETE' });
            setTelefonos(prev => prev.filter(t => t.id_telefono !== deleteRegistro.id_telefono));
            setDeleteRegistro(null);
            toast.success('Teléfono eliminado');
        } catch {
            toast.error('Error al eliminar');
        }
    };

    const lsttelefonos = Array.isArray(telefonos) ? telefonos : [];
    const filtered = lsttelefonos.filter(e => `${e.nombre} ${e.numero_telefono}`.toLowerCase().includes(searchTerm.trim().toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, itemsPerPage]);

    if (loading) return <p className="text-center">Cargando Alumnos...</p>;
    if (error) return <p className="text-center text-danger">{error}...</p>;

    return (
        <div className="container">
            <ToastContainer />
            <h2>Teléfonos</h2>

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
                        <th>Teléfono</th>
                        <th>Código País</th>
                        <th>Fecha Creación</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(e => (
                        <tr key={e.id_telefono}>
                            <td>{e.nombre}</td>
                            <td>{e.numero_telefono}</td>
                            <td>{e.codigo_pais}</td>
                            <td>{e.fecha_creacion}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => openEdit(e)}><FaEdit /></button>
                                <button className="btn btn-danger" onClick={() => setDeleteRegistro(e)}><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Paginador {...{ currentPage, totalPages, itemsPerPage, setCurrentPage, setItemsPerPage }} />

            {showAddModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={e => { e.preventDefault(); handleAdd(); }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Nuevo Teléfono</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {['nombre', 'numero_telefono', 'codigo_pais', 'fecha_creacion'].map(campo => (
                                        <div className="mb-3" key={campo}>
                                            <label className="form-label">{campo.replace('_', ' ').toUpperCase()}</label>
                                            <input
                                                type={campo.includes('fecha') ? 'date' : 'text'}
                                                className="form-control"
                                                value={(nuevoTelefono as any)[campo]}
                                                onChange={e => setNuevoTelefono({ ...nuevoTelefono, [campo]: e.target.value })}
                                                required
                                            />
                                        </div>
                                    ))}
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
                                    <h5 className="modal-title">Editar Teléfono</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {['nombre', 'numero_telefono', 'codigo_pais', 'fecha_creacion'].map(campo => (
                                        <div className="mb-3" key={campo}>
                                            <label className="form-label">{campo.replace('_', ' ').toUpperCase()}</label>
                                            <input
                                                type={campo.includes('fecha') ? 'date' : 'text'}
                                                className="form-control"
                                                value={(editRegistro as any)[campo]}
                                                onChange={e => setEditRegistro({ ...editRegistro, [campo]: e.target.value })}
                                                required
                                            />
                                        </div>
                                    ))}
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
                                <h5 className="modal-title">Eliminar Teléfono</h5>
                                <button type="button" className="btn-close" onClick={() => setDeleteRegistro(null)}></button>
                            </div>
                            <div className="modal-body">
                                ¿Está seguro que desea eliminar el número <strong>{deleteRegistro.numero_telefono}</strong>?
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
