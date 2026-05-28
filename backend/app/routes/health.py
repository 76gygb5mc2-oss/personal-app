from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import HealthMetric
from datetime import datetime

bp = Blueprint('health', __name__, url_prefix='/api/health')

@bp.route('/metrics', methods=['GET', 'POST'])
@jwt_required()
def metrics():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        metrics = HealthMetric.query.filter_by(user_id=user_id).order_by(HealthMetric.date.desc()).all()
        return jsonify([m.to_dict() for m in metrics]), 200
    else:
        data = request.get_json()
        metric = HealthMetric(user_id=user_id, **{k: v for k, v in data.items() if k != 'id'})
        db.session.add(metric)
        db.session.commit()
        return jsonify(metric.to_dict()), 201

@bp.route('/metrics/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def metric_item(id):
    user_id = get_jwt_identity()
    metric = HealthMetric.query.filter_by(id=id, user_id=user_id).first()
    if not metric:
        return jsonify({'error': 'Not found'}), 404
    if request.method == 'DELETE':
        db.session.delete(metric)
        db.session.commit()
        return jsonify({'message': 'Deleted'}), 200
    else:
        data = request.get_json()
        for k, v in data.items():
            if hasattr(metric, k) and k != 'id':
                setattr(metric, k, v)
        db.session.commit()
        return jsonify(metric.to_dict()), 200
