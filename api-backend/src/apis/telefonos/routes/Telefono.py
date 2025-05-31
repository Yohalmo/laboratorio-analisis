from flask import Blueprint, jsonify, request
import uuid
from ..models.TelefonoModel import TelefonoModel
from ..models.entities.Telefono import Telefono
from datetime import datetime

main = Blueprint('telefono_blueprint', __name__)

@main.route("/", methods=['GET'])
def get_telefonos():
    try:
        telefonos = TelefonoModel.get_all()
        
        if telefonos:
            return jsonify(telefonos), 200
        return jsonify({"message" : "No se encontraron telefonos registrados"}), 200
    except Exception as ex:
        return jsonify({'error' : str(ex)}), 500
    

@main.route("/<id>", methods=['GET'])
def get_telefono_by_id(id):
    try:
        telefono = TelefonoModel.get_by_id(id)
        
        if telefono:
            return jsonify(telefono), 200
        return jsonify({'message' : "Telefono no encontrada"}), 200

    except Exception as ex:
        return jsonify({'error' : ex}), 500
    
    
@main.route("/add", methods=['POST'])
def add_telefono():
    try:
        data = request.get_json()

        required_fields = ['nombre', 'numero_telefono', 'fecha_creacion', 'codigo_pais']
        
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({'error': f"Faltan campos obligatorios {','.join(missing_fields)}"}), 400

        fecha_str = data.get('fecha_creacion', datetime.now().strftime('%d/%m/%Y'))
        fecha_obj = datetime.strptime(fecha_str, '%d/%m/%Y') 

        telefono = Telefono(
            id_telefono=str(uuid.uuid4()),
            fecha_creacion=fecha_obj,
            nombre=data.get('nombre'),
            numero_telefono=data.get('numero_telefono'),
            codigo_pais=data.get('codigo_pais'),
        )

        saved = TelefonoModel.add_telefono(telefono)
        
        if saved == 1:
            return jsonify({"message": "Telefono agregado", 'id' : telefono.id_telefono}), 201
        return jsonify({'message' : "Ocurrio un problema al guardar el registro"}), 200

    except Exception as ex:
        return jsonify({'error' : ex}), 500
    
@main.route("/update", methods=['PUT'])
def update_telefono():
    try:
        data = request.get_json()
        existing = TelefonoModel.get_by_id(data.get('id_telefono'))

        if not existing:
            return jsonify({"error" : "Telefono no encontrado"}), 404

        required_fields = ['id_telefono', 'nombre', 'numero_telefono', 'fecha_creacion']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return jsonify({'error': f"Faltan campos obligatorios {','.join(missing_fields)}"}), 400

        fecha_str = data.get('fecha_creacion', datetime.now().strftime('%d/%m/%Y'))
        fecha_obj = datetime.strptime(fecha_str, '%d/%m/%Y') 

        telefono = Telefono(
            id_telefono=data.get('id_telefono'),
            fecha_creacion=fecha_obj,
            nombre=data.get('nombre'),
            numero_telefono=data.get('numero_telefono'),
            codigo_pais=data.get('codigo_pais')
        )

        saved = TelefonoModel.update_telefono(telefono)
        
        if saved == 1:
            return jsonify({"message": "Telefono actualizado correctamente"}), 200
        return jsonify({'message' : "Ocurrio un problema al actualizar el registro"}), 200
    except Exception as ex:
        return jsonify({'error' : ex}), 500
    
    
@main.route("/delete/<id>", methods=['DELETE'])
def delete_Telefono(id):
    try:
        eliminado = TelefonoModel.delete_telefono(id)
        
        if eliminado == 1:
            return jsonify({ "message" : f"Telefono {id} eliminada" }), 200
        return jsonify({'message' : "Telefono no encontrado"}), 200

    except Exception as ex:
        return jsonify({'error' : ex}), 500
