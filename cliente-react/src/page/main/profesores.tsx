import { useState, useEffect } from "react";


interface Profesor {
  id_profesor: number;
  nombres: string;
  apellidos: string;
  fecha_nacimiento: string; 
  direccion: string;
  telefono: string;
  email: string;
}


function useProfesores() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProfesores([
        {
          id_profesor: 1,
          nombres: "Juan",
          apellidos: "Pérez",
          fecha_nacimiento: "1980-05-12",
          direccion: "Calle Falsa 123",
          telefono: "5551234567",
          email: "juan.perez@email.com",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return { profesores, loading, error, setProfesores };
}

export default function Profesores() {
  const { profesores, loading, error, setProfesores } = useProfesores();

  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

 
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Profesor, "id_profesor">>({
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    direccion: "",
    telefono: "",
    email: "",
  });

  const filtered = profesores.filter((p) =>
    `${p.nombres} ${p.apellidos}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleNuevo() {
    setIsEditing(true);
    setEditId(null);
    setFormData({
      nombres: "",
      apellidos: "",
      fecha_nacimiento: "",
      direccion: "",
      telefono: "",
      email: "",
    });
  }

  function handleEditar(profesor: Profesor) {
    setIsEditing(true);
    setEditId(profesor.id_profesor);
    setFormData({
      nombres: profesor.nombres,
      apellidos: profesor.apellidos,
      fecha_nacimiento: profesor.fecha_nacimiento,
      direccion: profesor.direccion,
      telefono: profesor.telefono,
      email: profesor.email,
    });
  }

  function handleCancelar() {
    setIsEditing(false);
    setEditId(null);
  }

  function handleGuardar() {
    if (!formData.nombres.trim() || !formData.apellidos.trim()) {
      alert("Nombres y apellidos son obligatorios");
      return;
    }
    

    if (editId !== null) {
      
      setProfesores((prev) =>
        prev.map((p) =>
          p.id_profesor === editId ? { id_profesor: editId, ...formData } : p
        )
      );
    } else {
   
      const nuevoId = Math.max(...profesores.map((p) => p.id_profesor), 0) + 1;
      setProfesores((prev) => [...prev, { id_profesor: nuevoId, ...formData }]);
    }

    setIsEditing(false);
    setEditId(null);
  }

  if (loading) return <p className="text-center">Cargando Profesores...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container">
      <h2>Profesores</h2>

      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Buscar profesor"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleNuevo}>
          Nuevo Profesor
        </button>
      </div>

      {isEditing && (
        <div className="card mb-3 p-3 border">
          <h5>{editId !== null ? "Editar Profesor" : "Nuevo Profesor"}</h5>

          <div className="mb-2">
            <label>Nombres</label>
            <input
              type="text"
              name="nombres"
              className="form-control"
              value={formData.nombres}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>Apellidos</label>
            <input
              type="text"
              name="apellidos"
              className="form-control"
              value={formData.apellidos}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>Fecha de nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              className="form-control"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              className="form-control"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              className="form-control"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
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
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Fecha de nacimiento</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map((p) => (
            <tr key={p.id_profesor}>
              <td>{p.nombres}</td>
              <td>{p.apellidos}</td>
              <td>{p.fecha_nacimiento}</td>
              <td>{p.direccion}</td>
              <td>{p.telefono}</td>
              <td>{p.email}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleEditar(p)}
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

