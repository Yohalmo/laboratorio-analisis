import { fetchCliente } from './fetchCliente';
import type { DashboardStats, Alumno} from '../src/types';

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const [alumnos] = await Promise.all([
        fetchCliente<{ count: number }>('alumnos/count'),
  
    ]);
    return { 
        alumnos: alumnos.count
    };
};

export const getLastAlumnos = (): Promise<Alumno[]> => 
    fetchCliente<Alumno[]>('alumnos?limit=5&order=desc');