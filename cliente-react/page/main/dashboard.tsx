import { useEffect, useState } from "react";
import { getDashboardStats, getLastAlumnos } from "../../api/dashboard";
import CardResumen from "../../src/components/cardResumen";
import TablaResumen from "../../src/components/alumnosResumen";
import type { DashboardStats, Alumno } from "../../src/types";

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  
    useEffect(() => {
        // Tipado explícito en las respuestas
        getDashboardStats().then((data: DashboardStats) => setStats(data));
        getLastAlumnos().then((data: Alumno[]) => setAlumnos(data));
    
    }, []);

    return (
        <div className="container py-5">
            <h1 className="mb-4 text-center text-primary">Dashboard General</h1>

            {/* Cards de Resumen */}
            <div className="row g-4 mb-4">
                <CardResumen title="Alumnos" count={stats?.alumnos || 0} color="primary" />
              
            </div>

            {/* Tablas de Últimos Registros */}
            <div className="row">
                <div className="mb-3 col-xl-6 col-md-6 col-sm-12">
                    <h3 className="mb-3">Últimos Alumnos</h3>
                    <TablaResumen data={alumnos} type="alumnos" />
                </div>
            </div>

            
        </div>
    );
}