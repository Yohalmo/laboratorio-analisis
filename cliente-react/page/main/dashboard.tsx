import { useEffect, useState } from "react";
import { getDashboardStatus } from "../../api/dashboard";
import CardResumen from "../../src/components/cardResumen";
import TablaResumen from "../../src/components/alumnosResumen";
import type { DashboardStats } from "../../src/types";

export default function Dashboard() {
    const [infoDashboard, setInfoDashboard] = useState<DashboardStats | null>(null);
  
    useEffect(() => {
        // Tipado explícito en las respuestas
        getDashboardStatus().then((data: DashboardStats) => setInfoDashboard(data));
    }, []);

    return (
        <div className="container py-5">
            <h1 className="mb-4 text-center text-primary">Dashboard General</h1>

            {/* Cards de Resumen */}
            <div className="row g-4 mb-4">
                <CardResumen title="Alumnos" count={infoDashboard?.alumnosCount || 0} color="primary" />
                <CardResumen title="Cursos" count={infoDashboard?.cursosCount || 0} color="secondary" />
                <CardResumen title="Motivos de ausencia" count={infoDashboard?.motivoCount || 0} color="success" />
                <CardResumen title="Materias" count={infoDashboard?.materiasCount || 0} color="danger" />
                <CardResumen title="Periodos" count={infoDashboard?.periodosCount || 0} color="warning" />
                <CardResumen title="Profesores" count={infoDashboard?.profesoresCount || 0} color="info" />
                <CardResumen title="Reportes" count={infoDashboard?.reporteCount || 0} color="dark" />
                <CardResumen title="Asistencias" count={infoDashboard?.asistenciasCount || 0} color="success" />
                <CardResumen title="Salones" count={infoDashboard?.salonesCount || 0} color="primary" />
            </div>

            {/* Tablas de Últimos Registros */}
            <div className="row">
                <TablaResumen data={infoDashboard?.alumnos || []} title="Últimos Alumnos"/>
                <TablaResumen data={infoDashboard?.cursos || []} title="Últimos cursos"/>
                <TablaResumen data={infoDashboard?.motivos || []} title="Últimos motivos"/>
                <TablaResumen data={infoDashboard?.materias || []} title="Últimas materias"/>
                <TablaResumen data={infoDashboard?.periodos || []} title="Últimos periodos"/>
                <TablaResumen data={infoDashboard?.profesores || []} title="Últimos profesores"/>
                <TablaResumen data={infoDashboard?.reporte || []} title="Últimos reporte"/>
                <TablaResumen data={infoDashboard?.asistencias || []} title="Últimas asistencias"/>
                <TablaResumen data={infoDashboard?.salones || []} title="Últimos salones"/>
            </div>            
        </div>
    );
}