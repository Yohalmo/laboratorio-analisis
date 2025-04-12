from flask import Flask
from flask_cors import CORS
from config.config import app_config

app = Flask(__name__)
CORS(app)

from apis.periodos.routes.periodo import main as periodo_blueprint
from apis.profesores.routes import profesor
from apis.salones import salon 


if __name__ == "__main__":
    app.config.from_object(app_config['development'])
    app.register_blueprint(periodo.main, url_prefix="/api/periodos")
    app.register_blueprint(profesor.main, url_prefix="/api/profesores")
    app.register_blueprint(salon, url_prefix="/api/salones")
    app.run(host="0.0.0.0", port="5000", debug=True)