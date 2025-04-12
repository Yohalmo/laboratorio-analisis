# NOMBRE: YEIMI SUCELY GARCIA ALDANA
from utils.DateFormat import DateFormat
class Materia:
    def __init__(self, id_materia, nombre, descripcion):
        self.id_materia = id_materia
        self.nombre = nombre
        self.descripcion = descripcion

    def to_JSON(self):
        return {
            'id_materia': self.id_materia,
            'nombre': self.nombre,
            'descripcion': self.descripcion
        }
