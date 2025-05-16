import { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from "react-router-dom";

export default function Login(){
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div>
            <div className="row">
                <div className="col-6">
                    <div className="d-flex justify-content-center align-items-center">
                        <h2 className="text-black">
                            Bienvenido
                        </h2>
                    </div>
                </div>
                <div className="col-6">
                    <h1>Inicia Sesion</h1>
                    <p className="text-center mb-3">
                        Accede a tu panel de control con tu cuenta de Google
                    </p>

                    <div className="d-flex justify-content-center">
                        <GoogleLogin onSuccess={(res) => {
                            if(res.credential){
                                login(res.credential);
                            }
                        }} 
                        
                        onError={() =>{
                            alert('Fallo al iniciar sesion')
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    )
}