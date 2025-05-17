from database.database import get_connection
from ..models.entities.Alumno import Alumno

class AlumnoModel():
    @classmethod
    def get_all(cls, limit):
        try:
            connection = get_connection()
            lista_alumnos = []

            with connection.cursor() as cursor:
                query = """
                            select id_alumno, nombres, apellidos, fecha_nacimiento, 
                               direccion, telefono, email from alumnos order by 
                               """
                if limit != 0:
                    query += " created_at desc limit 5"
                else:
                    query += " nombres "

                cursor.execute(query)
                resultados = cursor.fetchall()

                for row in resultados:
                    alumno = Alumno(
                        _id_alumno=row[0],
                        _nombres=row[1],
                        _apellidos=row[2],
                        _fecha_nacimiento = row[3],
                        _direccion=row[4],
                        _telefono=row[5],
                        _email=row[6]
                    )
                    lista_alumnos.append(alumno.to_JSON())
            connection.close()
            return lista_alumnos
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def get_by_id(cls, alumno_id):
        try:
            connection = get_connection()
            alumno = None
            
            with connection.cursor() as cursor:
                cursor.execute("""
                            select id_alumno, nombres, apellidos, fecha_nacimiento, 
                               direccion, telefono, email from alumnos where id_alumno = %s 
                               """, (alumno_id,))
                row = cursor.fetchone()

                if row is not None:
                    alumno = Alumno(_id_alumno=row[0],
                        _nombres=row[1],
                        _apellidos=row[2],
                        _fecha_nacimiento = row[3],
                        _direccion=row[4],
                        _telefono=row[5],
                        _email=row[6])
            connection.close()
            return alumno.to_JSON()

        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def add_alumno(cls, alumno: Alumno):
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                            insert into alumnos (id_alumno, nombres, apellidos, 
                               fecha_nacimiento, direccion, telefono, email) values (%s, %s, %s, %s, %s, %s, %s)
                               """, (alumno.id_alumno, alumno.nombres, alumno.apellidos, alumno.fecha_nacimiento, 
                                     alumno.direccion, alumno.telefono, alumno.email))
                
                affecte_rows = cursor.rowcount
                connection.commit()
                print('alumno agregado')
            connection.close()
            return affecte_rows
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def update_alumno(cls, alumno: Alumno):
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                            update alumnos set nombres = %s, apellidos = %s, 
                               fecha_nacimiento = %s, direccion = %s, telefono = %s, email = %s
                                where id_alumno = %s 
                               """, (alumno.nombres, alumno.apellidos, alumno.fecha_nacimiento, 
                                     alumno.direccion, alumno.telefono, alumno.email, alumno.id_alumno))
                
                affecte_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affecte_rows

        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def delete_alumno(cls, id_alumno):
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                            delete from alumnos where id_alumno = %s 
                               """, (id_alumno,))
                
                affecte_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affecte_rows

        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def count_alumnos(cls):
        try:
            connection = get_connection()
            total = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                            select count(*) as total from alumnos 
                               """)
                row = cursor.fetchone()
                total = row[0]
            connection.close()

            return total
        except Exception as ex:
            raise Exception(ex)
        
        