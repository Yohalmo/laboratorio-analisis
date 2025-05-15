import { useState, useEffect } from "react";
import { fetchCliente } from '../../api/fetchCliente';

export function useReportes(){
    const [alumnos, setAlumnos] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        fetchCliente<any[]>('/api/reportes', { method: 'GET' })
        .then(data => setAlumnos(data))
        .catch(err => setError(err.message || 'Error al cargar los reportes'))
        .finally(() => setLoading(false));
    }, [])

    return { alumnos, loading, error };
}