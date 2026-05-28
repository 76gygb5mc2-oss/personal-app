from app import create_app, db
import os
import logging

logger = logging.getLogger(__name__)

app = create_app()

# Initialize database tables on startup
try:
    with app.app_context():
        db.create_all()
except Exception as e:
    logger.warning(f"Could not initialize database: {e}")

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
