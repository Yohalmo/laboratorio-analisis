# NOMBRE: YEIMI SUCELY GARCIA ALDANA
from utils.DateFormat import DateFormat

class Curso:
    def __init__(self, id_curso, nombre, descripcion, estado, id_periodo, nombre_periodo = None):
        self.id_curso = id_curso
        self.nombre = nombre
        self.descripcion = descripcion
        self.estado = estado
        self.id_periodo = id_periodo
        self.nombre_periodo = nombre_periodo

    def to_JSON(self):
        return {
            'id_curso': self.id_curso,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'estado': self.estado,
            'nombre_periodo': self.nombre_periodo
        }