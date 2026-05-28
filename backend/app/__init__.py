from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_name=None):
    """Application factory pattern"""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')
    
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=app.config['CORS_ORIGINS'])
    jwt.init_app(app)
    
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
