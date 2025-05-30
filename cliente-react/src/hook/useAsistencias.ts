import { useState, useEffect } from "react";
import { fetchCliente } from '../api/fetchCliente';

export function useAsistencias(){
    const [asistencias, setAsistencias] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        fetchCliente<any[]>('/api/asistencias', { method: 'GET' })
        .then(data => setAsistencias(data))
        .catch(err => setError(err.message || 'Error al cargar las asistencias'))
        .finally(() => setLoading(false));
    }, [])

    return { asistencias, loading, error, setAsistencias };
}