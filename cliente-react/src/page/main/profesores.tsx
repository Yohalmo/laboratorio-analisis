import { useState, useEffect } from "react";
import { useProfesores } from "../../hook/useProfesores";
import Paginador from '../../components/paginador';
import { toast, ToastContainer } from "react-toastify";
import { fetchCliente } from "../../api/fetchCliente";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Profesor } from "../../interfaces/Profesor";

export default function Profesores() {
    const { profesores, loading, error, setProfesores } = useProfesores();

    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editRegistro, setEditRegistro] = useState<Profesor | null>(null);
    const [deleteRegistro, setDeleteRegistro] = useState<Profesor | null>(null);

    const [nuevoProfesor, setNuevoProfesor] = useState<Profesor>({
        id_profesor: '',
        nombre: '',
        apellido: '',
        especialidad: '',
        telefono: '',
        email: '',
        documento_identidad: ''
    });

    const validate = (p: Profesor) => {
        if (!p.nombre.trim()) return 'Nombre es obligatorio';
        if (!p.apellido.trim()) return 'Apellido es obligatorio';
        if (!p.especialidad.trim()) return 'Especialidad es obligatoria';
        if (!p.telefono.trim()) return 'Teléfono es obligatorio';
        if (!p.email.trim()) return 'Email es obligatorio';
        if (!p.documento_identidad.trim()) return 'Documento es obligatorio';
        return null;
    };

    const handleAdd = async () => {
        const msg = validate(nuevoProfesor);
        if (msg) return toast.error(msg);

        try {
            const res = await fetchCliente('/api/profesores/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProfesor)
            });
            setProfesores(prev => [...prev, { ...nuevoProfesor, id_profesor: res.id_profesor }]);
            toast.success('Profesor agregado');
            setShowAddModal(false);
            setNuevoProfesor({ id_profesor: '', nombre: '', apellido: '', especialidad: '', telefono: '', email: '', documento_identidad: '' });
        } catch {
            toast.error('Error al agregar');
        }
    };

    const openEdit = (profesor: Profesor) => {
        setEditRegistro(profesor);
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editRegistro) return;

        const msg = validate(editRegistro);
        if (msg) return toast.error(msg);

        try {
            await fetchCliente(`/api/profesores/update/${editRegistro.id_profesor}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editRegistro)
            });

            setProfesores(prev => prev.map(p => p.id_profesor === editRegistro.id_profesor ? editRegistro : p));
            toast.success('Profesor actualizado');
            setShowEditModal(false);
        } catch {
            toast.error('Error al actualizar');
        }
    };

    const handleDelete = async () => {
        if (!deleteRegistro) return;

        try {
            await fetchCliente(`/api/profesores/delete/${deleteRegistro.id_profesor}`, {
                method: 'DELETE'
            });
            setProfesores(prev => prev.filter(p => p.id_profesor !== deleteRegistro.id_profesor));
            setDeleteRegistro(null);
            toast.success('Profesor eliminado');
        } catch {
            toast.error('Error al eliminar');
        }
    };

    const lstprofesores = Array.isArray(profesores) ? profesores : [];
    const filtered = lstprofesores.filter(e => `${e.nombre} ${e.apellido}`.toLowerCase().includes(searchTerm.trim().toLowerCase()));
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    return (
        <div className="container">
            <ToastContainer />
            <h2>Profesores</h2>

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
                        <th>Apellido</th>
                        <th>Especialidad</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Documento</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(e => (
                        <tr key={e.id_profesor}>
                            <td>{e.nombre}</td>
                            <td>{e.apellido}</td>
                            <td>{e.especialidad}</td>
                            <td>{e.telefono}</td>
                            <td>{e.email}</td>
                            <td>{e.documento_identidad}</td>
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
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={e => { e.preventDefault(); handleAdd(); }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Nuevo Profesor</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {['nombre', 'apellido', 'especialidad', 'telefono', 'email', 'documento_identidad'].map(campo => (
                                        <div className="mb-3" key={campo}>
                                            <label className="form-label">{campo.charAt(0).toUpperCase() + campo.slice(1).replace('_', ' ')}</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={(nuevoProfesor as any)[campo]}
                                                onChange={e => setNuevoProfesor({ ...nuevoProfesor, [campo]: e.target.value })}
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
                                    <h5 className="modal-title">Editar Profesor</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    {['nombre', 'apellido', 'especialidad', 'telefono', 'email', 'documento_identidad'].map(campo => (
                                        <div className="mb-3" key={campo}>
                                            <label className="form-label">{campo.charAt(0).toUpperCase() + campo.slice(1).replace('_', ' ')}</label>
                                            <input
                                                type="text"
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
                                <h5 className="modal-title">Eliminar Profesor</h5>
                                <button type="button" className="btn-close" onClick={() => setDeleteRegistro(null)}></button>
                            </div>
                            <div className="modal-body">
                                ¿Está seguro que desea eliminar al profesor <strong>{deleteRegistro.nombre} {deleteRegistro.apellido}</strong>?
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
