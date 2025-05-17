import { useState, useEffect } from "react";
import { fetchCliente } from '../api/fetchCliente';

interface Profesor {
    id_profesor: number;
    nombre: string;
    apellido: string;
    especialidad: string;
    telefono: string;
    email: string;
    documento_identidad: string;
}

export function useProfesores() {
    const [profesores, setProfesores] = useState<Profesor[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        fetchCliente<Profesor[]>('/api/profesores', { method: 'GET' })
            .then(data => setProfesores(data))
            .catch(err => setError(err.message || 'Error al cargar los profesores'))
            .finally(() => setLoading(false));
    }, []);

    return { profesores, loading, error };
}
