import { useState, useEffect } from "react";
import { useMaterias } from "../../src/hook/useMaterias";
import Paginador from '../../src/components/paginador';

interface Materia {
    id_materia: number;
    nombre: string;
    descripcion: string;
}

interface MateriasProps {
    materias: Materia[];
    loading: boolean;
    error: string | null;
}

export default function Materias() {
    const { materias, loading, error } = useMaterias();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const filtered = materias.filter(e => 
        `${e.nombre} ${e.descripcion}`
            .toLowerCase()
            .includes(searchTerm.trim().toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    if (loading) return <p className="text-center">Cargando Materias...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="container">
            <h2 className="my-4">Materias</h2>

            <div className="form-group col-md-4 mb-4">
                <input 
                    type="text" 
                    className="form-control"
                    placeholder="Buscar por nombre o descripción..."
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
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.length > 0 ? (
                            pageData.map(e => (
                                <tr key={e.id_materia}>
                                    <td>{e.id_materia}</td>
                                    <td>{e.nombre}</td>
                                    <td>{e.descripcion}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center">No se encontraron materias</td>
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