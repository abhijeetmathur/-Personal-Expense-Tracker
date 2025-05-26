from flask import Flask, send_from_directory
from flask_cors import CORS
from config import DB_URI
from db import db

def create_app():
    app = Flask(__name__, static_folder='../frontend/static', template_folder='../frontend')
    app.config['SQLALCHEMY_DATABASE_URI'] = DB_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    CORS(app)

    with app.app_context():
        from routes import register_routes
        register_routes(app)

    @app.route("/")
    def index():
        return send_from_directory(app.template_folder, 'index.html')

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
