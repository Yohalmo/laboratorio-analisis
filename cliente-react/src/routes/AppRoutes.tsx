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

import Periodos from '../../page/main/periodos';
import Profesores from '../../page/main/profesores';
import Salones from '../../page/main/salones';

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

            <Route path="/periodos" element={<Periodos />} />
            <Route path="/profesores" element={<Profesores />} />
            <Route path="/salones" element={<Salones />} />
        </Routes>
    )
}

export default AppRoute;