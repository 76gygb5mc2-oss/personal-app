from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import FinancialTransaction, FinancialGoal
from datetime import datetime
from sqlalchemy import func, extract

bp = Blueprint('financial', __name__, url_prefix='/api/financial')

# Transactions
@bp.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    transactions = FinancialTransaction.query.filter_by(user_id=user_id).order_by(FinancialTransaction.date.desc()).all()
    return jsonify([t.to_dict() for t in transactions]), 200

@bp.route('/transactions', methods=['POST'])
@jwt_required()
def create_transaction():
    user_id = get_jwt_identity()
    data = request.get_json()
    transaction = FinancialTransaction(
        user_id=user_id,
        date=datetime.fromisoformat(data['date']) if data.get('date') else datetime.utcnow(),
        type=data['type'],
        category=data['category'],
        subcategory=data.get('subcategory'),
        amount=data['amount'],
        description=data.get('description'),
        payment_method=data.get('payment_method'),
        is_recurring=data.get('is_recurring', False),
        tags=data.get('tags'),
        notes=data.get('notes')
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify(transaction.to_dict()), 201

@bp.route('/transactions/<int:id>', methods=['PUT'])
@jwt_required()
def update_transaction(id):
    user_id = get_jwt_identity()
    transaction = FinancialTransaction.query.filter_by(id=id, user_id=user_id).first()
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    data = request.get_json()
    for key in ['type', 'category', 'subcategory', 'amount', 'description', 'payment_method', 'is_recurring', 'tags', 'notes']:
        if key in data:
            setattr(transaction, key, data[key])
    if 'date' in data:
        transaction.date = datetime.fromisoformat(data['date'])
    db.session.commit()
    return jsonify(transaction.to_dict()), 200

@bp.route('/transactions/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(id):
    user_id = get_jwt_identity()
    transaction = FinancialTransaction.query.filter_by(id=id, user_id=user_id).first()
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction deleted'}), 200

# Goals
@bp.route('/goals', methods=['GET'])
@jwt_required()
def get_goals():
    user_id = get_jwt_identity()
    goals = FinancialGoal.query.filter_by(user_id=user_id).order_by(FinancialGoal.created_at.desc()).all()
    return jsonify([g.to_dict() for g in goals]), 200

@bp.route('/goals', methods=['POST'])
@jwt_required()
def create_goal():
    user_id = get_jwt_identity()
    data = request.get_json()
    goal = FinancialGoal(
        user_id=user_id,
        name=data['name'],
        description=data.get('description'),
        goal_type=data['goal_type'],
        target_amount=data['target_amount'],
        current_amount=data.get('current_amount', 0),
        target_date=datetime.fromisoformat(data['target_date']) if data.get('target_date') else None,
        status=data.get('status', 'active')
    )
    db.session.add(goal)
    db.session.commit()
    return jsonify(goal.to_dict()), 201

@bp.route('/goals/<int:id>', methods=['PUT'])
@jwt_required()
def update_goal(id):
    user_id = get_jwt_identity()
    goal = FinancialGoal.query.filter_by(id=id, user_id=user_id).first()
    if not goal:
        return jsonify({'error': 'Goal not found'}), 404
    data = request.get_json()
    for key in ['name', 'description', 'goal_type', 'target_amount', 'current_amount', 'status']:
        if key in data:
            setattr(goal, key, data[key])
    if 'target_date' in data:
        goal.target_date = datetime.fromisoformat(data['target_date'])
    db.session.commit()
    return jsonify(goal.to_dict()), 200

@bp.route('/goals/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_goal(id):
    user_id = get_jwt_identity()
    goal = FinancialGoal.query.filter_by(id=id, user_id=user_id).first()
    if not goal:
        return jsonify({'error': 'Goal not found'}), 404
    db.session.delete(goal)
    db.session.commit()
    return jsonify({'message': 'Goal deleted'}), 200

# Summary
@bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    user_id = get_jwt_identity()
    year = request.args.get('year', datetime.now().year, type=int)
    month = request.args.get('month', datetime.now().month, type=int)
    
    income = db.session.query(func.sum(FinancialTransaction.amount)).filter(
        FinancialTransaction.user_id == user_id,
        FinancialTransaction.type == 'income',
        extract('year', FinancialTransaction.date) == year,
        extract('month', FinancialTransaction.date) == month
    ).scalar() or 0
    
    expenses = db.session.query(func.sum(FinancialTransaction.amount)).filter(
        FinancialTransaction.user_id == user_id,
        FinancialTransaction.type == 'expense',
        extract('year', FinancialTransaction.date) == year,
        extract('month', FinancialTransaction.date) == month
    ).scalar() or 0
    
    return jsonify({
        'year': year,
        'month': month,
        'income': float(income),
        'expenses': float(expenses),
        'net': float(income - expenses)
    }), 200
