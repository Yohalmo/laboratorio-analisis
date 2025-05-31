import { useState, useEffect } from "react";
import { useNotificaciones } from "../../hook/useNotificaciones";
import Paginador from '../../components/paginador';
import { toast, ToastContainer } from "react-toastify";
import { fetchCliente } from "../../api/fetchCliente";
import type { Notificacion } from "../../interfaces/Notificacion";
import { useAlumnos } from "../../hook/useAlumnos";

export default function Notificaciones() {
    const { notificaciones, loading, error, setNotificaciones } = useNotificaciones();
    const { alumnos } = useAlumnos();

    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);

    const [nuevoRegistro, setNuevoRegistro] = useState<Notificacion>({
        id: '',
        id_alumno: '',
        fecha_envio: '',
        estado: 'ENVIADO'
    });

    const validate = (n: Notificacion) => {
        if (!n.id_alumno) return 'Alumno es obligatorio';
        if (!n.fecha_envio.trim()) return 'Fecha es obligatoria';
        if (!n.estado.trim()) return 'Estado es obligatorio';
        return null;
    };

    const handleAdd = async () => {
        const msg = validate(nuevoRegistro);
        if (msg) return toast.error(msg);

        try {
            const res = await fetchCliente('/api/notificaciones/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoRegistro)
            });
            setNotificaciones(prev => [...prev, { ...nuevoRegistro, id: res.id }]);
            toast.success('Notificación agregada');
            setShowAddModal(false);
            setNuevoRegistro({ id: '', id_alumno: '', fecha_envio: '', estado: 'ENVIADO' });
        } catch {
            toast.error('Error al agregar');
        }
    };

    const lst = Array.isArray(notificaciones) ? notificaciones : [];
    const filtered = lst.filter(e => e.estado.toLowerCase().includes(searchTerm.trim().toLowerCase()));
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
            <h2>Notificaciones</h2>

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
                        <th>Fecha Envío</th>
                        <th>Estado</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(e => (
                        <tr key={e.id}>
                            <td>{alumnos.find(a => a.id_alumno === e.id_alumno)?.nombres ?? e.id_alumno}</td>
                            <td>{e.fecha_envio}</td>
                            <td>{e.estado}</td>
                            <td>
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

            {(showAddModal) && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={e => {
                                e.preventDefault();
                                handleAdd();
                            }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{showAddModal ? 'Nueva' : 'Editar'} Notificación</h5>
                                    <button type="button" className="btn-close" onClick={() => {
                                        setShowAddModal(false);
                                    }}></button>
                                </div>
                                <div className="modal-body">
                                    <label className="form-label">Alumno</label>
                                    <select
                                        className="form-select mb-3"
                                        value={showAddModal ? nuevoRegistro.id_alumno : editRegistro!.id_alumno}
                                        onChange={e => { setNuevoRegistro({ ...nuevoRegistro, id_alumno: e.target.value })
                                        }}
                                        required>
                                        <option value="" disabled>Seleccione un alumno</option>
                                        {alumnos.map(a => (
                                            <option key={a.id_alumno} value={a.id_alumno}>{a.nombres}</option>
                                        ))}
                                    </select>

                                    <label className="form-label">Fecha de envío</label>
                                    <input
                                        type="date"
                                        className="form-control mb-3"
                                        value={showAddModal ? nuevoRegistro.fecha_envio : editRegistro!.fecha_envio}
                                        onChange={e => { setNuevoRegistro({ ...nuevoRegistro, fecha_envio: e.target.value });
                                        }}
                                        required
                                    />

                                    <label className="form-label">Estado</label>
                                    <select
                                        className="form-select"
                                        value={showAddModal ? nuevoRegistro.estado : editRegistro!.estado}
                                        onChange={e => { setNuevoRegistro({ ...nuevoRegistro, estado: e.target.value });
                                        }}
                                        required
                                    >
                                        <option value="ENVIADO">ENVIADO</option>
                                        <option value="PENDIENTE">PENDIENTE</option>
                                    </select>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => {
                                        setShowAddModal(false);
                                    }}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Guardar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
