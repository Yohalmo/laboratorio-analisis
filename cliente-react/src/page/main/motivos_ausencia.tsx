import { useState } from "react";
import { useMotivosAusencia } from "../../hook/useMotivosAusencia";
import { fetchCliente } from "../../api/fetchCliente";
import Paginador from "../../components/paginador";

const MotivoAusencia = () => {
  const { motivos, loading, error } = useMotivosAusencia();
  const [formulario, setFormulario] = useState({
    descripcion: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [motivoEditando, setMotivoEditando] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);

  const porPagina = 5;
  const motivosPaginados = motivos.slice(
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
      if (modoEdicion && motivoEditando) {
        await fetchCliente(`/api/motivos_ausencia/${motivoEditando.id_motivo}`, {
          method: "PUT",
          body: formulario,
        });
      } else {
        await fetchCliente("/api/motivos_ausencia", {
          method: "POST",
          body: formulario,
        });
      }
      window.location.reload();
    } catch (error) {
      alert("Error al guardar el motivo de ausencia");
    }
  };

  const handleEditar = (motivo) => {
    setFormulario({ descripcion: motivo.descripcion });
    setModoEdicion(true);
    setMotivoEditando(motivo);
  };

  const handleEliminar = async (id_motivo) => {
    if (confirm("¿Deseas eliminar este motivo de ausencia?")) {
      try {
        await fetchCliente(`/api/motivos_ausencia/${id_motivo}`, {
          method: "DELETE",
        });
        window.location.reload();
      } catch (error) {
        alert("Error al eliminar el motivo");
      }
    }
  };

  return (
    <div>
      <h2>Gestión de Motivos de Ausencia</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="descripcion"
          value={formulario.descripcion}
          placeholder="Descripción"
          onChange={handleChange}
          required
        />
        <button type="submit">
          {modoEdicion ? "Actualizar" : "Registrar"}
        </button>
      </form>

      {loading ? (
        <p>Cargando motivos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {motivosPaginados.map((motivo) => (
                <tr key={motivo.id_motivo}>
                  <td>{motivo.descripcion}</td>
                  <td>
                    <button onClick={() => handleEditar(motivo)}>Editar</button>
                    <button onClick={() => handleEliminar(motivo.id_motivo)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Paginador
            total={motivos.length}
            actual={paginaActual}
            porPagina={porPagina}
            cambiarPagina={setPaginaActual}
          />
        </>
      )}
    </div>
  );
};

export default MotivoAusencia;
