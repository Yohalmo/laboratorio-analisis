import { useState, useEffect } from "react";
import { fetchCliente } from '../api/fetchCliente';

export function useTelefonos(){
    const [telefonos, setTelefonos] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        fetchCliente<any[]>('/api/telefonos', { method: 'GET' })
        .then(data => setTelefonos(data))
        .catch(err => setError(err.message || 'Error al cargar los telefonos'))
        .finally(() => setLoading(false));
    }, [])

    return { telefonos, loading, error, setTelefonos };
}