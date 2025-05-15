from utils.DateFormat import DateFormat

class Asistencia:
    def __init__(self, id_asistencia, fecha, estado, id_alumno, id_materia, id_motivo, nombreAlumno = None, nombreMateria = None, nombreMotivo = None):
        self.id_asistencia = id_asistencia
        self.fecha = DateFormat.convert_date(fecha)
        self.estado = estado
        self.id_alumno = id_alumno
        self.id_materia = id_materia
        self.id_motivo = id_motivo
        self.nombreAlumno = nombreAlumno
        self.nombreMateria = nombreMateria
        self.nombreMotivo = nombreMotivo

    def to_JSON(self):
        return {
            'id_asistencia' : self.id_asistencia,
            'fecha' : self.fecha,
            'estado' : self.estado,
            'alumno' : self.nombreAlumno,
            'materia' : self.nombreMateria,
            'motivo' : self.nombreMotivo
        }