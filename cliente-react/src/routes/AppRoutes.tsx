import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../components/login';
import Dashboard from '../../page/main/dashboard';
import Alumnos from '../../page/main/alumnos';
import Asistencias from '../../page/main/asistencias';
import Reportes from '../../page/main/reportes';
import Materias from '../../page/main/materias';
import Cursos from '../../page/main/cursos';
import MotivosAusencia from '../../page/main/motivos_ausencia';

const AppRoute: React.FC = () =>{
    return (
        <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/alumnos' element={<Alumnos/>}/>
            <Route path="/asistencias" element={<Asistencias />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/materias" element={<Materias />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/motivos-ausencia" element={<MotivosAusencia />} />
        </Routes>
    )
}

export default AppRoute;