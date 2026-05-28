from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import DailyCheckin, WeeklyReview
from datetime import datetime

bp = Blueprint('checkin', __name__, url_prefix='/api/checkin')

@bp.route('/daily', methods=['GET', 'POST'])
@jwt_required()
def daily():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        checkins = DailyCheckin.query.filter_by(user_id=user_id).order_by(DailyCheckin.date.desc()).all()
        return jsonify([c.to_dict() for c in checkins]), 200
    else:
        data = request.get_json()
        checkin = DailyCheckin(user_id=user_id, **{k: v for k, v in data.items() if k != 'id'})
        db.session.add(checkin)
        db.session.commit()
        return jsonify(checkin.to_dict()), 201

@bp.route('/daily/<int:id>', methods=['PUT'])
@jwt_required()
def daily_item(id):
    user_id = get_jwt_identity()
    checkin = DailyCheckin.query.filter_by(id=id, user_id=user_id).first()
    if not checkin:
        return jsonify({'error': 'Not found'}), 404
    data = request.get_json()
    for k, v in data.items():
        if hasattr(checkin, k) and k != 'id':
            setattr(checkin, k, v)
    db.session.commit()
    return jsonify(checkin.to_dict()), 200

@bp.route('/weekly', methods=['GET', 'POST'])
@jwt_required()
def weekly():
    user_id = get_jwt_identity()
    if request.method == 'GET':
        reviews = WeeklyReview.query.filter_by(user_id=user_id).order_by(WeeklyReview.week_start_date.desc()).all()
        return jsonify([r.to_dict() for r in reviews]), 200
    else:
        data = request.get_json()
        review = WeeklyReview(user_id=user_id, **{k: v for k, v in data.items() if k != 'id'})
        db.session.add(review)
        db.session.commit()
        return jsonify(review.to_dict()), 201

@bp.route('/weekly/<int:id>', methods=['PUT'])
@jwt_required()
def weekly_item(id):
    user_id = get_jwt_identity()
    review = WeeklyReview.query.filter_by(id=id, user_id=user_id).first()
    if not review:
        return jsonify({'error': 'Not found'}), 404
    data = request.get_json()
    for k, v in data.items():
        if hasattr(review, k) and k != 'id':
            setattr(review, k, v)
    db.session.commit()
    return jsonify(review.to_dict()), 200
