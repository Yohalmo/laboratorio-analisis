from flask import Blueprint, jsonify, request
import uuid
from ..models.ReporteModel import ReporteModel
from ..models.entities.Reporte import Reporte
from datetime import datetime

main = Blueprint('reporte_blueprint', __name__)

@main.route("/", methods=['GET'])
def get_reportes():
    try:
        reportes = ReporteModel.get_all()
        
        if reportes:
            return jsonify(reportes), 200
        return jsonify({"message" : "No se encontraron reportes registrados"}), 200
    except Exception as ex:
        return jsonify({'error' : str(ex)}), 500
    

@main.route("/<id>", methods=['GET'])
def get_reporte_by_id(id):
    try:
        reporte = ReporteModel.get_by_id(id)
        
        if reporte:
            return jsonify(reporte), 200
        return jsonify({'message' : "Reporte no encontrado"}), 200

    except Exception as ex:
        return jsonify({'error' : ex}), 500
    
    
@main.route("/add", methods=['POST'])
def add_reporte():
    try:
        data = request.get_json()

        required_fields = ['fecha', 'observaciones', 'id_alumno', 'id_periodo']
        
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({'error': f"Faltan campos obligatorios {','.join(missing_fields)}"}), 400

        fecha_str = data.get('fecha', datetime.now().strftime('%d/%m/%Y'))
        fecha_obj = datetime.strptime(fecha_str, '%d/%m/%Y') 

        reporte = Reporte(
            id_reporte=str(uuid.uuid4()),
            fecha=fecha_obj,
            observaciones=data.get('observaciones'),
            id_alumno=data.get('id_alumno'),
            id_periodo=data.get('id_periodo')
        )

        saved = ReporteModel.add_reporte(reporte)
        
        if saved == 1:
            return jsonify({"message": "Reporte agregado", 'id' : reporte.id_reporte}), 201
        return jsonify({'message' : "Ocurrio un problema al guardar el registro"}), 200

    except Exception as ex:
        return jsonify({'error' : ex}), 500
    
@main.route("/update", methods=['PUT'])
def update_reporte():
    try:
        data = request.get_json()
        existing = ReporteModel.get_by_id(data.get('id_reporte'))

        if not existing:
            return jsonify({"error" : "Reporte no encontrado"}), 404

        required_fields = ['fecha', 'observaciones', 'id_alumno', 'id_periodo', 'id_reporte']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({'error': f"Faltan campos obligatorios {','.join(missing_fields)}"}), 400

        fecha_str = data.get('fecha', datetime.now().strftime('%d/%m/%Y'))
        fecha_obj = datetime.strptime(fecha_str, '%d/%m/%Y') 

        reporte = Reporte(
            id_reporte=data.get('id_reporte'),
            fecha=fecha_obj,
            observaciones=data.get('observaciones'),
            id_alumno=data.get('id_alumno'),
            id_periodo=data.get('id_periodo')
        )

        saved = ReporteModel.update_reporte(reporte)
        
        if saved == 1:
            return jsonify({"message": "Reporte actualizado correctamente"}), 200
        return jsonify({'message' : "Ocurrio un problema al actualizar el registro"}), 200
    except Exception as ex:
        return jsonify({'error' : ex}), 500
    
    

@main.route("/delete/<id>", methods=['DELETE'])
def delete_Reporte(id):
    try:
        eliminado = ReporteModel.delete_reporte(id)
        
        if eliminado == 1:
            return jsonify({ "message" : f"Reporte {id} eliminado" }), 200
        return jsonify({'message' : "Reporte no encontrado"}), 200

    except Exception as ex:
        return jsonify({'error' : ex}), 500
