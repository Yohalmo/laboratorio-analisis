from flask import Blueprint, jsonify, request
import uuid
from datetime import datetime

from ..models.entities.Notificacion import Notificacion
from ..models.NotificacionModel import NotificacionModel
from ...telefonos.models.TelefonoModel import TelefonoModel
from ..services.servicesTwilio import send_whatsapp_message
from ...alumnos.models.AlumnoModel import AlumnoModel

main = Blueprint('notificaciones_blueprint', __name__)

@main.route('/', methods=['GET'])
def get_notificaciones():
    try:
        notificaciones = NotificacionModel.get_all()
        return jsonify(notificaciones), 200
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500
    

@main.route('/<id>', methods=['GET'])
def get_notificacion_by_id(id):
    try:
        notificacion = NotificacionModel.get_notificacion_by_id(id)
        if notificacion:
            return jsonify(notificacion), 200
        else:
            return jsonify({"error": "Notificación no encontrada"}), 404
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500

    
@main.route('/send-message', methods=['POST'])
def add_notificacion():
    try:
        data = request.get_json()
        required_fields = ['id_alumno', 'fecha_envio', 'estado']
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "error": "Faltan campos obligatorios: " + ", ".join(missing_fields)
            }), 400

        id_alumno = data.get('id_alumno')
        fecha_envio_str = data.get('fecha_envio')
        estado = data.get('estado')

        try:
            fecha_envio = datetime.strptime(fecha_envio_str, "%Y-%m-%d")
        except Exception:
            return jsonify({
                "error": "Formato de fecha_envio inválido, se requiere YYYY-MM-DD"
            }), 400

        notificacion_id = str(uuid.uuid4())

        notificacion = Notificacion(
            id=notificacion_id,
            id_alumno=id_alumno,
            fecha_envio=fecha_envio,
            estado=estado
        )

        affected_rows = NotificacionModel.add_notificacion(notificacion)
        if affected_rows != 1:
            return jsonify({"error": "No se pudo agregar la notificación"}), 500

        alumno_data = AlumnoModel.get_by_id(id_alumno)

        if alumno_data:
            message_body = (
                "Notificación para el alumno:\n" +
                "Nombre: " + alumno_data.get("nombres", "N/A") + " " +
                alumno_data.get("apellidos", "") + "\n" +
                "Correo: " + alumno_data.get("email", "N/A") + "\n" +
                "Telefono: " + alumno_data.get("telefono", "N/A") + "\n" +
                "Fecha envío: " + fecha_envio_str + "\n" +
                "Estado: " + estado
            )
        else:
            message_body = "No se encontraron datos del cliente para esta notificación."

        telefonos = TelefonoModel.get_all()
        send_results = {}

        for tel in telefonos:
            numero = str(tel.get("numero_telefono", "")).strip()
            if not numero:
                send_results["Número no definido"] = {
                    "status": "Error",
                    "error": "Número de teléfono vacío"
                }
                continue

            if not numero.startswith('+'):
                phone_number = "+503" + numero
            else:
                phone_number = numero

            try:
                sid = send_whatsapp_message(phone_number, message_body)
                send_results[phone_number] = {"status": "Enviado", "sid": sid}
            except Exception as e:
                send_results[phone_number] = {"status": "Error", "error": str(e)}

        return jsonify({
            "id_notificacion": notificacion.id,
            "message": "Notificación agregada y mensajes enviados",
            "send_results": send_results
        }), 200
    except Exception as ex:
        return jsonify({"error": str(ex)}), 500