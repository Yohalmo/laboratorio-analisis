import { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";

export default function Login(){
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
            <div className="row p-0 m-0 vh-100">
                <div className="d-none d-md-block col-md-6 col-xl-6 m-0 p-0 bg-secondary text-white">
                    <div className="vh-100 d-flex justify-content-center align-items-center">
                        <div className="d-block">
                            <h1 className="text-center">Bienvenido</h1>
                            <h5 className="text-center">ASISTENCIA ESCOLAR</h5>
                        </div>
                    </div>
                </div>
                <div className="col-6 m-0 p-0 bg-light">
                    <div className="vh-100 d-flex justify-content-center align-items-center">
                        <div>
                        <h1 className="text-center">Inicia Sesion</h1>
                        <p className="text-center mb-3">
                            Accede a tu panel de control con tu cuenta de Google
                        </p>

                        <div className="d-flex justify-content-center">
                            <GoogleLogin onSuccess={(res) => {
                                if(res.credential){
                                    login(res.credential);
                                    navigate('/');
                                }
                            }}
                            onError={() =>{
                                alert('Fallo al iniciar sesion')
                            }}/>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}