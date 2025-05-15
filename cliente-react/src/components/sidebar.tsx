import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="d-flex flex-column p-3 bg-light" style={{ width: '220px', height: '100vh' }}>
      <h2 className="mb-4">Menú</h2>
      <nav className="nav nav-pills flex-column">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/alumnos"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}
        >
          Alumnos
        </NavLink>

        <NavLink
          to="/asistencias"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}
        >
          Asistencias
        </NavLink>

        <NavLink
          to="/reportes"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}
        >
          Reportes
        </NavLink>
      </nav>
    </aside>
  );
}
