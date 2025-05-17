from flask import Blueprint, jsonify, request
import uuid
from ..models.AlumnoModel import AlumnoModel
from ..models.entities.Alumno import Alumno
from datetime import datetime

main = Blueprint('alumno_blueprint', __name__)

@main.route("/", methods=['GET'])
def get_alumnos():
    try:
        limit = request.args.get('limit', default=0, type=int)
        alumnos = AlumnoModel.get_all(limit)
        
        if alumnos:
            return jsonify(alumnos), 200
        return jsonify({"message" : "No se encontraron alumnos registrados"}), 200
    except Exception as ex:
        return jsonify({'error' : str(ex)}), 500
    
@main.route("/<id>", methods=['GET'])
def get_alumno_by_id(id):
    try:
        alumno = AlumnoModel.get_by_id(id)
        
        if alumno:
            return jsonify(alumno), 200
        return jsonify({'message' : "Alumno no encontrado"}), 200

    except Exception as ex:
        return jsonify({'error' : ex}), 500
    
    
@main.route("/add", methods=['POST'])
def add_alumno():
    try:
        data = request.get_json()

        required_fields = ['nombres', 'apellidos', 'fecha_nacimiento', 'direccion', 'telefono', 'email']
        
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({'error': f"Faltan campos obligatorios {','.join(missing_fields)}"}), 400

        fecha_str = data.get('fecha_nacimiento', datetime.now().strftime('%d/%m/%Y'))
        fecha_obj = datetime.strptime(fecha_str, '%d/%m/%Y') 

        alumno = Alumno(
            _id_alumno=str(uuid.uuid4()),
            _nombres=data.get('nombres'),
            _apellidos=data.get('apellidos'),
            _fecha_nacimiento=fecha_obj,
            _direccion=data.get('direccion'),
            _telefono=data.get('telefono'),
            _email=data.get('email')
        )

        saved = AlumnoModel.add_alumno(alumno)
        
        if saved == 1:
            return jsonify({"message": "Alumno agregado", 'id' : alumno.id_alumno}), 201
        return jsonify({'message' : "Ocurrio un problema al guardar el registro"}), 200

    except Exception as ex:
        return jsonify({'error' : ex}), 500
    
@main.route("/update", methods=['PUT'])
def update_alumno():
    try:
        data = request.get_json()
        existing = AlumnoModel.get_by_id(data.get('id_alumno'))

        if not existing:
            return jsonify({"error" : "Alumno no encontrado"}), 404

        required_fields = ['nombres', 'apellidos', 'fecha_nacimiento', 'direccion', 'telefono', 'email', 'id_alumno']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({'error': f"Faltan campos obligatorios {','.join(missing_fields)}"}), 400

        fecha_str = data.get('fecha_nacimiento', datetime.now().strftime('%d/%m/%Y'))
        fecha_obj = datetime.strptime(fecha_str, '%d/%m/%Y') 

        alumno = Alumno(
            _id_alumno=data.get('id_alumno'),
            _nombres=data.get('nombres'),
            _apellidos=data.get('apellidos'),
            _fecha_nacimiento=fecha_obj,
            _direccion=data.get('direccion'),
            _telefono=data.get('telefono'),
            _email=data.get('email')
        )

        saved = AlumnoModel.update_alumno(alumno)
        
        if saved == 1:
            return jsonify({"message": "Alumno actualizado correctamente"}), 200
        return jsonify({'message' : "Ocurrio un problema al actualizar el registro"}), 200
    except Exception as ex:
        return jsonify({'error' : ex}), 500
    
@main.route("/delete/<id>", methods=['DELETE'])
def delete_alumno(id):
    try:
        eliminado = AlumnoModel.delete_alumno(id)
        
        if eliminado == 1:
            return jsonify({ "message" : f"Alumno {id} eliminado" }), 200
        return jsonify({'message' : "Alumno no encontrado"}), 200

    except Exception as ex:
        return jsonify({'error' : ex}), 500

@main.route("/count", methods=['GET'])
def count_alumnos():
    try:
        count = AlumnoModel.count_alumnos()
        return jsonify({'count' : count}), 200
    except Exception as ex:
        return jsonify({'error' : ex}), 500
