import { useState, useEffect } from "react";
import { useAsistencias } from "../../hook/useAsistencias";
import Paginador from '../../components/paginador';

export default function Asistencias() {

    const { asistencias, loading, error } = useAsistencias();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);
    
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

    return (
        <div className="container">
            <h2>Asistencias</h2>
            <div className="form-group col-3">
                <input type="text" className="form-control"
                    onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Alumno</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Materia</th>
                        <th>Motivo</th>
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