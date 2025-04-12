from flask import Flask
from flask_cors import CORS
from config.config import app_config

app = Flask(__name__)
CORS(app)

from apis.cursos.routes import Cursos
from apis.materias.routes import Materias
from apis.motivos_ausencia.routes import Motivos_Ausencia

if __name__ == "__main__":
    app.config.from_object(app_config['development'])
    app.register_blueprint(Cursos.main, url_prefix="/api/cursos")
    app.register_blueprint(Materias.main, url_prefix="/api/materias")
    app.register_blueprint(Motivos_Ausencia.main, url_prefix="/api/motivos_ausencia")
    app.run(host="0.0.0.0", port="5000", debug=True)