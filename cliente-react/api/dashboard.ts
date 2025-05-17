import { fetchCliente } from './fetchCliente';
import type { DashboardStats} from '../src/types';

export const getDashboardStatus = async (): Promise<DashboardStats> => {
    const [totales] = await Promise.all([
        fetchCliente<DashboardStats>('/api/dashboard'),
    ]);

    return totales;
};