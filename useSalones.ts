import { useState, useEffect } from "react";
import { fetchCliente } from "../api/fetchCliente";

export interface Salon {
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

  async function crearSalon(nuevo: Omit<Salon, 'id_salon'>) {
    try {
      const res = await fetchCliente<Salon>('/api/salones', {
        method: 'POST',
        body: JSON.stringify(nuevo),
        headers: { 'Content-Type': 'application/json' },
      });
      setSalones(prev => [...prev, res]);
    } catch (err: any) {
      throw new Error(err.message || 'Error al crear salón');
    }
  }

  async function editarSalon(id: number, actualizado: Omit<Salon, 'id_salon'>) {
    try {
      const res = await fetchCliente<Salon>(`/api/salones/${id}`, {
        method: 'PUT',
        body: JSON.stringify(actualizado),
        headers: { 'Content-Type': 'application/json' },
      });
      setSalones(prev => prev.map(s => s.id_salon === id ? res : s));
    } catch (err: any) {
      throw new Error(err.message || 'Error al editar salón');
    }
  }

  return { salones, loading, error, crearSalon, editarSalon };
}
