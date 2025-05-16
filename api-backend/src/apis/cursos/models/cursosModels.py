# NOMBRE: YEIMI SUCELY GARCIA ALDANA
from database.database import get_connection
from ..models.entities.cursos import Curso

class cursosModel: 

    @classmethod
    def get_all_cursos(cls):
        try:
            connection = get_connection()
            cursos_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_curso, c.nombre, c.descripcion, c.estado, p.nombre as nombre_periodo
                    FROM cursos c inner join periodos p on p.id_periodo = c.id_periodo
                    ORDER BY c.nombre ASC
                """)
                result = cursor.fetchall()
                for row in result:
                    curso = Curso(
                        id_curso=row[0],
                        nombre=row[1],
                        descripcion=row[2],
                        estado=row[3],
                        id_periodo='',
                        nombre_periodo=row[4]
                    )
                    cursos_list.append(curso.to_JSON())
            connection.close()
            return cursos_list
        except Exception as e:
            print(f"Error al obtener los cursos: {e}")
            return []
        
    @classmethod
    def get_cursos_by_id(cls, cursos_id):
        try:
            connection = get_connection()
            cursos_json = None
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_curso, nombre, descripcion, estado, id_periodo
                    FROM cursos where id_curso= %s
                """, (cursos_id,))
                row=cursor.fetchone()
                if row is not None:
                    curso= Curso( id_curso=row[0],
                        nombre=row[1],
                        descripcion=row[2],
                        estado=row[3],
                        id_periodo=row[4])
              
                    cursos_json= curso.to_JSON()
                connection.close()
            return cursos_json
        except Exception as e:
            print(f"Error al obtener los cursos: {e}")
            return []
    @classmethod
    def add_curso(cls, cursos: Curso):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO cursos (nombre, descripcion, estado, id_periodo)
                    VALUES (%s, %s, %s, %s)
                """, (
                    cursos.nombre,
                    cursos.descripcion,
                    cursos.estado,
                    cursos.id_periodo
                ))
                affected_rows=cursor.rowcount
                connection.commit()
                connection.close()
                return affected_rows
        except Exception as e:
            raise Exception(e)
    @classmethod
    def update_curso(cls, cursos:Curso):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE cursos
                    SET nombre = %s,
                        descripcion = %s,
                        estado = %s,
                        id_periodo = %s
                    WHERE id_curso = %s
                """, (
                    cursos.nombre,
                    cursos.descripcion,
                    cursos.estado,
                    cursos.id_periodo,
                    cursos.id_curso
                ))
                affected_rows=cursor.rowcount
                connection.commit()
                connection.close()
                return affected_rows
        except Exception as e:
            raise Exception(e)
    @classmethod
    def delete_curso(cls, cursos:Curso):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM cursos
                    WHERE id_curso = %s
                """, (cursos.id_curso,))
                affected_rows = cursor.rowcount
                connection.commit()
                connection.close()
                return affected_rows
        except Exception as e:
            raise Exception(e)
