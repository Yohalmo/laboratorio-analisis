import { useState, useEffect } from "react";
import { useReportes } from "../../hook/useReportes";
import Paginador from '../../components/paginador';

import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { fetchCliente } from "../../api/fetchCliente";

import type { Reporte } from "../../interfaces/Reporte";

import { useAlumnos } from "../../hook/useAlumnos";
import { usePeriodos } from "../../hook/usePeriodos";

export default function Reportes() {

    const { reportes, loading, error, setReportes } = useReportes();
    const { alumnos } = useAlumnos();
    const { periodos } = usePeriodos();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);


    const [nuevoReporte, setNuevoReporte] = useState<Reporte>({ alumno: '', fecha: '', observaciones: '', periodo: '', id_periodo: '', id_alumno: '', id_reporte: '' });
    const [editReporte, setEditReporte] = useState<Reporte | null>(null);
    const [deleteReporte, setDeleteReporte] = useState<Reporte | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const lstreportes = Array.isArray(reportes) ? reportes : [];

    const filtered = lstreportes.filter(e => `${e.alumno}`
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase())
    )

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    if (loading) return <p className="text-center">Cargando reportes...</p>;
    if (error) return <p className="text-center text-danger">{error}...</p>;

    const validate = (r: Omit<Reporte, 'id_reporte'>) => {
        if (!r.fecha) return 'Fecha requerida';
        if (!r.observaciones.trim()) return 'Observaciones requeridas';
        if (!r.id_periodo.trim()) return 'ID de período requerido';
        if (!r.id_alumno.trim()) return 'ID del alumno requerido';
        return null;
    };


    const handleDelete = async () => {
        if (!deleteReporte) return;

        try {
            await fetchCliente(`/api/reportes/delete/${deleteReporte.id_reporte}`, {
                method: 'DELETE'
            });

            setReportes(prev =>
                prev.filter(r => r.id_reporte !== deleteReporte.id_reporte)
            );

            toast.success('Reporte eliminado.');
            setDeleteReporte(null);
        } catch (err: any) {
            toast.error(`Error al eliminar: ${err.message}`);
        }
    };

    
    const formatDateForBackend = (iso: string): string => {
        const [y, m, d] = iso.split('-');
        return `${d}/${m}/${y}`;
    };

    const openEdit = (r: Reporte) => {
        setEditReporte(r);
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editReporte) return;

        const msg = validate(editReporte);
        if (msg) return toast.error(msg);

        try {
            editReporte.fecha = formatDateForBackend(editReporte.fecha);
            await fetchCliente(`/api/reportes/update`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editReporte)
            });

            setReportes(prev =>
                prev.map(r =>
                    r.id_reporte === editReporte.id_reporte ? editReporte : r
                )
            );

            toast.success('Reporte actualizado.');
            setShowEditModal(false);
            setEditReporte(null);
        } catch (err: any) {
            toast.error(`Error al actualizar: ${err.message}`);
        }
    };
    const handleAdd = async () => {
        const msg = validate(nuevoReporte);
        if (msg) return toast.error(msg);

        try {
            
            nuevoReporte.fecha = formatDateForBackend(nuevoReporte.fecha);

            const res = await fetchCliente<{id:string}>('/api/reportes/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoReporte)
            });

            const alumnoSeleccionado = alumnos.find(a => a.id_alumno === nuevoReporte.id_alumno);
            const periodoSeleccionado = periodos.find(p => p.id_periodo === nuevoReporte.id_periodo);
            
            nuevoReporte.periodo = periodoSeleccionado?.nombre || '',
            nuevoReporte.alumno = alumnoSeleccionado?.nombres || '',
            nuevoReporte.id_reporte = res.id;
            console.log(nuevoReporte);

            setReportes(prev => [...prev, nuevoReporte]);

            toast.success('Reporte agregado.');
            setShowAddModal(false);
            setNuevoReporte({
                alumno: '', fecha: '', observaciones: '',
                periodo: '', id_periodo: '', id_alumno: '', id_reporte: ''
            });
        } catch (err: any) {
            toast.error(`Error: ${err.message}`);
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
                                <h5 className="modal-title">Nuevo Reporte</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)} />
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handleAdd(); }}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label>Alumno</label>
                                        <select className="form-select" required
                                            value={nuevoReporte.id_alumno}
                                            onChange={e => {
                                                const id = e.target.value;
                                                const alumnoSeleccionado = alumnos.find(a => a.id_alumno === id);
                                                setNuevoReporte({ ...nuevoReporte, id_alumno: id, alumno: alumnoSeleccionado?.nombres || '' });
                                            }}>
                                            <option value="">Seleccione un alumno</option>
                                            {alumnos.map(a => (
                                                <option key={a.id_alumno} value={a.id_alumno}>{a.nombres}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label>Fecha</label>
                                        <input type="date" className="form-control" required
                                            value={nuevoReporte.fecha}
                                            onChange={e => setNuevoReporte({ ...nuevoReporte, fecha: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Observaciones</label>
                                        <textarea className="form-control" required
                                            value={nuevoReporte.observaciones}
                                            onChange={e => setNuevoReporte({ ...nuevoReporte, observaciones: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Periodo</label>
                                        <select className="form-select" required
                                            value={nuevoReporte.id_periodo}
                                            onChange={e => {
                                                const id = e.target.value;
                                                const periodoSeleccionado = periodos.find(p => p.id_periodo === id);
                                                setNuevoReporte({ ...nuevoReporte, id_periodo: id, periodo: periodoSeleccionado?.periodo || '' });
                                            }}>
                                            <option value="">Seleccione un período</option>
                                            {periodos.map(p => (
                                                <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
                                            ))}
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

            {showEditModal && editReporte && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Reporte</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)} />
                            </div>
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label>Alumno</label>
                                        <select className="form-select" required
                                            value={editReporte.id_alumno}
                                            onChange={e => {
                                                const id = e.target.value;
                                                const alumnoSeleccionado = alumnos.find(a => a.id_alumno === id);
                                                setEditReporte({ ...editReporte, id_alumno: id, alumno: alumnoSeleccionado?.nombres || '' });
                                            }}>
                                            <option value="">Seleccione un alumno</option>
                                            {alumnos.map(a => (
                                                <option key={a.id_alumno} value={a.id_alumno}>{a.nombres}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label>Fecha</label>
                                        <input type="date" className="form-control" required
                                            value={editReporte.fecha}
                                            onChange={e => setEditReporte({ ...editReporte, fecha: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Observaciones</label>
                                        <textarea className="form-control" required
                                            value={editReporte.observaciones}
                                            onChange={e => setEditReporte({ ...editReporte, observaciones: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label>Periodo</label>
                                        <select className="form-select" required
                                            value={editReporte.id_periodo}
                                            onChange={e => {
                                                const id = e.target.value;
                                                const periodoSeleccionado = periodos.find(p => p.id_periodo === id);
                                                setEditReporte({ ...editReporte, id_periodo: id, periodo: periodoSeleccionado?.periodo || '' });
                                            }}>
                                            <option value="">Seleccione un período</option>
                                            {periodos.map(p => (
                                                <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
                                            ))}
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

            {deleteReporte && (
                <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border border-danger">
                            <div className="modal-header">
                                <h5 className="modal-title text-danger">Eliminar Reporte</h5>
                            </div>
                            <div className="modal-body">
                                <p>
                                    ¿Desea eliminar el reporte de <strong>{deleteReporte.alumno}</strong> del período <strong>{deleteReporte.periodo}</strong>?
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={handleDelete}>Confirmar</button>
                                <button className="btn btn-secondary" onClick={() => setDeleteReporte(null)}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <h2>Reportes</h2>
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
                        <th>Fecha</th>
                        <th>Observaciones</th>
                        <th>Periodo</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(e => (
                        <tr key={e.id_reporte}>
                            <td>{e.alumno}</td>
                            <td>{e.fecha}</td>
                            <td>{e.observaciones}</td>
                            <td>{e.periodo}</td>
                            <td>
                                <td>
                                    <button className="btn btn-warning me-2" onClick={() => openEdit(e)}>
                                        <FaEdit />
                                    </button>
                                    <button className="btn btn-danger" onClick={() => setDeleteReporte(e)}>
                                        <FaTrash />
                                    </button>
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