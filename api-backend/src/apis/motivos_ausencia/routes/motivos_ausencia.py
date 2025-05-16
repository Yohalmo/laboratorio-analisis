# NOMBRE: YEIMI SUCELY GARCIA ALDANA
from flask import Blueprint, jsonify, request
import uuid
from ..models.motivos_ausenciaModels import MotivoAusenciaModel
from ..models.entities.motivos_ausencia import MotivoAusencia

main = Blueprint('motivos_ausencia_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_motivoS():
    try:
        motivo = MotivoAusenciaModel.get_all_motivos()
        if motivo:
            return jsonify(motivo)
        else:
            return jsonify({"error": "Motivo no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/<id>', methods=['GET'])
def get_motivo_by_id(id):
    try:
        motivo = MotivoAusenciaModel.get_motivo_by_id(id)
        if motivo:
            return jsonify(motivo)
        else:
            return jsonify({"error": "Motivo no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/add', methods=['POST'])
def add_motivo():
    try:
        data = request.get_json()
        if 'descripcion' not in data:
            return jsonify({"error": "El campo 'descripcion' es obligatorio"}), 400

        motivo_id = str(uuid.uuid4())
        motivo = MotivoAusencia(
            id_motivo=motivo_id,
            descripcion=data.get('descripcion')
        )
        MotivoAusenciaModel.add_motivo(motivo)

        return jsonify({"message": "Motivo agregado", "id": motivo_id}), 201

    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/update/<id>', methods=['PUT'])
def update_motivo(id): 
    try:
        data = request.get_json()
        existing_motivo = MotivoAusenciaModel.get_motivo_by_id(id)
        if not existing_motivo:
            return jsonify({"error": "Motivo no encontrado"}), 404
        
        if 'descripcion' not in data:
            return jsonify({"error": "El campo 'descripcion' es obligatorio"}), 400
        
        motivo = MotivoAusencia(
            id_motivo=id,
            descripcion=data.get('descripcion')
        )
        affected_rows = MotivoAusenciaModel.update_motivo(motivo)
        if affected_rows == 1:
            return jsonify({"message": "Motivo actualizado correctamente"}), 200
        else:
            return jsonify({"error": "No se pudo actualizar"}), 400
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

@main.route('/delete/<id>', methods=['DELETE'])
def delete_motivo(id):
    try:
        motivo = MotivoAusencia(
            id_motivo=id,
            descripcion=""
        )
        affected_rows = MotivoAusenciaModel.delete_motivo(motivo)
        if affected_rows == 1:
            return jsonify({"message": f"Motivo {id} eliminado"}), 200
        else:
            return jsonify({"error": "Motivo no encontrado"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
