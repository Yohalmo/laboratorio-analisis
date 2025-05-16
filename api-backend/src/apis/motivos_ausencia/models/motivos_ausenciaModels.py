from database.database import get_connection
from ..models.entities.motivos_ausencia import MotivoAusencia

class MotivoAusenciaModel:

    @classmethod
    def get_all_motivos(cls):
        try:
            connection = get_connection()
            motivos_list = []
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_motivo, descripcion
                    FROM motivos_ausencia
                    ORDER BY descripcion ASC
                """)
                result = cursor.fetchall()
                for row in result:
                    motivo = MotivoAusencia(
                        id_motivo=row[0],
                        descripcion=row[1]
                    )
                    motivos_list.append(motivo.to_JSON())
            connection.close()
            return motivos_list
        except Exception as e:
            print(f"Error al obtener los motivos: {e}")
            return []

    @classmethod
    def get_motivo_by_id(cls, motivo_id):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id_motivo, descripcion
                    FROM motivos_ausencia
                    WHERE id_motivo = %s
                """, (motivo_id,))
                row = cursor.fetchone()
                if row is not None:
                    motivo = MotivoAusencia(
                        id_motivo=row[0],
                        descripcion=row[1]
                    )
                    return motivo.to_JSON()
            return None
        except Exception as e:
            print(f"Error al obtener el motivo: {e}")
            return None

    @classmethod
    def add_motivo(cls, motivo: MotivoAusencia):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO motivos_ausencia (descripcion)
                    VALUES (%s)
                """, (motivo.descripcion,))
                affected_rows = cursor.rowcount
                connection.commit()
                return affected_rows
        except Exception as e:
            raise Exception(e)

    @classmethod
    def update_motivo(cls, motivo: MotivoAusencia):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE motivos_ausencia
                    SET descripcion = %s
                    WHERE id_motivo = %s
                """, (
                    motivo.descripcion,
                    motivo.id_motivo
                ))
                affected_rows = cursor.rowcount
                connection.commit()
                return affected_rows
        except Exception as e:
            raise Exception(e)

    @classmethod
    def delete_motivo(cls, motivo: MotivoAusencia):
        try:
            connection = get_connection()
            with connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM motivos_ausencia
                    WHERE id_motivo = %s
                """, (motivo.id_motivo,))
                affected_rows = cursor.rowcount
                connection.commit()
                return affected_rows
        except Exception as e:
            raise Exception(e)
