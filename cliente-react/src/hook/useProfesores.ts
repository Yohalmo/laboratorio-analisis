import { useState, useEffect } from "react";
import { fetchCliente } from "../api/fetchCliente";

export interface Profesor {
  id_profesor: number;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string;
  direccion: string;
  telefono: string;
  email: string;
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

  async function crearProfesor(nuevo: Omit<Profesor, 'id_profesor'>) {
    try {
      const res = await fetchCliente<Profesor>('/api/profesores', {
        method: 'POST',
        body: JSON.stringify(nuevo),
        headers: { 'Content-Type': 'application/json' },
      });
      setProfesores(prev => [...prev, res]);
    } catch (err: any) {
      throw new Error(err.message || 'Error al crear profesor');
    }
  }

  async function editarProfesor(id: number, actualizado: Omit<Profesor, 'id_profesor'>) {
    try {
      const res = await fetchCliente<Profesor>(`/api/profesores/${id}`, {
        method: 'PUT',
        body: JSON.stringify(actualizado),
        headers: { 'Content-Type': 'application/json' },
      });
      setProfesores(prev => prev.map(p => p.id_profesor === id ? res : p));
    } catch (err: any) {
      throw new Error(err.message || 'Error al editar profesor');
    }
  }

  return { profesores, loading, error, crearProfesor, editarProfesor };
}
