import type { Alumno } from './interfaces/Alumno';
import type { Curso } from './interfaces/Curso';
import type { Motivo } from './interfaces/Motivo';
import type { Materia } from './interfaces/Materia';
import type { Periodo } from './interfaces/Periodo';
import type { Profesor } from './interfaces/Profesor';
import type { Reporte } from './interfaces/Reporte';
import type { Asistencia } from './interfaces/Asistencia';
import type { Salon } from './interfaces/Salon';

export interface DashboardStats {
    alumnosCount: number;
    cursosCount: number;
    motivoCount: number;
    materiasCount: number;
    periodosCount: number;
    profesoresCount: number;
    reporteCount: number;
    asistenciasCount: number;
    salonesCount: number;
    alumnos: Alumno[];
    cursos: Curso[];
    motivos: Motivo[];
    materias: Materia[];
    periodos: Periodo[];
    profesores: Profesor[];
    reporte: Reporte[];
    asistencias: Asistencia[];
    salones: Salon[];
}

