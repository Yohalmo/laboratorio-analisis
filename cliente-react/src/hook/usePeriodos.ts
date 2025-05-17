import { useState, useEffect } from "react";
import { fetchCliente } from '../api/fetchCliente';

interface Periodo {
    id_periodo: number;
    nombre: string;
    fecha_inicio: string;
    fecha_finalizacion: string;
}

export function usePeriodos() {
    const [periodos, setPeriodos] = useState<Periodo[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        fetchCliente<Periodo[]>('/api/periodos', { method: 'GET' })
            .then(data => setPeriodos(data))
            .catch(err => setError(err.message || 'Error al cargar los periodos'))
            .finally(() => setLoading(false));
    }, []);

    return { periodos, loading, error };
}
