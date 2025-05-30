import { useState, useEffect } from "react";
import { useSalones, Salon } from "/../hooks/useSalones";


export default function Salones() {
  const { salones, loading, error, setSalones } = useSalones();

  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Formulario
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Omit<Salon, "id_salon">>({
    nombre: "",
    capacidad: 0,
    ubicacion: "",
    observaciones: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  const filtered = salones.filter((s) =>
    s.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Funciones para el formulario
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacidad" ? Number(value) : value,
    }));
  }

  function handleNuevo() {
    setIsEditing(true);
    setEditId(null);
    setFormData({
      nombre: "",
      capacidad: 0,
      ubicacion: "",
      observaciones: "",
    });
  }

  function handleEditar(salon: Salon) {
    setIsEditing(true);
    setEditId(salon.id_salon);
    setFormData({
      nombre: salon.nombre,
      capacidad: salon.capacidad,
      ubicacion: salon.ubicacion,
      observaciones: salon.observaciones ?? "",
    });
  }

  function handleCancelar() {
    setIsEditing(false);
    setEditId(null);
  }

  function handleGuardar() {
    if (!formData.nombre.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    if (formData.capacidad <= 0) {
      alert("La capacidad debe ser mayor que cero");
      return;
    }

    if (editId !== null) {
      // Editar salón
      setSalones((prev) =>
        prev.map((s) =>
          s.id_salon === editId ? { id_salon: editId, ...formData } : s
        )
      );
    } else {
      // Nuevo salón
      const nuevoId = Math.max(...salones.map((s) => s.id_salon), 0) + 1;
      setSalones((prev) => [...prev, { id_salon: nuevoId, ...formData }]);
    }

    setIsEditing(false);
    setEditId(null);
    setFormData({
      nombre: "",
      capacidad: 0,
      ubicacion: "",
      observaciones: "",
    });
  }

  if (loading) return <p className="text-center">Cargando Salones...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container">
      <h2>Salones</h2>

      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar salón"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleNuevo}>
          Nuevo Salón
        </button>
      </div>

      {isEditing && (
        <div className="card mb-3 p-3 border">
          <h5>{editId !== null ? "Editar Salón" : "Nuevo Salón"}</h5>
          <div className="mb-2">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label>Capacidad</label>
            <input
              type="number"
              name="capacidad"
              className="form-control"
              value={formData.capacidad}
              onChange={handleChange}
              min={1}
            />
          </div>
          <div className="mb-2">
            <label>Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              className="form-control"
              value={formData.ubicacion}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label>Observaciones</label>
            <textarea
              name="observaciones"
              className="form-control"
              value={formData.observaciones}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-success me-2" onClick={handleGuardar}>
            Guardar
          </button>
          <button className="btn btn-secondary" onClick={handleCancelar}>
            Cancelar
          </button>
        </div>
      )}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Capacidad</th>
            <th>Ubicación</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((s) => (
            <tr key={s.id_salon}>
              <td>{s.nombre}</td>
              <td>{s.capacidad}</td>
              <td>{s.ubicacion}</td>
              <td>{s.observaciones ?? "---"}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleEditar(s)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Paginador
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
}
