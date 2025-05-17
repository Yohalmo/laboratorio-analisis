from flask import Flask
from flask_cors import CORS
from config.config import app_config

app = Flask(__name__)
CORS(app)

from apis.alumnos.routes import Alumno
from apis.dashboard.routes import Dashboard
from apis.asistencias.routes import Asistencia
from apis.reportes.routes import Reporte
from apis.notificaciones.routes import Notificacion
from apis.telefonos.routes import Telefono
from apis.periodos.routes import periodo
from apis.profesores.routes import profesor
from apis.salones.routes import salones
from apis.cursos.routes import cursos
from apis.materias.routes import materias
from apis.motivos_ausencia.routes import motivos_ausencia

if __name__ == "__main__":
    app.config.from_object(app_config['development'])
    app.register_blueprint(Alumno.main, url_prefix="/api/alumnos")
    app.register_blueprint(Asistencia.main, url_prefix="/api/asistencias")
    app.register_blueprint(Reporte.main, url_prefix="/api/reportes")
    app.register_blueprint(Notificacion.main, url_prefix="/api/notificaciones")
    app.register_blueprint(Telefono.main, url_prefix="/api/telefonos")

    app.register_blueprint(periodo.main, url_prefix="/api/periodos")
    app.register_blueprint(profesor.main, url_prefix="/api/profesores")
    app.register_blueprint(salones.main, url_prefix="/api/salones")

    app.register_blueprint(cursos.main, url_prefix="/api/cursos")
    app.register_blueprint(materias.main, url_prefix="/api/materias")
    app.register_blueprint(Dashboard.main, url_prefix="/api/dashboard")
    app.register_blueprint(motivos_ausencia.main, url_prefix="/api/motivos_ausencia")
    app.run(host="0.0.0.0", port="5000", debug=True)