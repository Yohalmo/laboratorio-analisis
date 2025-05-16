# NOMBRE: YEIMI SUCELY GARCIA ALDANA
from utils.DateFormat import DateFormat

class MotivoAusencia:
    def __init__(self, id_motivo, descripcion):
        self.id_motivo = id_motivo
        self.descripcion = descripcion

    def to_JSON(self):
        return {
            'id_motivo': self.id_motivo,
            'descripcion': self.descripcion
        }