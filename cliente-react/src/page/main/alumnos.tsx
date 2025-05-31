import { useState, useEffect } from "react";
import { useAlumnos } from "../../hook/useAlumnos";
import Paginador from '../../components/paginador';
import type { Alumno } from "../../interfaces/Alumno";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { fetchCliente } from "../../api/fetchCliente";

export default function Alumnos() {

    const { alumnos, loading, error, setAlumnos } = useAlumnos();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);


    const validate = (alumno: Omit<Alumno, 'id_alumno'>) => {
        if (!alumno.nombres.trim()) return 'El nombre es obligatorio.';
        if (!alumno.apellidos.trim()) return 'Los apellidos son obligatorios.';
        if (!alumno.fecha_nacimiento) return 'La fecha de nacimiento es obligatoria.';
        if (!alumno.direccion.trim()) return 'La dirección es obligatoria.';
        if (!alumno.telefono.trim()) return 'El teléfono es obligatorio.';
        if (!alumno.email.trim()) return 'El correo electrónico es obligatorio.';
        return null;
    };

    const formatDateForBackend = (iso: string): string => {
        const [y, m, d] = iso.split('-');
        return `${d}/${m}/${y}`;
    };

    const handleAdd = async () => {
        const msg = validate(nuevoAlumno)
        if (msg) {
            toast.error(msg)
            return
        }

        try {
            const payload = {
                nombres: nuevoAlumno.nombres,
                apellidos: nuevoAlumno.apellidos,
                fecha_nacimiento: formatDateForBackend(nuevoAlumno.fecha_nacimiento),
                direccion: nuevoAlumno.direccion,
                telefono: nuevoAlumno.telefono,
                email: nuevoAlumno.email
            }

            const res = await fetchCliente<{id:string}>(`/api/alumnos/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })

            setAlumnos(prev => [...prev, { id_alumno: res.id, ...nuevoAlumno }]);

            toast.success('Alumno agregado exitosamente.')
            setShowAddModal(false)

            setNuevoAlumno({
                nombres: '',
                apellidos: '',
                fecha_nacimiento: '',
                direccion: '',
                telefono: '',
                email: '',
                id_alumno: ''
            })

        } catch (err: any) {
            toast.error(`Error al agregar: ${err.message}`)
        }
    }

    const openEdit = (a: Alumno) => {
        setEditingRegistro(a);
        setEditRegistro({
            nombres: a.nombres,
            apellidos: a.apellidos,
            fecha_nacimiento: a.fecha_nacimiento,
            direccion: a.direccion,
            telefono: a.telefono,
            email: a.email,
            id_alumno: a.id_alumno
        });
        
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editingRegistro) return;

        const msg = validate(editRegistro);
        if (msg) {
            toast.error(msg);
            return;
        }

        try {
            const payload = {
                nombres: editRegistro.nombres,
                apellidos: editRegistro.apellidos,
                fecha_nacimiento: formatDateForBackend(editRegistro.fecha_nacimiento),
                direccion: editRegistro.direccion,
                telefono: editRegistro.telefono,
                email: editRegistro.email,
                id_alumno: editRegistro.id_alumno
            };

            await fetchCliente(`/api/alumnos/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            setAlumnos(prev =>
                prev.map(alumno =>
                    alumno.id_alumno === editingRegistro.id_alumno
                        ? { ...alumno, ...editRegistro }
                        : alumno
                )
            );

            toast.success('Alumno actualizado.');
            setShowEditModal(false);
            setEditingRegistro(null);

        } catch (err: any) {
            toast.error(`Error al actualizar: ${err.message}`);
        }
    };

    const handleDelete = async () => {
        if (!deleteRegistro) return;

        try {
            await fetchCliente(`/api/alumnos/delete/${deleteRegistro.id_alumno}`, {
                method: 'DELETE'
            });

            setAlumnos(prev =>
                prev.filter(alumno => alumno.id_alumno !== deleteRegistro.id_alumno)
            );

            toast.success('Alumno eliminado.');
            setDeleteRegistro(null);

        } catch (err: any) {
            toast.error(`Error al eliminar: ${err.message}`);
        }
    };


    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [nuevoAlumno, setNuevoAlumno] = useState<Alumno>({
        nombres: '', apellidos: '', fecha_nacimiento: '', direccion: '', telefono: '', email: '', id_alumno: ''
    })
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [editingRegistro, setEditingRegistro] = useState<Alumno | null>(null);
    const [editRegistro, setEditRegistro] = useState<Alumno>(nuevoAlumno);
    const [deleteRegistro, setDeleteRegistro] = useState<Alumno | null>(null);


    const lstalumnos = Array.isArray(alumnos) ? alumnos : [];

    const filtered = lstalumnos.filter(e => `${e.nombres} ${e.apellidos}`
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    )

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    if (loading) return <p className="text-center">Cargando Alumnos...</p>;
    if (error) return <p className="text-center text-danger">{error}...</p>;

    return (
        <div className="container">
            <ToastContainer />

            {showAddModal && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nuevo Alumno</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <form onSubmit={(e: FormEvent) => { e.preventDefault(); handleAdd(); }}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <input type="text" placeholder="Nombres" value={nuevoAlumno.nombres}
                                            onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, nombres: e.target.value })}
                                            className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" placeholder="Apellidos" value={nuevoAlumno.apellidos}
                                            onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, apellidos: e.target.value })}
                                            className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <input type="date" value={nuevoAlumno.fecha_nacimiento}
                                            onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, fecha_nacimiento: e.target.value })}
                                            className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" placeholder="Dirección" value={nuevoAlumno.direccion}
                                            onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, direccion: e.target.value })}
                                            className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" placeholder="Teléfono" value={nuevoAlumno.telefono}
                                            onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, telefono: e.target.value })}
                                            className="form-control" required />
                                    </div>
                                    <div className="mb-3">
                                        <input type="email" placeholder="Correo electrónico" value={nuevoAlumno.email}
                                            onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, email: e.target.value })}
                                            className="form-control" required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && editingRegistro && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Alumno</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>

                            <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleUpdate(); }}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <input type="text" className="form-control" placeholder="Nombres"
                                            value={editRegistro.nombres}
                                            onChange={(e) => setEditRegistro({ ...editRegistro, nombres: e.target.value })}
                                            required />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" placeholder="Apellidos"
                                            value={editRegistro.apellidos}
                                            onChange={(e) => setEditRegistro({ ...editRegistro, apellidos: e.target.value })}
                                            required />
                                    </div>
                                    <div className="mb-3">
                                        <input type="date" className="form-control"
                                            value={editRegistro.fecha_nacimiento}
                                            onChange={(e) => setEditRegistro({ ...editRegistro, fecha_nacimiento: e.target.value })}
                                            required />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" placeholder="Dirección"
                                            value={editRegistro.direccion}
                                            onChange={(e) => setEditRegistro({ ...editRegistro, direccion: e.target.value })}
                                            required />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" className="form-control" placeholder="Teléfono"
                                            value={editRegistro.telefono}
                                            onChange={(e) => setEditRegistro({ ...editRegistro, telefono: e.target.value })}
                                            required />
                                    </div>
                                    <div className="mb-3">
                                        <input type="email" className="form-control" placeholder="Correo electrónico"
                                            value={editRegistro.email}
                                            onChange={(e) => setEditRegistro({ ...editRegistro, email: e.target.value })}
                                            required />
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {deleteRegistro && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border border-danger">
                            <div className="modal-header">
                                <h5 className="modal-title text-danger">Eliminar Alumno</h5>
                            </div>

                            <div className="modal-body">
                                <p className="mb-3">
                                    ¿Eliminar a <strong>{deleteRegistro.nombres} {deleteRegistro.apellidos}</strong>?
                                </p>
                            </div>

                            <div className="modal-footer d-flex justify-content-end gap-2">
                                <button
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                >
                                    Confirmar
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setDeleteRegistro(null)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h2>Alumnos</h2>

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
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Fecha de nacimiento</th>
                        <th>Direccion</th>
                        <th>Telefono</th>
                        <th>Email</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(e => (
                        <tr key={e.id_alumno}>
                            <td>{e.nombres}</td>
                            <td>{e.apellidos}</td>
                            <td>{e.fecha_nacimiento}</td>
                            <td>{e.direccion}</td>
                            <td>{e.telefono}</td>
                            <td>{e.email}</td>
                            <td>
                                <button className="btn btn-warning text-white me-2" type="button"
                                    onClick={() => openEdit(e)}>
                                    <FaEdit />
                                </button>
                                <button className="btn btn-danger text-white" type="button"
                                    onClick={() => setDeleteRegistro(e)}>
                                    <FaTrash />
                                </button>
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
        </div>
    )
}
