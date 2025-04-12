from utils.DateFormat import DateFormat

class Alumno:
    def __init__(self, _id_alumno, _nombres, _apellidos, _fecha_nacimiento, _direccion, _telefono, _email):
        self.id_alumno = _id_alumno
        self.nombres = _nombres
        self.apellidos = _apellidos 
        self.fecha_nacimiento = DateFormat.convert_date(_fecha_nacimiento)
        self.direccion = _direccion
        self.telefono = _telefono
        self.email = _email

    def to_JSON(self):
        return {
            'id_alumno' : self.id_alumno,
            'nombres' : self.nombres,
            'apellidos' : self.apellidos,
            'fecha_nacimiento' : self.fecha_nacimiento,
            'direccion' : self.direccion,
            'telefono' : self.telefono,
            'email' : self.email
        }