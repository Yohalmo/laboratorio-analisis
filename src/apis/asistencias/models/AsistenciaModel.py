from database.database import get_connection
from ..models.entities.Asistencia import Asistencia

class AsistenciaModel():
    @classmethod
    def get_all(cls):
        try:
            connection = get_connection()
            lista_asistencias = []


            with connection.cursor() as cursor:
                cursor.execute("""
                            select id_asistencia, fecha, estado, nombres, nombre, ma.descripcion
                               from asistencias s inner join alumnos a on a.id_alumno = s.id_alumno
                               inner join materias m on m.id_materia = s.id_materia
                               left join motivos_ausencia ma on ma.id_motivo = s.id_motivo 
							   order by fecha desc
                               """)
                resultados = cursor.fetchall()
                

                for row in resultados:
                    asistencia= Asistencia(
                        id_asistencia=row[0],
                        fecha=row[1],
                        estado=row[2],
                        id_alumno=0,
                        id_materia=0,
                        id_motivo=0,
                        nombreAlumno=row[3],
                        nombreMateria=row[4],
                        nombreMotivo=row[5],
                    )
                    lista_asistencias.append(asistencia.to_JSON())
            connection.close()
            return lista_asistencias
        except Exception as ex:
            raise Exception(ex)
    
    @classmethod
    def get_by_id(cls, asistencia_id):
        try:
            connection = get_connection()
            asistencia= None
            
            with connection.cursor() as cursor:
                cursor.execute("""
                            select id_asistencia, fecha, estado, nombres, nombre, ma.descripcion
                               from asistencias s inner join alumnos a on a.id_alumno = s.id_alumno
                               inner join materias m on m.id_materia = s.id_materia
                               left join motivos_ausencia ma on ma.id_motivo = s.id_motivo 
							   where id_asistencia = %s 
                               """, (asistencia_id,))
                row = cursor.fetchone()

                if row is not None:
                    asistencia= Asistencia(id_asistencia=row[0],
                            fecha=row[1],
                            estado=row[2],
                            id_alumno =0,
                            id_materia=0,
                            id_motivo=0,
                            nombreAlumno=row[3],
                            nombreMateria=row[4],
                            nombreMotivo=row[5]
                        )
            connection.close()
            return asistencia.to_JSON()

        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def add_asistencia(cls, asistencia: Asistencia):
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                                insert into asistencias(id_asistencia, fecha, estado, id_alumno, id_materia, id_motivo)
                                VALUES (%s, %s, %s, %s, %s, %s)
                               """, (asistencia.id_asistencia, asistencia.fecha,  asistencia.estado,
                                     asistencia.id_alumno, asistencia.id_materia, asistencia.id_motivo))
                
                affecte_rows = cursor.rowcount
                connection.commit()
            
            connection.close()
            return affecte_rows
        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def update_asistencia(cls, asistencia:  Asistencia):
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                            update asistencias set id_alumno = %s, id_materia = %s, 
                               id_motivo = %s, fecha = %s, estado = %s
                                where id_asistencia = %s 
                               """, (asistencia.id_alumno, asistencia.id_materia, asistencia.id_motivo, 
                                     asistencia.fecha, asistencia.estado ,asistencia.id_asistencia))
                
                affecte_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affecte_rows

        except Exception as ex:
            raise Exception(ex)
        
    @classmethod
    def delete_asistencia(cls, id_asistencia):
        try:
            connection = get_connection()
            affecte_rows = 0

            with connection.cursor() as cursor:
                cursor.execute("""
                            delete from asistencias where id_asistencia = %s 
                               """, (id_asistencia,))
                
                affecte_rows = cursor.rowcount
                connection.commit()
            connection.close()
            return affecte_rows

        except Exception as ex:
            raise Exception(ex)