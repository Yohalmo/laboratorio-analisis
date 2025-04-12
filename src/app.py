from flask import Flask
from flask_cors import CORS
from config.config import app_config

app = Flask(__name__)
CORS(app)

from apis.alumnos.routes import Alumno
from apis.asistencias.routes import Asistencia
from apis.reportes.routes import Reporte

if __name__ == "__main__":
    app.config.from_object(app_config['development'])
    app.register_blueprint(Alumno.main, url_prefix="/api/alumnos")
    app.register_blueprint(Asistencia.main, url_prefix="/api/asistencias")
    app.register_blueprint(Reporte.main, url_prefix="/api/reportes")
    app.run(host="0.0.0.0", port="5000", debug=True)