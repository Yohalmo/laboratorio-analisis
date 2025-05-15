from .entities.periodos import Periodo
from database.database import get_connection

class PeriodoModel:

    @classmethod
    def get_periodos(cls):
        try:
            conn = get_connection()
            periodos = []
            with conn.cursor() as cursor:
                cursor.execute("SELECT id_periodo, nombre, fecha_inicio, fecha_finalizacion FROM periodos")
                result = cursor.fetchall()
                for row in result:
                    periodo = Periodo(*row)
                    periodos.append(periodo.to_json())
            conn.close()
            return periodos
        except Exception as ex:
            raise Exception(f"Error al obtener periodos: {ex}")

    @classmethod
    def get_periodo(cls, id_periodo):
        try:
            conn = get_connection()
            with conn.cursor() as cursor:
                cursor.execute("SELECT id_periodo, nombre, fecha_inicio, fecha_finalizacion FROM periodos WHERE id_periodo = %s", (id_periodo,))
                row = cursor.fetchone()
                if row is not None:
                    periodo = Periodo(*row)
                    return periodo.to_json()
            conn.close()
        except Exception as ex:
            raise Exception(f"Error al obtener el periodo: {ex}")

    @classmethod
    def add_periodo(cls, periodo):
        try:
            conn = get_connection()
            with conn.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO periodos (id_periodo, nombre, fecha_inicio, fecha_finalizacion) VALUES (%s, %s, %s, %s)",
                    (periodo.id_periodo, periodo.nombre, periodo.fecha_inicio, periodo.fecha_finalizacion)
                )
                conn.commit()
            conn.close()
            return 1
        except Exception as ex:
            raise Exception(f"Error al insertar periodo: {ex}")

    @classmethod
    def update_periodo(cls, periodo):
        try:
            conn = get_connection()
            with conn.cursor() as cursor:
                cursor.execute(
                    "UPDATE periodos SET nombre = %s, fecha_inicio = %s, fecha_finalizacion = %s WHERE id_periodo = %s",
                    (periodo.nombre, periodo.fecha_inicio, periodo.fecha_finalizacion, periodo.id_periodo)
                )
                conn.commit()
            conn.close()
            return 1
        except Exception as ex:
            raise Exception(f"Error al actualizar periodo: {ex}")

    @classmethod
    def delete_periodo(cls, periodo):
        try:
            conn = get_connection()
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM periodos WHERE id_periodo = %s", (periodo.id_periodo,))
                conn.commit()
            conn.close()
            return 1
        except Exception as ex:
            raise Exception(f"Error al eliminar periodo: {ex}")
