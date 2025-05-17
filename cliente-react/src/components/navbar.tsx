import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="d-flex align-items-center justify-content-between bg-white shadow p-3">
      <h3 className="text-xl font-semibold mb-0">Asistencia escolar</h3>
      <div>

      </div>
      <div className="d-flex align-items-center">
        {user && (
          <>
                <span className="text-gray-700">{user.name}</span>
                
            <img src={user.picture}
              alt="Avatar" height={45}
              className="rounded-circle ms-2 me-2"
            />
            
                <button
                  onClick={logout}
                  className="btn btn-danger p-1">
                  <span className="small">Cerrar sesión</span>
                </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
