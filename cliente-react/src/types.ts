// src/types.ts
export interface DashboardStats {
    alumnos: number;
    cursos: number;
    docentes: number;
}

export interface Alumno {
    id_alumno: number;
    nombres: string;
    apellidos: string;
    email: string;
}

