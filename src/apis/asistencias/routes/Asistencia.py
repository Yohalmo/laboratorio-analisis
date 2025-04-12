from flask import Blueprint, jsonify, request
import uuid
from ..models.AsistenciaModel import AsistenciaModel
from ..models.entities.Asistencia import Asistencia
from datetime import datetime

main = Blueprint('asistencia_blueprint', __name__)

@main.route("/", methods=['GET'])
def get_asistencias():
    try:
        asistencias = AsistenciaModel.get_all()
        
        if asistencias:
            return jsonify(asistencias), 200
        return jsonify({"message" : "No se encontraron asistencias registradas"}), 200
    except Exception as ex:
        return jsonify({'error' : str(ex)}), 500
    

@main.route("/<id>", methods=['GET'])
def get_asistencia_by_id(id):
    try:
        asistencia = AsistenciaModel.get_by_id(id)
        
        if asistencia:
            return jsonify(asistencia), 200
        return jsonify({'message' : "Asistencia no encontrada"}), 200

    except Exception as ex:
        return jsonify({'error' : ex}), 500
    
    
@main.route("/add", methods=['POST'])
def add_asistencia():
    try:
        data = request.get_json()

        required_fields = ['fecha', 'estado', 'id_alumno', 'id_materia', 'id_motivo']
        
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({'error': f"Faltan campos obligatorios {','.join(missing_fields)}"}), 400

        fecha_str = data.get('fecha', datetime.now().strftime('%d/%m/%Y'))
        fecha_obj = datetime.strptime(fecha_str, '%d/%m/%Y') 

        asistencia = Asistencia(
            id_asistencia=str(uuid.uuid4()),
            fecha=fecha_obj,
            estado=data.get('estado'),
            id_alumno=data.get('id_alumno'),
            id_materia=data.get('id_materia'),
            id_motivo=data.get('id_motivo')
        )

        saved = AsistenciaModel.add_asistencia(asistencia)
        
        if saved == 1:
            return jsonify({"message": "Asistencia agregada", 'id' : asistencia.id_asistencia}), 201
        return jsonify({'message' : "Ocurrio un problema al guardar el registro"}), 200

    except Exception as ex:
        return jsonify({'error' : ex}), 500
    
@main.route("/update", methods=['PUT'])
def update_asistencia():
    try:
        data = request.get_json()
        existing = AsistenciaModel.get_by_id(data.get('id_asistencia'))

        if not existing:
            return jsonify({"error" : "Asistencia no encontrada"}), 404

        required_fields = ['fecha', 'estado', 'id_alumno', 'id_materia', 'id_motivo', 'id_asistencia']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({'error': f"Faltan campos obligatorios {','.join(missing_fields)}"}), 400

        fecha_str = data.get('fecha', datetime.now().strftime('%d/%m/%Y'))
        fecha_obj = datetime.strptime(fecha_str, '%d/%m/%Y') 

        asistencia = Asistencia(
            id_asistencia=data.get('id_asistencia'),
            fecha=fecha_obj,
            estado=data.get('estado'),
            id_alumno=data.get('id_alumno'),
            id_materia=data.get('id_materia'),
            id_motivo=data.get('id_motivo')
        )

        saved = AsistenciaModel.update_asistencia(asistencia)
        
        if saved == 1:
            return jsonify({"message": "Asistencia actualizada correctamente"}), 200
        return jsonify({'message' : "Ocurrio un problema al actualizar el registro"}), 200
    except Exception as ex:
        return jsonify({'error' : ex}), 500
    
    

@main.route("/delete/<id>", methods=['DELETE'])
def delete_Asistencia(id):
    try:
        eliminado = AsistenciaModel.delete_asistencia(id)
        
        if eliminado == 1:
            return jsonify({ "message" : f"Asistencia {id} eliminada" }), 200
        return jsonify({'message' : "Asistencia no encontrada"}), 200

    except Exception as ex:
        return jsonify({'error' : ex}), 500
