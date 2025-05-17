import { useState, useEffect } from "react";
import { useSalones } from "../../hook/useSalones";
import Paginador from '../../components/paginador';

export default function Salones() {
    const { salones, loading, error } = useSalones();

    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    
    const lstsalones = Array.isArray(salones) ? salones : [];

    const filtered = lstsalones.filter(e =>
        e.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    if (loading) return <p className="text-center">Cargando Salones...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="container">
            <h2>Salones</h2>

            <div className="form-group col-3">
                <input type="text" className="form-control"
                    onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Capacidad</th>
                        <th>Ubicación</th>
                        <th>Observaciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(e => (
                        <tr key={e.id_salon}>
                            <td>{e.nombre}</td>
                            <td>{e.capacidad}</td>
                            <td>{e.ubicacion}</td>
                            <td>{e.observaciones ?? '---'}</td>
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
