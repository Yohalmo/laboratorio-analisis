from database.database import get_connection
from ...models.entities.salones import Salon

class SalonModel:
    
    @classmethod
    def get_salones(cls):
        try:
            connection = get_connection()
            salones = []
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_salon, nombre, capacidad, ubicacion, observaciones
                    FROM salones
                    ORDER BY nombre ASC
                """)
                resultset = cursor.fetchall()
                
                for row in resultset:
                    salon = Salon(
                        row[0], row[1], row[2], row[3], row[4]
                    )
                    salones.append(salon.to_JSON())
            
            connection.close()
            return salones
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def get_salon(cls, id_salon):
        try:
            connection = get_connection()
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_salon, nombre, capacidad, ubicacion, observaciones
                    FROM salones 
                    WHERE id_salon = %s
                """, (id_salon,))
                row = cursor.fetchone()
                
                if row:
                    salon = Salon(
                        row[0], row[1], row[2], row[3], row[4]
                    )
                    return salon.to_JSON()
                else:
                    return None
            
            connection.close()
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def add_salon(cls, salon):
        try:
            connection = get_connection()
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO salones (id_salon, nombre, capacidad, ubicacion, observaciones)
                    VALUES (%s, %s, %s, %s, %s)
                """, (
                    salon.id_salon, salon.nombre, salon.capacidad,
                    salon.ubicacion, salon.observaciones
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def update_salon(cls, salon):
        try:
            connection = get_connection()
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE salones 
                    SET nombre = %s, capacidad = %s, 
                        ubicacion = %s, observaciones = %s
                    WHERE id_salon = %s
                """, (
                    salon.nombre, salon.capacidad, 
                    salon.ubicacion, salon.observaciones, 
                    salon.id_salon
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def delete_salon(cls, salon):
        try:
            connection = get_connection()
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM salones 
                    WHERE id_salon = %s
                """, (salon.id_salon,))
                affected_rows = cursor.rowcount
                connection.commit()
            
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)