from database.database import get_connection
from .entities.Telefono import Telefono

class TelefonoModel():
    @classmethod
    def get_all(cls):
        try:
            connection = get_connection()
            lista_telefonos = []

            with connection.cursor() as cursor:
                cursor.execute("""
                            select id_telefono, nombre, numero_telefono, fecha_creacion from telefonos order by id_telefono desc
                               """)
                resultados = cursor.fetchall()
                
                for row in resultados:
                    telefono= Telefono(
                        id_telefono=row[0],
                        nombre=row[1],
                        numero_telefono=row[2],
                        fecha_creacion=row[3],
                    )
                    lista_telefonos.append(telefono.to_JSON())
            connection.close()
            return lista_telefonos
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def get_by_id(cls, telefono_id):
        try:
            connection = get_connection()
            telefono= None
            
            with connection.cursor() as cursor:
                cursor.execute("""
                            select id_telefono, nombre, numero_telefono, fecha_creacion from telefonos
							   where id_telefono = %s 
                               """, (telefono_id,))
                row = cursor.fetchone()

                if row is not None:
                    telefono= Telefono(
                        id_telefono=row[0],
                        nombre=row[1],
                        numero_telefono=row[2],
                        fecha_creacion=row[3],
                    )
            connection.close()
            return telefono.to_JSON()

        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def add_telefono(cls, telefono: Telefono):
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                                insert into telefonos(id_telefono, fecha_creacion, numero_telefono, nombre)
                                VALUES (%s, %s, %s, %s)
                               """, (telefono.id_telefono, telefono.fecha_creacion,  telefono.numero_telefono, telefono.nombre))
                
                affecte_rows = cursor.rowcount
                connection.commit()
            
            connection.close()
            return affecte_rows
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def update_telefono(cls, telefono:  Telefono):
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                            update telefonos set fecha_creacion = %s, numero_telefono = %s, nombre = %s where id_telefono = %s 
                               """, (telefono.fecha_creacion, telefono.numero_telefono, telefono.nombre, telefono.id_telefono))
                
                affecte_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affecte_rows

        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def delete_telefono(cls, id_telefono):
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                            delete from telefonos where id_telefono = %s 
                               """, (id_telefono,))
                
                affecte_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affecte_rows

        except Exception as ex:
            raise Exception(ex)