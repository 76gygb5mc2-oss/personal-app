from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Contact, Interaction
from datetime import datetime

bp = Blueprint('relationships', __name__, url_prefix='/api/relationships')

@bp.route('/contacts', methods=['GET', 'POST'])
@jwt_required()
def contacts():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        contacts = Contact.query.filter_by(user_id=user_id).order_by(Contact.name).all()
        return jsonify([c.to_dict() for c in contacts]), 200
    else:
        data = request.get_json()
        contact = Contact(user_id=user_id, **{k: v for k, v in data.items() if k != 'id'})
        db.session.add(contact)
        db.session.commit()
        return jsonify(contact.to_dict()), 201

@bp.route('/contacts/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def contact_item(id):
    user_id = get_jwt_identity()
    contact = Contact.query.filter_by(id=id, user_id=user_id).first()
    if not contact:
        return jsonify({'error': 'Not found'}), 404
    if request.method == 'DELETE':
        db.session.delete(contact)
        db.session.commit()
        return jsonify({'message': 'Deleted'}), 200
    else:
        data = request.get_json()
        for k, v in data.items():
            if hasattr(contact, k) and k != 'id':
                setattr(contact, k, v)
        db.session.commit()
        return jsonify(contact.to_dict()), 200

@bp.route('/interactions', methods=['POST'])
@jwt_required()
def create_interaction():
    data = request.get_json()
    interaction = Interaction(**{k: v for k, v in data.items() if k != 'id'})
    db.session.add(interaction)
    db.session.commit()
    return jsonify(interaction.to_dict()), 201

@bp.route('/contacts/<int:contact_id>/interactions', methods=['GET'])
@jwt_required()
def get_interactions(contact_id):
    user_id = get_jwt_identity()
    contact = Contact.query.filter_by(id=contact_id, user_id=user_id).first()
    if not contact:
        return jsonify({'error': 'Contact not found'}), 404
    interactions = Interaction.query.filter_by(contact_id=contact_id).order_by(Interaction.date.desc()).all()
    return jsonify([i.to_dict() for i in interactions]), 200
