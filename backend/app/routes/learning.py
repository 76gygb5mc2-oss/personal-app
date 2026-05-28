from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import LearningResource, Note
from datetime import datetime

bp = Blueprint('learning', __name__, url_prefix='/api/learning')

@bp.route('/resources', methods=['GET', 'POST'])
@jwt_required()
def resources():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        resources = LearningResource.query.filter_by(user_id=user_id).order_by(LearningResource.updated_at.desc()).all()
        return jsonify([r.to_dict() for r in resources]), 200
    else:
        data = request.get_json()
        resource = LearningResource(user_id=user_id, **{k: v for k, v in data.items() if k != 'id'})
        db.session.add(resource)
        db.session.commit()
        return jsonify(resource.to_dict()), 201

@bp.route('/resources/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def resource_item(id):
    user_id = get_jwt_identity()
    resource = LearningResource.query.filter_by(id=id, user_id=user_id).first()
    if not resource:
        return jsonify({'error': 'Not found'}), 404
    if request.method == 'DELETE':
        db.session.delete(resource)
        db.session.commit()
        return jsonify({'message': 'Deleted'}), 200
    else:
        data = request.get_json()
        for k, v in data.items():
            if hasattr(resource, k) and k != 'id':
                setattr(resource, k, v)
        db.session.commit()
        return jsonify(resource.to_dict()), 200

@bp.route('/notes', methods=['GET', 'POST'])
@jwt_required()
def notes():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        notes = Note.query.filter_by(user_id=user_id).order_by(Note.updated_at.desc()).all()
        return jsonify([n.to_dict() for n in notes]), 200
    else:
        data = request.get_json()
        note = Note(user_id=user_id, **{k: v for k, v in data.items() if k != 'id'})
        db.session.add(note)
        db.session.commit()
        return jsonify(note.to_dict()), 201

@bp.route('/notes/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def note_item(id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=id, user_id=user_id).first()
    if not note:
        return jsonify({'error': 'Not found'}), 404
    if request.method == 'DELETE':
        db.session.delete(note)
        db.session.commit()
        return jsonify({'message': 'Deleted'}), 200
    else:
        data = request.get_json()
        for k, v in data.items():
            if hasattr(note, k) and k != 'id':
                setattr(note, k, v)
        db.session.commit()
        return jsonify(note.to_dict()), 200
