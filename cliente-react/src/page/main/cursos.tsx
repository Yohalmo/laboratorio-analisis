import { useState } from "react";
import { useCursos } from "../../hook/useCursos";
import { fetchCliente } from "../../api/fetchCliente";
import Paginador from "../../components/paginador";

const Curso = () => {
  const { cursos, loading, error } = useCursos();
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    estado: true,
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cursoEditando, setCursoEditando] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);

  const porPagina = 5;
  const cursosPaginados = cursos.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormulario({ ...formulario, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion && cursoEditando) {
        await fetchCliente(`/api/cursos/${cursoEditando.id_curso}`, {
          method: "PUT",
          body: formulario,
        });
      } else {
        await fetchCliente("/api/cursos", {
          method: "POST",
          body: formulario,
        });
      }
      window.location.reload(); // actualizar datos
    } catch (error) {
      alert("Error al guardar el curso");
    }
  };

  const handleEditar = (curso) => {
    setFormulario({
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      estado: curso.estado,
    });
    setModoEdicion(true);
    setCursoEditando(curso);
  };

  const handleEliminar = async (id_curso) => {
    if (confirm("¿Deseas eliminar este curso?")) {
      try {
        await fetchCliente(`/api/cursos/${id_curso}`, { method: "DELETE" });
        window.location.reload();
      } catch (error) {
        alert("Error al eliminar el curso");
      }
    }
  };

  return (
    <div>
      <h2>Gestión de Cursos</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          placeholder="Nombre del curso"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="descripcion"
          value={formulario.descripcion}
          placeholder="Descripción"
          onChange={handleChange}
          required
        />
        <label>
          Activo:
          <input
            type="checkbox"
            name="estado"
            checked={formulario.estado}
            onChange={handleChange}
          />
        </label>
        <button type="submit">{modoEdicion ? "Actualizar" : "Registrar"}</button>
      </form>

      {loading ? (
        <p>Cargando cursos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Periodo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cursosPaginados.map((curso) => (
                <tr key={curso.id_curso}>
                  <td>{curso.nombre}</td>
                  <td>{curso.descripcion}</td>
                  <td>{curso.estado ? "Activo" : "Inactivo"}</td>
                  <td>{curso.nombre_periodo}</td>
                  <td>
                    <button onClick={() => handleEditar(curso)}>Editar</button>
                    <button onClick={() => handleEliminar(curso.id_curso)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Paginador
            total={cursos.length}
            actual={paginaActual}
            porPagina={porPagina}
            cambiarPagina={setPaginaActual}
          />
        </>
      )}
    </div>
  );
};

export default Curso;
 

