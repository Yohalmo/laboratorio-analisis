from flask import Blueprint, jsonify, request
import uuid
from ..models.materiasModels import MateriasModel
from ..models.entities.materias import Materias 

main = Blueprint('materias_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_materiaS():
    try:
        materia = MateriasModel.get_all_materias()
        if materia:
            return jsonify(materia)
        else:
            return jsonify({"error": "Materia no encontrada"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/<id>', methods=['GET'])
def get_materia_by_id(id):
    try:
        materia = MateriasModel.get_materia_by_id(id)
        if materia:
            return jsonify(materia)
        else:
            return jsonify({"error": "Materia no encontrada"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_materia():
    try:
        data = request.get_json()
        required_fields = ['nombre', 'descripcion']
        missing_fields = [field for field in required_fields if field not in data]
        
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        materia_id = str(uuid.uuid4())
        materia = Materias(
            id_materia=materia_id,
            nombre=data.get('nombre'),
            descripcion=data.get('descripcion')
        )
        MateriasModel.add_materia(materia)

        return jsonify({"message": "Materia agregada", "id": materia_id}), 201

    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/update/<id>', methods=['PUT'])
def update_materia(id):
    try:
        data = request.get_json()
        existing_materia = MateriasModel.get_materia_by_id(id)
        if not existing_materia:
            return jsonify({"error": "Materia no encontrada"}), 404

        required_fields = ['nombre', 'descripcion']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({"error": f"Faltan campos obligatorios: {', '.join(missing_fields)}"}), 400

        materia = Materias(
            id_materia=id,
            nombre=data.get('nombre'),
            descripcion=data.get('descripcion')
        )
        affected_rows = MateriasModel.update_materia(materia)
        if affected_rows == 1:
            return jsonify({"message": "Materia actualizada correctamente"}), 200
        else:
            return jsonify({"error": "No se pudo actualizar"}), 400
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/delete/<id>', methods=['DELETE'])
def delete_materia(id):
    try:
        materia = Materias(
            id_materia=id,
            nombre="",
            descripcion=""
        )
        affected_rows = MateriasModel.delete_materia(materia)
        if affected_rows == 1:
            return jsonify({"message": f"Materia {id} eliminada"}), 200
        else:
            return jsonify({"error": "Materia no encontrada"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
