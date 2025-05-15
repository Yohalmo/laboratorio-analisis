from utils.DateFormat import DateFormat

class Reporte:
    def __init__(self, id_reporte, fecha, observaciones, id_alumno, id_periodo, nombreAlumno = None, nombrePeriodo = None):
        self.id_reporte = id_reporte
        self.fecha = DateFormat.convert_date(fecha)
        self.observaciones = observaciones
        self.id_alumno = id_alumno
        self.id_periodo = id_periodo
        self.nombreAlumno = nombreAlumno
        self.nombrePeriodo = nombrePeriodo

    def to_JSON(self):
        return {
            'id_reporte' : self.id_reporte,
            'fecha' : self.fecha,
            'observaciones' : self.observaciones,
            'alumno' : self.nombreAlumno,
            'periodo' : self.nombrePeriodo,
        }