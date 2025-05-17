import { useState, useEffect } from "react";
import { useAlumnos } from "../../hook/useAlumnos";
import Paginador from '../../components/paginador';

export default function Alumnos() {

    const { alumnos, loading, error } = useAlumnos();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

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
            <h2>Alumnos</h2>

            <div className="form-group col-3">
                <input type="text" className="form-control"
                    onChange={e => setSearchTerm(e.target.value)} />
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
