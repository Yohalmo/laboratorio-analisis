import { useState, useEffect } from "react";
import { useAsistencias } from "../../hook/useAsistencias";
import Paginador from '../../components/paginador';

import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { fetchCliente } from "../../api/fetchCliente";

import { useAlumnos } from "../../hook/useAlumnos";
import { useMaterias } from "../../hook/useMaterias";
import { useMotivosAusencia } from "../../hook/useMotivosAusencia";
import type { Asistencia } from "../../interfaces/Asistencia";

export default function Asistencias() {
    const { asistencias, loading, error, setAsistencias } = useAsistencias();
    const { alumnos } = useAlumnos();
    const { materias } = useMaterias();
    const { motivos } = useMotivosAusencia();


    const [searchTerm, setSearchTerm] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [nuevoRegistro, setNuevoRegistro] = useState<Asistencia>({
        alumno: '', id_alumno: '', estado: '', fecha: '', materia: '', id_materia: '',
        motivo: '', id_motivo: '', id_asistencia: ''
    });

    const [showEditModal, setShowEditModal] = useState(false);
    const [editRegistro, setEditRegistro] = useState<Asistencia | null>(null);

    const [deleteRegistro, setDeleteRegistro] = useState<Asistencia | null>(null);

    const validate = (a: Omit<Asistencia, 'id_asistencia'>) => {
        if (!a.id_alumno) return 'Seleccione un alumno.';
        if (!a.estado.trim()) return 'El estado es obligatorio.';
        if (!a.fecha) return 'La fecha es obligatoria.';
        if (!a.id_materia) return 'Seleccione una materia.';
        if (!a.id_motivo) return 'Seleccione un motivo.';
        return null;
    };

    const lstasistencias = Array.isArray(asistencias) ? asistencias : [];

    const filtered = lstasistencias.filter(e => `${e.alumno}`
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    )

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    if (loading) return <p className="text-center">Cargando asistencias...</p>;
    if (error) return <p className="text-center text-danger">{error}...</p>;

    
    const formatDateForBackend = (iso: string): string => {
        const [y, m, d] = iso.split('-');
        return `${d}/${m}/${y}`;
    };

    const handleAdd = async () => {
        const msg = validate(nuevoRegistro);
        if (msg) return toast.error(msg);

        const alumno = alumnos.find(x => x.id_alumno === nuevoRegistro.id_alumno);
        const materia = materias.find(x => x.id_materia === nuevoRegistro.id_materia);
        const motivo = motivos.find(x => x.id_motivo === nuevoRegistro.id_motivo);
        nuevoRegistro.fecha = formatDateForBackend(nuevoRegistro.fecha);

        const payload = { ...nuevoRegistro };

        try {
            const res = await fetchCliente<{ id: string }>('/api/asistencias/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            setAsistencias(prev => [...prev, {
                ...nuevoRegistro,
                id_asistencia: res.id,
                alumno: alumno?.nombres || '',
                materia: materia?.nombre || '',
                motivo: motivo?.descripcion || ''
            }]);

            setShowAddModal(false);
            toast.success('Asistencia registrada.');
            setNuevoRegistro({
                alumno: '', id_alumno: '', estado: '', fecha: '', materia: '',
                id_materia: '', motivo: '', id_motivo: '', id_asistencia: ''
            });
        } catch (err: any) {
            toast.error(`Error: ${err.message}`);
        }
    };

    const openEdit = (a: Asistencia) => {
        setEditRegistro({
            ...a,
            alumno: alumnos.find(x => x.id_alumno === a.id_alumno)?.nombres || '',
            materia: materias.find(x => x.id_materia === a.id_materia)?.nombre || '',
            motivo: motivos.find(x => x.id_motivo === a.id_motivo)?.descripcion || ''
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editRegistro) return;
        const msg = validate(editRegistro);
        if (msg) return toast.error(msg);

        try {
            editRegistro.fecha = formatDateForBackend(editRegistro.fecha);

            await fetchCliente(`/api/asistencias/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editRegistro)
            });

            const alumno = alumnos.find(x => x.id_alumno === editRegistro.id_alumno);
            const materia = materias.find(x => x.id_materia === editRegistro.id_materia);
            const motivo = motivos.find(x => x.id_motivo === editRegistro.id_motivo);

            const actualizado = {
                ...editRegistro,
                alumno: alumno?.nombres || '',
                materia: materia?.nombre || '',
                motivo: motivo?.descripcion || ''
            };

            setAsistencias(prev => prev.map(a => a.id_asistencia === actualizado.id_asistencia ? actualizado : a));
            setShowEditModal(false);
            setEditRegistro(null);
            toast.success('Asistencia actualizada.');
        } catch (err: any) {
            toast.error(`Error al actualizar: ${err.message}`);
        }
    };

    const handleDelete = async () => {
        if (!deleteRegistro) return;

        try {
            await fetchCliente(`/api/asistencias/delete/${deleteRegistro.id_asistencia}`, {
                method: 'DELETE'
            });

            setAsistencias(prev => prev.filter(a => a.id_asistencia !== deleteRegistro.id_asistencia));
            setDeleteRegistro(null);
            toast.success('Asistencia eliminada.');
        } catch (err: any) {
            toast.error(`Error al eliminar: ${err.message}`);
        }
    };

    return (
        <div className="container">
            <ToastContainer />

            {showAddModal && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nueva Asistencia</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} />
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label>Alumno</label>
                                        <select className="form-select" required value={nuevoRegistro.id_alumno}
                                            onChange={e => {
                                                const id = e.target.value;
                                                const alumno = alumnos.find(a => a.id_alumno === id);
                                                setNuevoRegistro({ ...nuevoRegistro, id_alumno: id, alumno: alumno?.nombres || '' });
                                            }}>
                                            <option value="">Seleccione alumno</option>
                                            {alumnos.map(a => <option key={a.id_alumno} value={a.id_alumno}>{a.nombres}</option>)}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label>Estado</label>
                                        <select className="form-select" required value={nuevoRegistro.estado}
                                            onChange={e => setNuevoRegistro({ ...nuevoRegistro, estado: e.target.value })}>
                                            <option value="">Seleccione estado</option>
                                            <option value="PRESENTE">PRESENTE</option>
                                            <option value="AUSENTE">AUSENTE</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label>Fecha</label>
                                        <input type="date" className="form-control" required value={nuevoRegistro.fecha}
                                            onChange={e => setNuevoRegistro({ ...nuevoRegistro, fecha: e.target.value })} />
                                    </div>

                                    <div className="mb-3">
                                        <label>Materia</label>
                                        <select className="form-select" required value={nuevoRegistro.id_materia}
                                            onChange={e => {
                                                const id = e.target.value;
                                                const materia = materias.find(m => m.id_materia === id);
                                                setNuevoRegistro({ ...nuevoRegistro, id_materia: id, materia: materia?.materia || '' });
                                            }}>
                                            <option value="">Seleccione materia</option>
                                            {materias.map(m => <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>)}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label>Motivo</label>
                                        <select className="form-select" required value={nuevoRegistro.id_motivo}
                                            onChange={e => {
                                                const id = e.target.value;
                                                const motivo = motivos.find(m => m.id_motivo === id);
                                                setNuevoRegistro({ ...nuevoRegistro, id_motivo: id, motivo: motivo?.motivo || '' });
                                            }}>
                                            <option value="">Seleccione motivo</option>
                                            {motivos.map(m => <option key={m.id_motivo} value={m.id_motivo}>{m.descripcion}</option>)}
                                        </select>
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
                                <h5 className="modal-title">Editar Asistencia</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} />
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label>Alumno</label>
                                        <select className="form-select" required value={editRegistro.id_alumno}
                                            onChange={e => {
                                                const id = e.target.value;
                                                const alumno = alumnos.find(a => a.id_alumno === id);
                                                setEditRegistro({ ...editRegistro, id_alumno: id, alumno: alumno?.nombres || '' });
                                            }}>
                                            <option value="">Seleccione alumno</option>
                                            {alumnos.map(a => <option key={a.id_alumno} value={a.id_alumno}>{a.nombres}</option>)}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label>Estado</label>
                                        <select className="form-select" required value={editRegistro.estado}
                                            onChange={e => setEditRegistro({ ...editRegistro, estado: e.target.value })}>
                                            <option value="">Seleccione estado</option>
                                            <option value="PRESENTE">PRESENTE</option>
                                            <option value="AUSENTE">AUSENTE</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label>Fecha</label>
                                        <input type="date" className="form-control" required value={editRegistro.fecha}
                                            onChange={e => setEditRegistro({ ...editRegistro, fecha: e.target.value })} />
                                    </div>

                                    <div className="mb-3">
                                        <label>Materia</label>
                                        <select className="form-select" required value={editRegistro.id_materia}
                                            onChange={e => {
                                                const id = e.target.value;
                                                const materia = materias.find(m => m.id_materia === id);
                                                setEditRegistro({ ...editRegistro, id_materia: id, materia: materia?.materia || '' });
                                            }}>
                                            <option value="">Seleccione materia</option>
                                            {materias.map(m => <option key={m.id_materia} value={m.id_materia}>{m.nombre}</option>)}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label>Motivo</label>
                                        <select className="form-select" required value={editRegistro.id_motivo}
                                            onChange={e => {
                                                const id = e.target.value;
                                                const motivo = motivos.find(m => m.id_motivo === id);
                                                setEditRegistro({ ...editRegistro, id_motivo: id, motivo: motivo?.motivo || '' });
                                            }}>
                                            <option value="">Seleccione motivo</option>
                                            {motivos.map(m => <option key={m.id_motivo} value={m.id_motivo}>{m.descripcion}</option>)}
                                        </select>
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
                        <div className="modal-content border border-danger">
                            <div className="modal-header">
                                <h5 className="modal-title text-danger">Eliminar Asistencia</h5>
                            </div>
                            <div className="modal-body">
                                <p>¿Desea eliminar la asistencia de <strong>{deleteRegistro.alumno}</strong> en la materia <strong>{deleteRegistro.materia}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={handleDelete}>Confirmar</button>
                                <button className="btn btn-secondary" onClick={() => setDeleteRegistro(null)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            <h2>Asistencias</h2>

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
                        <th>Alumno</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Materia</th>
                        <th>Motivo</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(e => (
                        <tr key={e.id_asistencia}>
                            <td>{e.alumno}</td>
                            <td>{e.estado}</td>
                            <td>{e.fecha}</td>
                            <td>{e.materia}</td>
                            <td>{e.motivo}</td>
                            <td>
                                <td>
                                    <button className="btn btn-warning me-2" onClick={() => openEdit(e)}><FaEdit /></button>
                                    <button className="btn btn-danger" onClick={() => setDeleteRegistro(e)}><FaTrash /></button>
                                </td>

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