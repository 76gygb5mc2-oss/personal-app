import os
from datetime import timedelta

class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

    database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:***@localhost:5432/sirawdink_os')
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    # CORS
    CORS_ORIGINS = os.getenv('FRONTEND_URL', 'http://localhost:3000')

    # OpenAI
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')

    # Timezone
    TIMEZONE = os.getenv('TZ', 'America/Los_Angeles')

    # Pagination
    ITEMS_PER_PAGE = 20

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
