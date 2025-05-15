import { useState, useEffect } from "react";
import { fetchCliente } from '../../api/fetchCliente';

export function useCursos() {
    const [cursos, setCursos] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        fetchCliente<any[]>('/api/cursos', { method: 'GET' })
        .then(data => setCursos(data))
        .catch(err => setError(err.message || 'Error al cargar los cursos'))
        .finally(() => setLoading(false));
    }, [])

    return { cursos, loading, error };
}