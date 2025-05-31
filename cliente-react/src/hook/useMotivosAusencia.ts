import { useState, useEffect } from "react";
import { fetchCliente } from '../api/fetchCliente';

export function useMotivosAusencia() {
    const [motivos, setMotivos] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        fetchCliente<any[]>('/api/motivos_ausencia', { method: 'GET' })
        .then(data => setMotivos(data))
        .catch(err => setError(err.message || 'Error al cargar los motivos de ausencia'))
        .finally(() => setLoading(false));
    }, [])

    return { motivos, loading, error, setMotivos };
}