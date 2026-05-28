from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import JournalEntry, Habit, HabitLog
from datetime import datetime

bp = Blueprint('mindset', __name__, url_prefix='/api/mindset')

@bp.route('/journal', methods=['GET', 'POST'])
@jwt_required()
def journal():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        entries = JournalEntry.query.filter_by(user_id=user_id).order_by(JournalEntry.date.desc()).all()
        return jsonify([e.to_dict() for e in entries]), 200
    else:
        data = request.get_json()
        entry = JournalEntry(user_id=user_id, **{k: v for k, v in data.items() if k != 'id'})
        db.session.add(entry)
        db.session.commit()
        return jsonify(entry.to_dict()), 201

@bp.route('/journal/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def journal_entry(id):
    user_id = get_jwt_identity()
    entry = JournalEntry.query.filter_by(id=id, user_id=user_id).first()
    if not entry:
        return jsonify({'error': 'Not found'}), 404
    if request.method == 'DELETE':
        db.session.delete(entry)
        db.session.commit()
        return jsonify({'message': 'Deleted'}), 200
    else:
        data = request.get_json()
        for k, v in data.items():
            if hasattr(entry, k) and k != 'id':
                setattr(entry, k, v)
        db.session.commit()
        return jsonify(entry.to_dict()), 200

@bp.route('/habits', methods=['GET', 'POST'])
@jwt_required()
def habits():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        habits = Habit.query.filter_by(user_id=user_id).all()
        return jsonify([h.to_dict() for h in habits]), 200
    else:
        data = request.get_json()
        habit = Habit(user_id=user_id, **{k: v for k, v in data.items() if k != 'id'})
        db.session.add(habit)
        db.session.commit()
        return jsonify(habit.to_dict()), 201

@bp.route('/habits/<int:id>', methods=['PUT', 'DELETE'])
@jwt_required()
def habit_item(id):
    user_id = get_jwt_identity()
    habit = Habit.query.filter_by(id=id, user_id=user_id).first()
    if not habit:
        return jsonify({'error': 'Not found'}), 404
    if request.method == 'DELETE':
        db.session.delete(habit)
        db.session.commit()
        return jsonify({'message': 'Deleted'}), 200
    else:
        data = request.get_json()
        for k, v in data.items():
            if hasattr(habit, k) and k != 'id':
                setattr(habit, k, v)
        db.session.commit()
        return jsonify(habit.to_dict()), 200

@bp.route('/habits/log', methods=['POST'])
@jwt_required()
def log_habit():
    user_id = get_jwt_identity()
    data = request.get_json()
    log = HabitLog(**{k: v for k, v in data.items() if k != 'id'})
    db.session.add(log)
    db.session.commit()
    return jsonify(log.to_dict()), 201

@bp.route('/habits/<int:habit_id>/logs', methods=['GET'])
@jwt_required()
def get_habit_logs(habit_id):
    user_id = get_jwt_identity()
    habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first()
    if not habit:
        return jsonify({'error': 'Habit not found'}), 404
    logs = HabitLog.query.filter_by(habit_id=habit_id).order_by(HabitLog.date.desc()).all()
    return jsonify([log.to_dict() for log in logs]), 200
