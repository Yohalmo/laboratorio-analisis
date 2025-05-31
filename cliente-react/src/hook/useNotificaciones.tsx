import { useState, useEffect } from "react";
import { fetchCliente } from '../api/fetchCliente';

export function useNotificaciones(){
    const [notificaciones, setNotificaciones] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        fetchCliente<any[]>('/api/notificaciones', { method: 'GET' })
        .then(data => setNotificaciones(data))
        .catch(err => setError(err.message || 'Error al cargar los notificaciones'))
        .finally(() => setLoading(false));
    }, [])

    return { notificaciones, loading, error, setNotificaciones };
}