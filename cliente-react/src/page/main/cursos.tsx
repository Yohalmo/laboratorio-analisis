import { useState, useEffect } from "react";
import { useCursos } from "../../hook/useCursos";
import { usePeriodos } from "../../hook/usePeriodos";
import Paginador from '../../components/paginador';
import { toast, ToastContainer } from "react-toastify";
import { fetchCliente } from "../../api/fetchCliente";
import { FaEdit, FaTrash } from "react-icons/fa";
import type { Curso } from "../../interfaces/Curso";

export default function Cursos() {
    const { cursos, loading, error, setCursos } = useCursos();
    const { periodos } = usePeriodos();

    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editRegistro, setEditRegistro] = useState<Curso | null>(null);
    const [deleteRegistro, setDeleteRegistro] = useState<Curso | null>(null);

    const [nuevoCurso, setNuevoCurso] = useState<Curso>({
        id_curso: '',
        nombre: '',
        descripcion: '',
        estado: true,
        id_periodo: '',
        nombre_periodo: ''
    });

    const validate = (c: Curso) => {
        if (!c.nombre.trim()) return 'Nombre es obligatorio';
        if (!c.descripcion.trim()) return 'Descripción es obligatoria';
        if (!c.id_periodo) return 'Seleccione un período';
        return null;
    };

    const handleAdd = async () => {
        const msg = validate(nuevoCurso);
        if (msg) return toast.error(msg);

        try {
            const res = await fetchCliente<{id:string}>('/api/cursos/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoCurso)
            });

            const periodo = periodos.find(p => p.id_periodo === nuevoCurso.id_periodo);
            setCursos(prev => [...prev, { ...nuevoCurso, id_curso: res.id, nombre_periodo: periodo?.nombre || '' }]);
            toast.success('Curso agregado');
            setShowAddModal(false);
            setNuevoCurso({ id_curso: '', nombre: '', descripcion: '', estado: true, id_periodo: '', nombre_periodo: '' });
        } catch (err) {
            toast.error('Error al agregar');
        }
    };

    const openEdit = (curso: Curso) => {
        setEditRegistro(curso);
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!editRegistro) return;

        const msg = validate(editRegistro);
        if (msg) return toast.error(msg);

        try {
            await fetchCliente(`/api/cursos/update/${editRegistro.id_curso}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editRegistro)
            });

            const periodo = periodos.find(p => p.id_periodo === editRegistro.id_periodo);
            const actualizado = { ...editRegistro, nombre_periodo: periodo?.periodo || '' };
            setCursos(prev => prev.map(c => c.id_curso === actualizado.id_curso ? actualizado : c));
            toast.success('Curso actualizado');
            setShowEditModal(false);
        } catch (err) {
            toast.error('Error al actualizar');
        }
    };

    const handleDelete = async () => {
        if (!deleteRegistro) return;

        try {
            await fetchCliente(`/api/cursos/delete/${deleteRegistro.id_curso}`, { method: 'DELETE' });
            setCursos(prev => prev.filter(c => c.id_curso !== deleteRegistro.id_curso));
            setDeleteRegistro(null);
            toast.success('Curso eliminado');
        } catch (err) {
            toast.error('Error al eliminar');
        }
    };

    const filtered = (Array.isArray(cursos) ? cursos : []).filter(e =>
        `${e.nombre} ${e.descripcion} ${e.nombre_periodo}`
            .toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, itemsPerPage]);

    return (
        <div className="container">
            <ToastContainer />
            <h2 className="my-4">Cursos</h2>

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
                        <th>Estado</th>
                        <th>Período</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(c => (
                        <tr key={c.id_curso}>
                            <td>{c.id_curso}</td>
                            <td>{c.nombre}</td>
                            <td>{c.descripcion}</td>
                            <td><span className={`badge ${c.estado ? 'bg-success' : 'bg-secondary'}`}>{c.estado ? 'Activo' : 'Inactivo'}</span></td>
                            <td>{c.nombre_periodo}</td>
                            <td>
                                <button className="btn btn-warning me-2" onClick={() => openEdit(c)}><FaEdit /></button>
                                <button className="btn btn-danger" onClick={() => setDeleteRegistro(c)}><FaTrash /></button>
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
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={e => { e.preventDefault(); handleAdd(); }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Agregar Curso</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <label htmlFor="">Nombre</label>
                                    <input className="form-control mb-2" placeholder="Nombre"
                                        value={nuevoCurso.nombre} onChange={e => setNuevoCurso({ ...nuevoCurso, nombre: e.target.value })} required />
                                    
                                    <label htmlFor="">Descripcion</label>
                                    <input className="form-control mb-2" placeholder="Descripción"
                                        value={nuevoCurso.descripcion} onChange={e => setNuevoCurso({ ...nuevoCurso, descripcion: e.target.value })} required />
                                    
                                    <label htmlFor="">Periodo</label>
                                    <select className="form-select mb-2"
                                        value={nuevoCurso.id_periodo}
                                        onChange={e => setNuevoCurso({ ...nuevoCurso, id_periodo: e.target.value })} required>
                                        <option value="">Seleccione período</option>
                                        {periodos.map(p => (
                                            <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
                                        ))}
                                    </select>
                                    
                                    <label htmlFor="">Estado</label>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox"
                                            checked={nuevoCurso.estado}
                                            onChange={e => setNuevoCurso({ ...nuevoCurso, estado: e.target.checked })} />
                                        <label className="form-check-label">Activo</label>
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

            {showEditModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <form onSubmit={e => { e.preventDefault(); handleUpdate(); }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Editar Curso</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <label htmlFor="">Nombre</label>
                                    <input className="form-control mb-2" placeholder="Nombre"
                                        value={editRegistro.nombre} onChange={e => setEditRegistro({ ...editRegistro, nombre: e.target.value })} required />
                                    
                                    <label htmlFor="">Descripcion</label>
                                    <input className="form-control mb-2" placeholder="Descripción"
                                        value={editRegistro.descripcion} onChange={e => setEditRegistro({ ...editRegistro, descripcion: e.target.value })} required />
                                    
                                    <label htmlFor="">Periodo</label>
                                    <select className="form-select mb-2"
                                        value={editRegistro.id_periodo}
                                        onChange={e => setEditRegistro({ ...editRegistro, id_periodo: e.target.value })} required>
                                        <option value="">Seleccione período</option>
                                        {periodos.map(p => (
                                            <option key={p.id_periodo} value={p.id_periodo}>{p.nombre}</option>
                                        ))}
                                    </select>
                                    <label htmlFor="">Estado</label>
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox"
                                            checked={editRegistro.estado}
                                            onChange={e => setEditRegistro({ ...editRegistro, estado: e.target.checked })} />
                                        <label className="form-check-label">Activo</label>
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
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Eliminar Curso</h5>
                                <button type="button" className="btn-close" onClick={() => setDeleteRegistro(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Está seguro que desea eliminar el curso <strong>{deleteRegistro.nombre}</strong>?</p>
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
