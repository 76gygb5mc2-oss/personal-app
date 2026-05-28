from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import CommunicationPractice, Vocabulary
from datetime import datetime

bp = Blueprint('communication', __name__, url_prefix='/api/communication')

@bp.route('/practices', methods=['GET', 'POST'])
@jwt_required()
def practices():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        items = CommunicationPractice.query.filter_by(user_id=user_id).order_by(CommunicationPractice.date.desc()).all()
        return jsonify([i.to_dict() for i in items]), 200
    else:
        data = request.get_json()
        item = CommunicationPractice(user_id=user_id, **{k: v for k, v in data.items() if k != 'id'})
        db.session.add(item)
        db.session.commit()
        return jsonify(item.to_dict()), 201

@bp.route('/practices/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def practice_item(id):
    user_id = get_jwt_identity()
    item = CommunicationPractice.query.filter_by(id=id, user_id=user_id).first()
    if not item:
        return jsonify({'error': 'Not found'}), 404
    if request.method == 'DELETE':
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Deleted'}), 200
    else:
        data = request.get_json()
        for k, v in data.items():
            if hasattr(item, k) and k != 'id':
                setattr(item, k, v)
        db.session.commit()
        return jsonify(item.to_dict()), 200

@bp.route('/vocabulary', methods=['GET', 'POST'])
@jwt_required()
def vocabulary():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        items = Vocabulary.query.filter_by(user_id=user_id).order_by(Vocabulary.created_at.desc()).all()
        return jsonify([i.to_dict() for i in items]), 200
    else:
        data = request.get_json()
        item = Vocabulary(user_id=user_id, **{k: v for k, v in data.items() if k != 'id'})
        db.session.add(item)
        db.session.commit()
        return jsonify(item.to_dict()), 201

@bp.route('/vocabulary/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def vocabulary_item(id):
    user_id = get_jwt_identity()
    item = Vocabulary.query.filter_by(id=id, user_id=user_id).first()
    if not item:
        return jsonify({'error': 'Not found'}), 404
    if request.method == 'DELETE':
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Deleted'}), 200
    else:
        data = request.get_json()
        for k, v in data.items():
            if hasattr(item, k) and k != 'id':
                setattr(item, k, v)
        db.session.commit()
        return jsonify(item.to_dict()), 200
