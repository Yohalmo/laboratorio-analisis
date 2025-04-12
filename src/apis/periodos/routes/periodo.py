from flask import Blueprint, jsonify, request
import uuid
from datetime import datetime
from ..models.periodomodelos import PeriodoModel
from .periodo import Periodo
main = Blueprint('periodo_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_periodos():
    try:
        periodos = PeriodoModel.get_periodos()
        return jsonify(periodos), 200
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500

@main.route('/<id_periodo>', methods=['GET'])
def get_periodo(id_periodo):
    try:
        periodo = PeriodoModel.get_periodo(id_periodo)
        if periodo:
            return jsonify(periodo), 200
        return jsonify({'error': 'Periodo no encontrado'}), 404
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_periodo():
    try:
        data = request.get_json()
        
        # Validación de campos
        if not all(k in data for k in ['nombre', 'fecha_inicio', 'fecha_finalizacion']):
            return jsonify({'error': 'Faltan campos requeridos'}), 400
        
        # Validación de fechas
        fecha_inicio = datetime.strptime(data['fecha_inicio'], '%Y-%m-%d')
        fecha_fin = datetime.strptime(data['fecha_finalizacion'], '%Y-%m-%d')
        
        if fecha_inicio >= fecha_fin:
            return jsonify({'error': 'Fecha inicio debe ser anterior a fecha finalización'}), 400
        
        # Crear periodo
        periodo = Periodo(
            id_periodo=str(uuid.uuid4()),
            nombre=data['nombre'],
            fecha_inicio=data['fecha_inicio'],
            fecha_finalizacion=data['fecha_finalizacion']
        )
        
        # Guardar en BD
        if PeriodoModel.add_periodo(periodo) == 1:
            return jsonify({
                'message': 'Periodo creado',
                'id_periodo': periodo.id_periodo
            }), 201
        return jsonify({'error': 'No se pudo crear el periodo'}), 500
        
    except ValueError:
        return jsonify({'error': 'Formato de fecha debe ser YYYY-MM-DD'}), 400
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500

@main.route('/update/<id_periodo>', methods=['PUT'])
def update_periodo(id_periodo):
    try:
        data = request.get_json()
        
        # Validar existencia
        if not PeriodoModel.get_periodo(id_periodo):
            return jsonify({'error': 'Periodo no existe'}), 404
            
        # Validación de campos
        if not all(k in data for k in ['nombre', 'fecha_inicio', 'fecha_finalizacion']):
            return jsonify({'error': 'Faltan campos requeridos'}), 400
            
        # Validación de fechas
        fecha_inicio = datetime.strptime(data['fecha_inicio'], '%Y-%m-%d')
        fecha_fin = datetime.strptime(data['fecha_finalizacion'], '%Y-%m-%d')
        
        if fecha_inicio >= fecha_fin:
            return jsonify({'error': 'Fecha inicio debe ser anterior a fecha finalización'}), 400
        
        # Actualizar periodo
        periodo = Periodo(
            id_periodo=id_periodo,
            nombre=data['nombre'],
            fecha_inicio=data['fecha_inicio'],
            fecha_finalizacion=data['fecha_finalizacion']
        )
        
        if PeriodoModel.update_periodo(periodo) == 1:
            return jsonify({'message': 'Periodo actualizado'}), 200
        return jsonify({'error': 'No se pudo actualizar'}), 500
        
    except ValueError:
        return jsonify({'error': 'Formato de fecha debe ser YYYY-MM-DD'}), 400
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500

@main.route('/delete/<id_periodo>', methods=['DELETE'])
def delete_periodo(id_periodo):
    try:
        # Validar existencia
        if not PeriodoModel.get_periodo(id_periodo):
            return jsonify({'error': 'Periodo no existe'}), 404
            
        # Crear objeto solo con ID para eliminar
        periodo = Periodo(
            id_periodo=id_periodo,
            nombre='',
            fecha_inicio='2000-01-01',
            fecha_finalizacion='2000-01-01'
        )
        
        if PeriodoModel.delete_periodo(periodo) == 1:
            return jsonify({'message': 'Periodo eliminado'}), 200
        return jsonify({'error': 'No se pudo eliminar'}), 500
        
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500