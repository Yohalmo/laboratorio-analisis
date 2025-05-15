import { useContext, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from '../../context/AuthContext';
import  Alumnos  from './alumnos';
import { useNavigate } from "react-router-dom";

export default function Dashboard(){
    const { login } = useContext(AuthContext);

    return (
        <div>
            funciona
        </div>
    )
}