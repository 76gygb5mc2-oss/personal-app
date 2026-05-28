from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import FinancialTransaction, Task, Project, DailyCheckin, HealthMetric, LearningResource
from datetime import datetime, timedelta
from sqlalchemy import func, extract

bp = Blueprint('reports', __name__, url_prefix='/api/reports')

@bp.route('/financial', methods=['GET'])
@jwt_required()
def financial_report():
    user_id = get_jwt_identity()
    period = request.args.get('period', 'month')  # day, week, month, year
    
    today = datetime.utcnow().date()
    
    if period == 'day':
        start_date = today
    elif period == 'week':
        start_date = today - timedelta(days=today.weekday())
    elif period == 'month':
        start_date = today.replace(day=1)
    else:  # year
        start_date = today.replace(month=1, day=1)
    
    transactions = FinancialTransaction.query.filter(
        FinancialTransaction.user_id == user_id,
        FinancialTransaction.date >= start_date
    ).all()
    
    income = sum(t.amount for t in transactions if t.type == 'income')
    expenses = sum(t.amount for t in transactions if t.type == 'expense')
    
    # Category breakdown
    income_by_category = {}
    expenses_by_category = {}
    
    for t in transactions:
        if t.type == 'income':
            income_by_category[t.category] = income_by_category.get(t.category, 0) + t.amount
        else:
            expenses_by_category[t.category] = expenses_by_category.get(t.category, 0) + t.amount
    
    return jsonify({
        'period': period,
        'start_date': start_date.isoformat(),
        'end_date': today.isoformat(),
        'income': float(income),
        'expenses': float(expenses),
        'net': float(income - expenses),
        'income_by_category': income_by_category,
        'expenses_by_category': expenses_by_category
    }), 200

@bp.route('/productivity', methods=['GET'])
@jwt_required()
def productivity_report():
    user_id = get_jwt_identity()
    days = request.args.get('days', 30, type=int)
    
    start_date = datetime.utcnow().date() - timedelta(days=days)
    
    # Tasks completed
    completed_tasks = Task.query.filter(
        Task.user_id == user_id,
        Task.status == 'completed',
        Task.completed_at >= start_date
    ).count()
    
    # Projects progress
    active_projects = Project.query.filter_by(user_id=user_id, status='active').count()
    completed_projects = Project.query.filter(
        Project.user_id == user_id,
        Project.status == 'completed',
        Project.completion_date >= start_date
    ).count()
    
    # Daily checkins
    checkins = DailyCheckin.query.filter(
        DailyCheckin.user_id == user_id,
        DailyCheckin.date >= start_date
    ).all()
    
    avg_productivity = sum(c.productivity_score or 0 for c in checkins) / len(checkins) if checkins else 0
    avg_focus = sum(c.focus_score or 0 for c in checkins) / len(checkins) if checkins else 0
    avg_discipline = sum(c.discipline_score or 0 for c in checkins) / len(checkins) if checkins else 0
    
    return jsonify({
        'period_days': days,
        'completed_tasks': completed_tasks,
        'active_projects': active_projects,
        'completed_projects': completed_projects,
        'avg_productivity_score': round(avg_productivity, 2),
        'avg_focus_score': round(avg_focus, 2),
        'avg_discipline_score': round(avg_discipline, 2)
    }), 200

@bp.route('/learning', methods=['GET'])
@jwt_required()
def learning_report():
    user_id = get_jwt_identity()
    
    resources = LearningResource.query.filter_by(user_id=user_id).all()
    
    total = len(resources)
    completed = sum(1 for r in resources if r.status == 'completed')
    in_progress = sum(1 for r in resources if r.status == 'in_progress')
    not_started = sum(1 for r in resources if r.status == 'not_started')
    
    return jsonify({
        'total_resources': total,
        'completed': completed,
        'in_progress': in_progress,
        'not_started': not_started,
        'completion_rate': round(completed / total * 100, 2) if total > 0 else 0
    }), 200

@bp.route('/health', methods=['GET'])
@jwt_required()
def health_report():
    user_id = get_jwt_identity()
    days = request.args.get('days', 30, type=int)
    
    start_date = datetime.utcnow().date() - timedelta(days=days)
    
    metrics = HealthMetric.query.filter(
        HealthMetric.user_id == user_id,
        HealthMetric.date >= start_date
    ).all()
    
    if not metrics:
        return jsonify({'message': 'No data available'}), 200
    
    avg_sleep = sum(m.sleep_hours or 0 for m in metrics) / len(metrics)
    avg_energy = sum(m.energy_level or 0 for m in metrics) / len(metrics)
    avg_stress = sum(m.stress_level or 0 for m in metrics) / len(metrics)
    total_exercise = sum(m.exercise_minutes or 0 for m in metrics)
    
    return jsonify({
        'period_days': days,
        'data_points': len(metrics),
        'avg_sleep_hours': round(avg_sleep, 2),
        'avg_energy_level': round(avg_energy, 2),
        'avg_stress_level': round(avg_stress, 2),
        'total_exercise_minutes': total_exercise,
        'avg_daily_exercise': round(total_exercise / days, 2)
    }), 200
