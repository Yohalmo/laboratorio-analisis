import { useState } from "react";
import { useMaterias } from "../../hook/useMaterias";
import { fetchCliente } from "../../api/fetchCliente";
import Paginador from "../../components/paginador";

const Materia = () => {
  const { materias, loading, error } = useMaterias();
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [materiaEditando, setMateriaEditando] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);

  const porPagina = 5;
  const materiasPaginadas = materias.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion && materiaEditando) {
        await fetchCliente(`/api/materias/${materiaEditando.id_materia}`, {
          method: "PUT",
          body: formulario,
        });
      } else {
        await fetchCliente("/api/materias", {
          method: "POST",
          body: formulario,
        });
      }
      window.location.reload(); // actualizar datos
    } catch (error) {
      alert("Error al guardar la materia");
    }
  };

  const handleEditar = (materia) => {
    setFormulario({
      nombre: materia.nombre,
      descripcion: materia.descripcion,
    });
    setModoEdicion(true);
    setMateriaEditando(materia);
  };

  const handleEliminar = async (id_materia) => {
    if (confirm("¿Deseas eliminar esta materia?")) {
      try {
        await fetchCliente(`/api/materias/${id_materia}`, { method: "DELETE" });
        window.location.reload();
      } catch (error) {
        alert("Error al eliminar la materia");
      }
    }
  };

  return (
    <div>
      <h2>Gestión de Materias</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          value={formulario.nombre}
          placeholder="Nombre de la materia"
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
        <button type="submit">{modoEdicion ? "Actualizar" : "Registrar"}</button>
      </form>

      {loading ? (
        <p>Cargando materias...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {materiasPaginadas.map((materia) => (
                <tr key={materia.id_materia}>
                  <td>{materia.nombre}</td>
                  <td>{materia.descripcion}</td>
                  <td>
                    <button onClick={() => handleEditar(materia)}>Editar</button>
                    <button onClick={() => handleEliminar(materia.id_materia)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Paginador
            total={materias.length}
            actual={paginaActual}
            porPagina={porPagina}
            cambiarPagina={setPaginaActual}
          />
        </>
      )}
    </div>
  );
};

export default Materia;
