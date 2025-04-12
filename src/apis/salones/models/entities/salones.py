class Salon:
    def __init__(self, id_salon, nombre, capacidad, ubicacion, observaciones=None):
        self.id_salon = id_salon
        self.nombre = nombre
        self.capacidad = capacidad
        self.ubicacion = ubicacion
        self.observaciones = observaciones
    
    def to_JSON(self):
        return {
            "id_salon": self.id_salon,
            "nombre": self.nombre,
            "capacidad": self.capacidad,
            "ubicacion": self.ubicacion,
            "observaciones": self.observaciones
        }