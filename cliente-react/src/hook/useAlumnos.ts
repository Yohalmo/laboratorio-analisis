import { useState, useEffect } from "react";
import { fetchCliente } from '../api/fetchCliente';

export function useAlumnos(){
    const [alumnos, setAlumnos] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        fetchCliente<any[]>('/api/alumnos', { method: 'GET' })
        .then(data => setAlumnos(data))
        .catch(err => setError(err.message || 'Error al cargar los alumnos'))
        .finally(() => setLoading(false));
    }, [])

    return { alumnos, loading, error, setAlumnos };
}