from utils.DateFormat import DateFormat

class Notificacion:
    def __init__(self, id, id_alumno, fecha_envio, estado):
        
            self.id=id,
            self.id_alumno=id_alumno,
            self.fecha_envio=fecha_envio,
            self.estado=estado

    def to_JSON(self):
        return {
            'id' : self.id,
            'fecha_envio' : self.fecha_envio,
            'id_alumno' : self.id_alumno,
            'estado' : self.estado
        }