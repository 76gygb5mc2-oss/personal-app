from dotenv import load_dotenv
import os
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from config import config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
limiter = Limiter(key_func=get_remote_address, default_limits=["200 per day", "50 per hour"])

def create_app(config_name=None):
    """Application factory pattern"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'production')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    cors_origins = [
        os.getenv('FRONTEND_URL', 'http://localhost:3000'),
        'http://localhost:3000',
        'http://localhost:3001',
    ]
    CORS(app, origins=cors_origins)
    jwt.init_app(app)
    limiter.init_app(app)

    # Register blueprints
    from app.routes import auth, dashboard, business, financial, communication, mindset, relationships, learning, health, checkin, reports, ai_advisor

    app.register_blueprint(auth.bp)
    app.register_blueprint(dashboard.bp)
    app.register_blueprint(business.bp)
    app.register_blueprint(financial.bp)
    app.register_blueprint(communication.bp)
    app.register_blueprint(mindset.bp)
    app.register_blueprint(relationships.bp)
    app.register_blueprint(learning.bp)
    app.register_blueprint(health.bp)
    app.register_blueprint(checkin.bp)
    app.register_blueprint(reports.bp)
    app.register_blueprint(ai_advisor.bp)

    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200

    return app
