import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="d-flex flex-column p-3 bg-light" style={{ width: '220px', height: '100vh' }}>
      <nav className="nav nav-pills flex-column">
        <NavLink to="/"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}>
          Dashboard
        </NavLink>

        <NavLink to="/alumnos"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}>
          Alumnos
        </NavLink>

        <NavLink to="/asistencias"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}>
          Asistencias
        </NavLink>

        <NavLink to="/reportes"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}>
          Reportes
        </NavLink>

        <NavLink to="/cursos"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}>
          Cursos
        </NavLink>

        <NavLink to="/materias"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}>
          Materias
        </NavLink>

        <NavLink to="/motivos-ausencia"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}>
          Motivos Ausencia
        </NavLink>

        <NavLink to="/periodos"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}>
          Periodos
        </NavLink>

        <NavLink to="/profesores"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}>
          Profesores
        </NavLink>

        <NavLink to="/salones"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}>
          Salones
        </NavLink>

        <NavLink to="/telefonos"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}>
          Telefonos
        </NavLink>

        <NavLink to="/notificaciones"
          className={({ isActive }) => `nav-link ${isActive ? 'active bg-primary text-white' : 'text-dark'} text-decoration-none py-2 px-3 rounded`}>
          Notificaciones
        </NavLink>
      </nav>
    </aside>
  );
}
