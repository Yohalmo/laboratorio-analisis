import { useState, useEffect } from "react";
import { useMotivosAusencia } from "../../src/hook/useMotivosAusencia";
import Paginador from '../../src/components/paginador';

export default function MotivosAusencia() {
    const { motivos, loading, error } = useMotivosAusencia();

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const lstmotivos = Array.isArray(motivos) ? motivos : [];

    const filtered = lstmotivos.filter(e => 
        e.descripcion.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const startIdx = (currentPage - 1) * itemsPerPage;
    const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    if (loading) return <p className="text-center">Cargando motivos de ausencia...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="container">
            <h2 className="my-4">Motivos de Ausencia</h2>

            <div className="form-group col-md-4 mb-4">
                <input 
                    type="text" 
                    className="form-control"
                    placeholder="Buscar por descripción..."
                    onChange={e => setSearchTerm(e.target.value)} 
                />
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageData.length > 0 ? (
                            pageData.map(e => (
                                <tr key={e.id_motivo}>
                                    <td>{e.id_motivo}</td>
                                    <td>{e.descripcion}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="text-center">No se encontraron motivos de ausencia</td>
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