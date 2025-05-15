from utils.DateFormat import DateFormat

class Profesor:
    def __init__(self, id_profesor, nombre, apellido, especialidad, telefono, email,documento_identidad):
        self.id_profesor = id_profesor
        self.nombre = nombre
        self.apellido = apellido
        self.especialidad = especialidad
        self.telefono = telefono
        self.email = email
        self.documento_identidad=documento_identidad
        
    
    def to_JSON(self):
        return {
            "id_profesor": self.id_profesor,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "dui": self.documento_identidad,
            "especialidad": self.especialidad,
            "telefono": self.telefono,
            "email": self.email,
            "documento_identidad": self.documento_identidad
           
        }