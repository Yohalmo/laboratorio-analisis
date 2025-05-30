import { useState, useEffect } from "react";
import { usePeriodos } from "../../hook/usePeriodos";
import Paginador from '../../components/paginador';

interface FormPeriodo {
  nombre: string;
  fecha_inicio: string;
  fecha_finalizacion: string;
}

export default function Periodos() {
  const { periodos, loading, error, crearPeriodo, editarPeriodo } = usePeriodos();

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState<FormPeriodo>({
    nombre: '',
    fecha_inicio: '',
    fecha_finalizacion: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  // Filtrado y paginación
  const filtered = periodos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageData = filtered.slice(startIdx, startIdx + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Manejo de inputs
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // Guardar nuevo o editar existente
  async function handleGuardar() {
    if (!formData.nombre || !formData.fecha_inicio || !formData.fecha_finalizacion) {
      alert('Completa todos los campos');
      return;
    }

    try {
      if (isEditing && editId !== null) {
        await editarPeriodo(editId, formData);
      } else {
        await crearPeriodo(formData);
      }
      setFormData({ nombre: '', fecha_inicio: '', fecha_finalizacion: '' });
      setIsEditing(false);
      setEditId(null);
    } catch (err: any) {
      alert(err.message || 'Error al guardar');
    }
  }

  // Preparar formulario para editar
  function handleEditar(periodoId: number) {
    const p = periodos.find(p => p.id_periodo === periodoId);
    if (!p) return;

    setFormData({
      nombre: p.nombre,
      fecha_inicio: p.fecha_inicio,
      fecha_finalizacion: p.fecha_finalizacion,
    });
    setIsEditing(true);
    setEditId(periodoId);
  }

  // Cancelar edición
  function handleCancelar() {
    setFormData({ nombre: '', fecha_inicio: '', fecha_finalizacion: '' });
    setIsEditing(false);
    setEditId(null);
  }

  if (loading) return <p className="text-center">Cargando Periodos...</p>;
  if (error) return <p className="text-center text-danger">{error}</p>;

  return (
    <div className="container">
      <h2>Periodos</h2>

      {/* Buscador */}
      <div className="form-group col-3 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Fecha Inicio</th>
            <th>Fecha Finalización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pageData.map(p => (
            <tr key={p.id_periodo}>
              <td>{p.nombre}</td>
              <td>{p.fecha_inicio}</td>
              <td>{p.fecha_finalizacion}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleEditar(p.id_periodo)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginador */}
      <Paginador
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
      />

      {/* Formulario de creación/edición */}
      <div className="card mt-4 p-3" style={{ maxWidth: 500 }}>
        <h5>{isEditing ? 'Editar Periodo' : 'Agregar Periodo'}</h5>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          className="form-control mb-2"
          value={formData.nombre}
          onChange={handleChange}
        />

        <input
          type="date"
          name="fecha_inicio"
          placeholder="Fecha Inicio"
          className="form-control mb-2"
          value={formData.fecha_inicio}
          onChange={handleChange}
        />

        <input
          type="date"
          name="fecha_finalizacion"
          placeholder="Fecha Finalización"
          className="form-control mb-2"
          value={formData.fecha_finalizacion}
          onChange={handleChange}
        />

        <button className="btn btn-success me-2" onClick={handleGuardar}>
          {isEditing ? 'Actualizar' : 'Agregar'}
        </button>
        {isEditing && (
          <button className="btn btn-secondary" onClick={handleCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
