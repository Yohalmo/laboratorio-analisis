from utils.DateFormat import DateFormat

class Telefono:
    def __init__(self, id_telefono, nombre, numero_telefono, fecha_creacion):
        self.id_telefono=id_telefono
        self.nombre=nombre
        self.numero_telefono=numero_telefono
        self.fecha_creacion=DateFormat.convert_date(fecha_creacion)

    def to_JSON(self):
        return {
            'id_telefono' : self.id_telefono,
            'nombre' : self.nombre,
            'numero_telefono' : self.numero_telefono,
            'fecha_creacion' : self.fecha_creacion
        }