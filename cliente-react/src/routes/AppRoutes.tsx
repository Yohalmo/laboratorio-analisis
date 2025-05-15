import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../components/login';
import Dashboard from '../../page/main/dashboard';
import Alumnos from '../../page/main/alumnos';
import Asistencias from '../../page/main/asistencias';
import Reportes from '../../page/main/reportes';

const AppRoute: React.FC = () =>{
    return (
        <Routes>
            <Route path='/' element={<Dashboard/>}/>
            <Route path='/alumnos' element={<Alumnos/>}/>
            <Route path="/asistencias" element={<Asistencias />} />
            <Route path="/reportes" element={<Reportes />} />
        </Routes>
    )
}

export default AppRoute;