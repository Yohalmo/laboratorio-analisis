from database.database import get_connection
from ..models.entities.Dashboard import Dashboard

class DashboardModel():
    @classmethod
    def get_last_rows_table(cls, table, fields, query = ''):
        try:
            connection = get_connection()
            registros = []

            with connection.cursor() as cursor:
                query = f"""
                            select { fields} from {table} {query} order by {table}.created_at desc limit 5
                               """
                
                print(query)

                cursor.execute(query)
                resultados = cursor.fetchall()

                for row in resultados:
                    alumno = Dashboard(
                        _id_registro=row[0],
                        _field_registro=row[1],
                    )
                    registros.append(alumno.to_JSON())
            connection.close()

            return registros
        except Exception as ex:
            raise Exception(ex)
      
    @classmethod
    def get_count_table(cls, table):
        try:
            connection = get_connection()
            total = 0

            with connection.cursor() as cursor:
                cursor.execute(f"""
                            select count(*) as total from {table} 
                               """)
                row = cursor.fetchone()
                total = row[0]
            connection.close()

            return total
        except Exception as ex:
            raise Exception(ex)
        
        