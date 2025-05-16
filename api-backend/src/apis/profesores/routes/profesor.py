from flask import Blueprint, jsonify, request
import uuid
from ..models.entities import Profesor
from ..models.profesoresmodelos import ProfesorModel

main = Blueprint('profesor_blueprint',__name__)

@main.route('/', methods=['GET'])
def get_profesores():
    try:
        profesores = ProfesorModel.get_profesores()
        return jsonify(profesores), 200
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500

@main.route('/<id_profesor>', methods=['GET'])
def get_profesor(id_profesor):
    try:
        profesor = ProfesorModel.get_profesor(id_profesor)
        if profesor:
            return jsonify(profesor), 200
        else:
            return jsonify({'error': 'Profesor no encontrado'}), 404
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_profesor():
    try:
        data = request.get_json()
        
        # Validar campos requeridos
        required_fields = ['nombre', 'apellido', 'especialidad', 'telefono', 'documento_identidad']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'error': f'Faltan campos obligatorios: {", ".join(missing_fields)}'
            }), 400
        
        # Generar ID único
        profesor_id = str(uuid.uuid4())
        
        # Crear objeto Profesor
        profesor = Profesor(
            id_profesor=profesor_id,
            nombre=data['nombre'],
            apellido=data['apellido'],
            especialidad=data['especialidad'],
            telefono=data['telefono'],
            email=data.get('email'),
            documento_identidad=data['documento_identidad']
        )
        
        # Insertar en la base de datos
        affected_rows = ProfesorModel.add_profesor(profesor)
        
        if affected_rows == 1:
            return jsonify({
                'message': 'Profesor agregado correctamente',
                'id_profesor': profesor_id
            }), 201
        else:
            return jsonify({'error': 'No se pudo agregar el profesor'}), 500
            
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500

@main.route('/update/<id_profesor>', methods=['PUT'])
def update_profesor(id_profesor):
    try:
        data = request.get_json()
        
        # Verificar si el profesor existe
        existing_profesor = ProfesorModel.get_profesor(id_profesor)
        if not existing_profesor:
            return jsonify({'error': 'Profesor no encontrado'}), 404
        
        # Validar campos requeridos
        required_fields = ['nombre', 'apellido', 'especialidad', 'telefono', 'documento_identidad']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                'error': f'Faltan campos obligatorios: {", ".join(missing_fields)}'
            }), 400
        
        # Crear objeto Profesor actualizado
        profesor = Profesor(
            id_profesor=id_profesor,
            nombre=data['nombre'],
            apellido=data['apellido'],
            especialidad=data['especialidad'],
            telefono=data['telefono'],
            email=data.get('email', existing_profesor.get('email')),
            documento_identidad=data['documento_identidad']
        )
        
        # Actualizar en la base de datos
        affected_rows = ProfesorModel.update_profesor(profesor)
        
        if affected_rows == 1:
            return jsonify({'message': 'Profesor actualizado correctamente'}), 200
        else:
            return jsonify({'error': 'No se pudo actualizar el profesor'}), 500
            
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500

@main.route('/delete/<id_profesor>', methods=['DELETE'])
def delete_profesor(id_profesor):
    try:
        # Verificar si el profesor existe
        existing_profesor = ProfesorModel.get_profesor(id_profesor)
        if not existing_profesor:
            return jsonify({'error': 'Profesor no encontrado'}), 404
        
        # Crear objeto Profesor solo con ID para eliminación
        profesor = Profesor(
            id_profesor=id_profesor,
            nombre='', apellido='', especialidad='',
            telefono='', email='', documento_identidad=''
        )
        
        # Eliminar de la base de datos
        affected_rows = ProfesorModel.delete_profesor(profesor)
        
        if affected_rows == 1:
            return jsonify({'message': 'Profesor eliminado correctamente'}), 200
        else:
            return jsonify({'error': 'No se pudo eliminar el profesor'}), 500
            
    except Exception as ex:
        return jsonify({'error': str(ex)}), 500