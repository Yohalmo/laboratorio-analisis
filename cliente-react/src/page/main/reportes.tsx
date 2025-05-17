import { useState, useEffect } from "react";
import { useReportes } from "../../hook/useReportes";
import Paginador from '../../components/paginador';

export default function Reportes() {

    const { reportes, loading, error } = useReportes();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    
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

    return (
        <div className="container">
            <h2>Reportes</h2>
            <div className="form-group col-3">
                <input type="text" className="form-control"
                    onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Alumno</th>
                        <th>Fecha</th>
                        <th>Observaciones</th>
                        <th>Periodo</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(e => (
                        <tr key={e.id_reporte}>
                            <td>{e.alumno}</td>
                            <td>{e.fecha}</td>
                            <td>{e.observaciones}</td>
                            <td>{e.periodo}</td>
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