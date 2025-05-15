from database.database import get_connection
from ..models.entities.Reporte import Reporte

class ReporteModel():
    @classmethod
    def get_all(cls):
        try:
            connection = get_connection()
            lista_reportes = []


            with connection.cursor() as cursor:
                cursor.execute("""
                            select id_reporte, fecha, r.observaciones, nombres, nombre
                               from reportes r inner join alumnos a on a.id_alumno = r.id_alumno
                               inner join periodos p on p.id_periodo = r.id_periodo
							   order by fecha desc
                               """)
                resultados = cursor.fetchall()
                

                for row in resultados:
                    reporte= Reporte(
                        id_reporte=row[0],
                        fecha=row[1],
                        observaciones=row[2],
                        id_alumno=0,
                        id_periodo=0,
                        nombreAlumno=row[3],
                        nombrePeriodo=row[4],
                    )
                    lista_reportes.append(reporte.to_JSON())
            connection.close()
            return lista_reportes
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def get_by_id(cls, reporte_id):
        try:
            connection = get_connection()
            reporte= None
            
            with connection.cursor() as cursor:
                cursor.execute("""
                            select id_reporte, fecha, r.observaciones, nombres, nombre
                               from reportes r inner join alumnos a on a.id_alumno = r.id_alumno
                               inner join periodos p on p.id_periodo = r.id_periodo
							   where id_reporte = %s 
                               """, (reporte_id,))
                row = cursor.fetchone()

                if row is not None:
                    reporte= Reporte(
                        id_reporte=row[0],
                        fecha=row[1],
                        observaciones=row[2],
                        id_alumno=0,
                        id_periodo=0,
                        nombreAlumno=row[3],
                        nombrePeriodo=row[4],
                    )
            connection.close()
            return reporte.to_JSON()

        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def add_reporte(cls, reporte: Reporte):
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                                insert into reportes(id_reporte, fecha, observaciones, id_alumno, id_periodo)
                                VALUES (%s, %s, %s, %s, %s)
                               """, (reporte.id_reporte, reporte.fecha,  reporte.observaciones,
                                     reporte.id_alumno, reporte.id_periodo))
                
                affecte_rows = cursor.rowcount
                connection.commit()
            
            connection.close()
            return affecte_rows
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def update_reporte(cls, reporte:  Reporte):
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                            update reportes set id_alumno = %s, id_periodo = %s, 
                               fecha = %s, observaciones = %s where id_reporte = %s 
                               """, (reporte.id_alumno, reporte.id_periodo,
                                     reporte.fecha, reporte.observaciones ,reporte.id_reporte))
                
                affecte_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affecte_rows

        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def delete_reporte(cls, id_reporte):
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                            delete from reportes where id_reporte = %s 
                               """, (id_reporte,))
                
                affecte_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affecte_rows

        except Exception as ex:
            raise Exception(ex)