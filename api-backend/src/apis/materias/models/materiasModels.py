# NOMBRE: YEIMI SUCELY GARCIA ALDANA
from database.database import get_connection
from ..models.entities.materias import Materias

class MateriasModel:

    @classmethod
    def get_all_materias(cls):
        try:
            connection = get_connection()
            materias_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_materia, nombre, descripcion
                    FROM materias
                    ORDER BY nombre ASC
                """)
                result = cursor.fetchall()
                for row in result:
                    materia = Materias(
                        id_materia=row[0],
                        nombre=row[1],
                        descripcion=row[2]
                    )
                    materias_list.append(materia.to_JSON())
            connection.close()
            return materias_list
        except Exception as e:
            print(f"Error al obtener las materias: {e}")
            return []

    @classmethod
    def get_materia_by_id(cls, materia_id):
        try:
            connection = get_connection()
            materia_json = None
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_materia, nombre, descripcion
                    FROM materias
                    WHERE id_materia = %s
                """, (materia_id,))
                row = cursor.fetchone()
                if row is not None:
                    materia = Materias(
                        id_materia=row[0],
                        nombre=row[1],
                        descripcion=row[2]
                    )
                    materia_json = materia.to_JSON()
            return materia_json
        except Exception as e:
            print(f"Error al obtener la materia: {e}")
            return []

    @classmethod
    def add_materia(cls, materia: Materias):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO materias (nombre, descripcion)
                    VALUES (%s, %s)
                """, (
                    materia.nombre,
                    materia.descripcion
                ))
                affected_rows = cursor.rowcount
                connection.commit()
                return affected_rows
        except Exception as e:
            raise Exception(e)

    @classmethod
    def update_materia(cls, materia: Materias):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE materias
                    SET nombre = %s,
                        descripcion = %s
                    WHERE id_materia = %s
                """, (
                    materia.nombre,
                    materia.descripcion,
                    materia.id_materia
                ))
                affected_rows = cursor.rowcount
                connection.commit()
                return affected_rows
        except Exception as e:
            raise Exception(e)

    @classmethod
    def delete_materia(cls, materia: Materias):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM materias
                    WHERE id_materia = %s
                """, (materia.id_materia,))
                affected_rows = cursor.rowcount
                connection.commit()
                return affected_rows
        except Exception as e:
            raise Exception(e)
