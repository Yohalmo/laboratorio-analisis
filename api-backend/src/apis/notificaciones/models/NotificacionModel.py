from database.database import get_connection

from ..models.entities.Notificacion import Notificacion

class NotificacionModel():
    @classmethod
    def get_all(cls):
        try:
            connection = get_connection()
            lista_notificacions = []

            with connection.cursor() as cursor:
                cursor.execute("""
                            select id, id_alumno, fecha_envio, estado from notificaciones order by fecha_envio desc
                               """)
                resultados = cursor.fetchall()
                
                for row in resultados:
                    notificacion= Notificacion(
                        id=row[0],
                        id_alumno=row[1],
                        fecha_envio=row[2],
                        estado=row[3]
                    )
                    lista_notificacions.append(notificacion.to_JSON())
            connection.close()
            return lista_notificacions
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def get_by_id(cls, notificacion_id):
        try:
            connection = get_connection()
            notificacion= None
            
            with connection.cursor() as cursor:
                cursor.execute("""
                            select id, fecha_envio, estado, id_alumno from notificaciones
							   where id_notificacion = %s 
                               """, (notificacion_id,))
                row = cursor.fetchone()

                if row is not None:
                    notificacion= Notificacion(
                        id=row[0],
                        id_alumno=row[1],
                        fecha_envio=row[2],
                        estado=row[3]
                    )
            connection.close()
            return notificacion.to_JSON()

        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def add_notificacion(cls, notificacion: Notificacion):
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                                insert into notificaciones(id, fecha_envio, estado, id_alumno)
                                VALUES (%s, %s, %s, %s)
                               """, (notificacion.id, notificacion.fecha_envio,  notificacion.estado,
                                     notificacion.id_alumno))
                
                affecte_rows = cursor.rowcount
                connection.commit()
            
            connection.close()
            return affecte_rows
        except Exception as ex:
            raise Exception(ex)
      
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                            delete from notificacions where id_notificacion = %s 
                               """, (id_notificacion,))
                
                affecte_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affecte_rows

        except Exception as ex:
            raise Exception(ex)