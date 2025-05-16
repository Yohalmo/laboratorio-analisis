import { useState, useEffect } from "react";
import { useProfesores } from "../../src/hook/useProfesores";
import Paginador from '../../src/components/paginador';

interface Profesor {
    id_profesor: number;
    nombre: string;
    apellido: string;
    especialidad: string;
    telefono: string;
    email: string;
    documento_identidad: string;
}

export default function Profesores() {
    const { profesores, loading, error } = useProfesores();

    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const filtered = profesores.filter(e =>
        `${e.nombre} ${e.apellido}`.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    if (loading) return <p className="text-center">Cargando Profesores...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="container">
            <h2>Profesores</h2>

            <div className="form-group col-3">
                <input type="text" className="form-control"
                    onChange={e => setSearchTerm(e.target.value)} />
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Especialidad</th>
                        <th>Teléfono</th>
                        <th>Email</th>
                        <th>Documento</th>
                    </tr>
                </thead>
                <tbody>
                    {pageData.map(e => (
                        <tr key={e.id_profesor}>
                            <td>{e.nombre}</td>
                            <td>{e.apellido}</td>
                            <td>{e.especialidad}</td>
                            <td>{e.telefono}</td>
                            <td>{e.email}</td>
                            <td>{e.documento_identidad}</td>
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
