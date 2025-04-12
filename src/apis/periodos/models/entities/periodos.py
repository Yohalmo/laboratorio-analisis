from database.database import get_connection
from utils.DateFormat import DateFormat

class Periodo:
    def _init_(self, id_periodo, nombre, fecha_inicio, fecha_finalizacion):
        self.id_periodo = id_periodo
        self.nombre = nombre
        self.fecha_inicio = DateFormat.convert_date(fecha_inicio)
        self.fecha_finalizacion = DateFormat.convert_date(fecha_finalizacion)
    
    def to_JSON(self):
        return {
            "id_periodo": self.id_periodo,
            "nombre": self.nombre,
            "fecha_inicio": self.fecha_inicio,
            "fecha_finalizacion": self.fecha_finalizacion
        }