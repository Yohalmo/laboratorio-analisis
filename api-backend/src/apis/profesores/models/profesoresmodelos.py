from database.database import get_connection
from .entities import Profesor

class ProfesorModel:
    
    @classmethod
    def get_profesores(cls):
        try:
            connection = get_connection()
            profesores = []
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_profesor, nombres, apellidos, especialidad, 
                           telefono, email, documento_identificacion
                    FROM profesores
                    ORDER BY apellidos, nombres ASC
                """)
                resultset = cursor.fetchall()
                
                for row in resultset:
                    profesor = Profesor(
                        row[0], row[1], row[2], row[3], 
                        row[4], row[5], row[6]
                    )
                    profesores.append(profesor.to_JSON())
            
            connection.close()
            return profesores
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def get_profesor(cls, id_profesor):
        try:
            connection = get_connection()
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_profesor, nombres, apellidos, especialidad, 
                           telefono, email, documento_identificacion
                    FROM profesores 
                    WHERE id_profesor = %s
                """, (id_profesor,))
                row = cursor.fetchone()
                
                if row:
                    profesor = Profesor(
                        row[0], row[1], row[2], row[3], 
                        row[4], row[5], row[6]
                    )
                    return profesor.to_JSON()
                else:
                    return None
            
            connection.close()
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def add_profesor(cls, profesor):
        try:
            connection = get_connection()
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO profesores (id_profesor, nombres, apellidos, 
                                          especialidad, telefono, email, 
                                          documento_identificacion)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    profesor.id_profesor, profesor.nombre, profesor.apellido,
                    profesor.especialidad, profesor.telefono,
                    profesor.email, profesor.documento_identidad
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def update_profesor(cls, profesor):
        try:
            connection = get_connection()
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE profesores 
                    SET nombres = %s, apellidos = %s, especialidad = %s,
                        telefono = %s, email = %s, documento_identificacion = %s
                    WHERE id_profesor = %s
                """, (
                    profesor.nombre, profesor.apellido, profesor.especialidad,
                    profesor.telefono, profesor.email, 
                    profesor.documento_identidad, profesor.id_profesor
                ))
                affected_rows = cursor.rowcount
                connection.commit()
            
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def delete_profesor(cls, profesor):
        try:
            connection = get_connection()
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM profesores 
                    WHERE id_profesor = %s
                """, (profesor.id_profesor,))
                affected_rows = cursor.rowcount
                connection.commit()
            
            connection.close()
            return affected_rows
        except Exception as ex:
            raise Exception(ex)