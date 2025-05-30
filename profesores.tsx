import { useState, useEffect } from "react";

export default function Profesores() {
  const [profesores, setProfesores] = useState([]);
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    especialidad: "",
    telefono: "",
    email: "",
    documento_identificacion: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const fetchProfesores = async () => {
    const res = await fetch("/api/profesores");
    const data = await res.json();
    setProfesores(data);
  };

  useEffect(() => {
    fetchProfesores();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/profesores/${editingId}` : "/api/profesores";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setFormData({
      nombres: "",
      apellidos: "",
      especialidad: "",
      telefono: "",
      email: "",
      documento_identificacion: "",
    });
    setEditingId(null);
    fetchProfesores();
  };

  const handleEdit = (profesor) => {
    setFormData(profesor);
    setEditingId(profesor.id_profesor);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar este profesor?")) {
      await fetch(`/api/profesores/${id}`, { method: "DELETE" });
      fetchProfesores();
    }
  };

  const profesoresFiltrados = profesores.filter((p) =>
    `${p.nombres} ${p.apellidos}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profesores</h1>

      <input
        type="text"
        placeholder="Buscar profesor..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6">
        <input name="nombres" value={formData.nombres} onChange={handleChange} placeholder="Nombres" className="border p-2" required />
        <input name="apellidos" value={formData.apellidos} onChange={handleChange} placeholder="Apellidos" className="border p-2" required />
        <input name="especialidad" value={formData.especialidad} onChange={handleChange} placeholder="Especialidad" className="border p-2" />
        <input name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" className="border p-2" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border p-2" />
        <input name="documento_identificacion" value={formData.documento_identificacion} onChange={handleChange} placeholder="Documento ID" className="border p-2" />

        <button type="submit" className="bg-blue-600 text-white p-2 col-span-2">
          {editingId ? "Actualizar Profesor" : "Agregar Profesor"}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Nombres</th>
            <th className="border p-2">Apellidos</th>
            <th className="border p-2">Especialidad</th>
            <th className="border p-2">Teléfono</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Doc. ID</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesoresFiltrados.map((p) => (
            <tr key={p.id_profesor}>
              <td className="border p-2">{p.nombres}</td>
              <td className="border p-2">{p.apellidos}</td>
              <td className="border p-2">{p.especialidad}</td>
              <td className="border p-2">{p.telefono}</td>
              <td className="border p-2">{p.email}</td>
              <td className="border p-2">{p.documento_identificacion}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(p)} className="bg-yellow-400 px-2 py-1">Editar</button>
                <button onClick={() => handleDelete(p.id_profesor)} className="bg-red-500 text-white px-2 py-1">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
