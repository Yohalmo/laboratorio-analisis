import { useState, useEffect } from "react";
import { usePeriodos } from "../../src/hook/usePeriodos";
import Paginador from '../../src/components/paginador';

interface Periodo {
    id_periodo: number;
    nombre: string;
    fecha_inicio: string;
    fecha_finalizacion: string;
}

export default function Periodos() {
    const { periodos, loading, error } = usePeriodos();

    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = periodos.filter(e =>
        e.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    if (loading) return <p className="text-center">Cargando Periodos...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="container">
            <h2>Periodos</h2>

            <div className="form-group col-3">
                <input type="text" className="form-control"
                    onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha Inicio</th>
                        <th>Fecha Finalización</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(e => (
                        <tr key={e.id_periodo}>
                            <td>{e.nombre}</td>
                            <td>{e.fecha_inicio}</td>
                            <td>{e.fecha_finalizacion}</td>
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
    );
}
