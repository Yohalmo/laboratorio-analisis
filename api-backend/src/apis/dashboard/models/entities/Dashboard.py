
class Dashboard:
    def __init__(self, _id_registro, _field_registro):
        self.id_registro = _id_registro
        self.field_registro = _field_registro

    def to_JSON(self):
        return {
            'id_registro' : self.id_registro,
            'field_registro' : self.field_registro,
        }