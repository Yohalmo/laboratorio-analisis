from flask import Blueprint, jsonify, request
from ..models.DashboardModel import DashboardModel

main = Blueprint('dashboard_blueprint', __name__)

@main.route("/", methods=['GET'])
def get_info():
    try:
        return jsonify({
            'alumnosCount' : DashboardModel.get_count_table('alumnos'),
            'cursosCount' : DashboardModel.get_count_table('cursos'),
            'motivoCount' : DashboardModel.get_count_table('motivos_ausencia'),
            'materiasCount' : DashboardModel.get_count_table('materias'),
            'periodosCount' : DashboardModel.get_count_table('periodos'),
            'profesoresCount' : DashboardModel.get_count_table('profesores'),
            'reporteCount' : DashboardModel.get_count_table('reportes'),
            'asistenciasCount' : DashboardModel.get_count_table('asistencias'),
            'salonesCount' : DashboardModel.get_count_table('salones'),
            'alumnos' : DashboardModel.get_last_rows_table('alumnos', "id_alumno, concat(nombres, ' ', apellidos) as info"),
            'cursos' : DashboardModel.get_last_rows_table('cursos', 'id_curso, nombre'),
            'motivos' : DashboardModel.get_last_rows_table('motivos_ausencia', 'id_motivo, descripcion'),
            'materias' : DashboardModel.get_last_rows_table('materias', 'id_materia, nombre'),
            'periodos' : DashboardModel.get_last_rows_table('periodos', 'id_periodo, nombre'),
            'profesores' : DashboardModel.get_last_rows_table('profesores', "id_profesor, concat(nombres, ' ', apellidos) as info"),
            'reporte' : DashboardModel.get_last_rows_table('reportes', 'id_reporte, observaciones'),
            'asistencias' : DashboardModel.get_last_rows_table('asistencias', "id_asistencia, concat(nombres, ' ', apellidos, ' (', estado, ')') as info", 
                                                               'inner join alumnos a on a.id_alumno = asistencias.id_alumno'),
            'salones' : DashboardModel.get_last_rows_table('salones', "id_salon, concat(nombre, ' (', capacidad, ')') as info"),
        }), 200
    except Exception as ex:
        return jsonify({'error' : str(ex)}), 500
    
