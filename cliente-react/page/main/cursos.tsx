import { useState, useEffect } from "react";
import { useCursos } from "../../src/hook/useCursos";
import Paginador from '../../src/components/paginador';

export default function Cursos() {
    const { cursos, loading, error } = useCursos();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const lstcursos = Array.isArray(cursos) ? cursos : [];

    const filtered = lstcursos.filter(e => 
        `${e.nombre} ${e.descripcion} ${e.id_periodo}`
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    if (loading) return <p className="text-center">Cargando Cursos...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="container">
            <h2 className="my-4">Cursos</h2>

            <div className="form-group col-md-4 mb-4">
                <input 
                    type="text" 
                    className="form-control"
                    placeholder="Buscar por nombre, descripción o período..."
                    onChange={e => setSearchTerm(e.target.value)} 
                />
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Período</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.length > 0 ? (
                            pageData.map(e => (
                                <tr key={e.id_curso}>
                                    <td>{e.id_curso}</td>
                                    <td>{e.nombre}</td>
                                    <td>{e.descripcion}</td>
                                    <td>
                                        <span className={`badge ${e.estado ? 'bg-success' : 'bg-secondary'}`}>
                                            {e.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>{e.nombre_periodo}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">No se encontraron cursos</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {filtered.length > 0 && (
                <Paginador
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    setCurrentPage={setCurrentPage}
                    setItemsPerPage={setItemsPerPage}
                />
            )}
        </div>
    )
}