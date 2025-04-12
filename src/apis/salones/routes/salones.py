from flask import Blueprint, jsonify, request
import uuid
from ..routes.salones import Salon
from ..routes.salones import SalonModel

main = Blueprint('salon_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_salones():
    try:
        salones = SalonModel.get_salones()
        return jsonify(salones), 200
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500

@main.route('/<id_salon>', methods=['GET'])
def get_salon(id_salon):
    try:
        salon = SalonModel.get_salon(id_salon)
        if salon:
            return jsonify(salon), 200
        else:
            return jsonify({'error': 'Salón no encontrado'}), 404
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_salon():
    try:
        data = request.get_json()
        
        # Validar campos requeridos
        required_fields = ['nombre', 'capacidad', 'ubicacion']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'error': f'Faltan campos obligatorios: {", ".join(missing_fields)}'
            }), 400
        
        # Validar que capacidad sea número positivo
        try:
            capacidad = int(data['capacidad'])
            if capacidad <= 0:
                raise ValueError
        except (ValueError, TypeError):
            return jsonify({
                'error': 'La capacidad debe ser un número entero positivo'
            }), 400
        
        # Generar ID único
        salon_id = str(uuid.uuid4())
        
        # Crear objeto Salon
        salon = Salon(
            id_salon=salon_id,
            nombre=data['nombre'],
            capacidad=capacidad,
            ubicacion=data['ubicacion'],
            observaciones=data.get('observaciones')
        )
        
        # Insertar en la base de datos
        affected_rows = SalonModel.add_salon(salon)
        
        if affected_rows == 1:
            return jsonify({
                'message': 'Salón agregado correctamente',
                'id_salon': salon_id
            }), 201
        else:
            return jsonify({'error': 'No se pudo agregar el salón'}), 500
            
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500

@main.route('/update/<id_salon>', methods=['PUT'])
def update_salon(id_salon):
    try:
        data = request.get_json()
        
        # Verificar si el salón existe
        existing_salon = SalonModel.get_salon(id_salon)
        if not existing_salon:
            return jsonify({'error': 'Salón no encontrado'}), 404
        
        # Validar campos requeridos
        required_fields = ['nombre', 'capacidad', 'ubicacion']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'error': f'Faltan campos obligatorios: {", ".join(missing_fields)}'
            }), 400
        
        # Validar que capacidad sea número positivo
        try:
            capacidad = int(data['capacidad'])
            if capacidad <= 0:
                raise ValueError
        except (ValueError, TypeError):
            return jsonify({
                'error': 'La capacidad debe ser un número entero positivo'
            }), 400
        
        # Crear objeto Salon actualizado
        salon = Salon(
            id_salon=id_salon,
            nombre=data['nombre'],
            capacidad=capacidad,
            ubicacion=data['ubicacion'],
            observaciones=data.get('observaciones', existing_salon.get('observaciones'))
        )
        
        # Actualizar en la base de datos
        affected_rows = SalonModel.update_salon(salon)
        
        if affected_rows == 1:
            return jsonify({'message': 'Salón actualizado correctamente'}), 200
        else:
            return jsonify({'error': 'No se pudo actualizar el salón'}), 500
            
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500

@main.route('/delete/<id_salon>', methods=['DELETE'])
def delete_salon(id_salon):
    try:
        # Verificar si el salón existe
        existing_salon = SalonModel.get_salon(id_salon)
        if not existing_salon:
            return jsonify({'error': 'Salón no encontrado'}), 404
        
        # Crear objeto Salon solo con ID para eliminación
        salon = Salon(
            id_salon=id_salon,
            nombre='',
            capacidad=0,
            ubicacion=''
        )
        
        # Eliminar de la base de datos
        affected_rows = SalonModel.delete_salon(salon)
        
        if affected_rows == 1:
            return jsonify({'message': 'Salón eliminado correctamente'}), 200
        else:
            return jsonify({'error': 'No se pudo eliminar el salón'}), 500
            
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500