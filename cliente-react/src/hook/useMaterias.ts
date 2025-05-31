import { useState, useEffect } from "react";
import { fetchCliente } from '../api/fetchCliente';

export function useMaterias() {
    const [materias, setMaterias] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        fetchCliente<any[]>('/api/materias', { method: 'GET' })
        .then(data => setMaterias(data))
        .catch(err => setError(err.message || 'Error al cargar las materias'))
        .finally(() => setLoading(false));
    }, [])

    return { materias, loading, error, setMaterias };
}