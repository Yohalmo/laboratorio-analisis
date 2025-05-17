import { useState, useEffect } from "react";
import { fetchCliente } from '../../api/fetchCliente';

interface Salon {
    id_salon: number;
    nombre: string;
    capacidad: number;
    ubicacion: string;
    observaciones?: string;
}

export function useSalones() {
    const [salones, setSalones] = useState<Salon[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        fetchCliente<Salon[]>('/api/salones', { method: 'GET' })
            .then(data => setSalones(data))
            .catch(err => setError(err.message || 'Error al cargar los salones'))
            .finally(() => setLoading(false));
    }, []);

    return { salones, loading, error };
}
