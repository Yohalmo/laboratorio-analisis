# NOMBRE: YEIMI SUCELY GARCIA ALDANA

from flask import Blueprint, jsonify, request
import uuid
from ..models.cursosModels import cursosModel
from ..models.entities.cursos import Curso
from datetime import datetime

main = Blueprint('cursos_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_cursos():
    try:
        curso = cursosModel.get_all_cursos()
        if curso:
            return jsonify(curso)
        else:
            return jsonify({"error": "No se encontraron registros"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/<id>', methods=['GET'])
def get_cursos_by_id(id):
    try:
        curso = cursosModel.get_cursos_by_id(id)
        if curso:
            return jsonify(curso)
        else:
            return jsonify({"error": "curso no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_cursos():
    try:
        data = request.get_json()
        required_fields = ['nombre', 'descripcion', 'estado', 'id_periodo']
        missing_fields = [field for field in required_fields if field not in data]            
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        curso_id = str(uuid.uuid4())
        estado =  'ACTIVO' if data.get('estado') else 'INACTIVO'
        curso = Curso(
            id_curso=curso_id,
            nombre=data.get('nombre'),
            descripcion=data.get('descripcion'),
            estado=estado,
            id_periodo=data.get('id_periodo'),
        )
        cursosModel.add_curso(curso)

        return jsonify({"message": "curso agregado", "id": curso_id}), 201

    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/update/<id>', methods=['PUT'])
def update_cursos(id): 
    try:
        data = request.get_json()
        existing_curso = cursosModel.get_cursos_by_id(id)
        if not existing_curso:
            return jsonify({"error": "curso no encontrado"}), 404
        
        required_fields = ['nombre', 'descripcion', 'estado', 'id_periodo']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400
        
        estado =  'ACTIVO' if data.get('estado') else 'INACTIVO'

        curso = Curso(
            id_curso=id,
            nombre=data.get('nombre'),
            descripcion=data.get('descripcion'),
            estado=estado,
            id_periodo=data.get('id_periodo'),
        )
        affected_rows = cursosModel.update_curso(curso)
        if affected_rows == 1:
            return jsonify({"message": "curso actualizado correctamente"}), 200
        else:
            return jsonify({"error": "No se pudo actualizar"}), 400
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/delete/<id>', methods=['DELETE'])
def delete_curso(id):
    try:
        curso = Curso(
            id_curso=id,
            nombre="", 
            descripcion="",
            estado="",
            id_periodo=""
        )
        affected_rows = cursosModel.delete_curso(curso)
        if affected_rows == 1:
            return jsonify({"message": f"curso {id} eliminado"}), 200
        else:
            return jsonify({"error": "curso no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
