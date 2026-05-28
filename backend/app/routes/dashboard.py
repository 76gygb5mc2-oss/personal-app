from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import Task, Project, FinancialTransaction, JournalEntry, Habit, HabitLog, Contact, LearningResource, HealthMetric
from datetime import datetime, timedelta
from sqlalchemy import func

bp = Blueprint('dashboard', __name__, url_prefix='/api/dashboard')

@bp.route('/', methods=['GET'])
@jwt_required()
def get_dashboard():
    """Get comprehensive dashboard data"""
    user_id = get_jwt_identity()
    today = datetime.utcnow().date()
    
    # Today's tasks
    today_tasks = Task.query.filter_by(
        user_id=user_id,
        due_date=today,
        status='todo'
    ).all()
    
    # Active projects
    active_projects = Project.query.filter_by(
        user_id=user_id,
        status='active'
    ).limit(5).all()
    
    # This week's income
    week_start = today - timedelta(days=today.weekday())
    week_income = db.session.query(func.sum(FinancialTransaction.amount)).filter(
        FinancialTransaction.user_id == user_id,
        FinancialTransaction.type == 'income',
        FinancialTransaction.date >= week_start
    ).scalar() or 0
    
    # This week's expenses
    week_expenses = db.session.query(func.sum(FinancialTransaction.amount)).filter(
        FinancialTransaction.user_id == user_id,
        FinancialTransaction.type == 'expense',
        FinancialTransaction.date >= week_start
    ).scalar() or 0
    
    # Recent journal entries
    recent_journals = JournalEntry.query.filter_by(
        user_id=user_id
    ).order_by(JournalEntry.date.desc()).limit(3).all()
    
    # Habit completion today
    active_habits = Habit.query.filter_by(user_id=user_id, is_active=True).all()
    completed_habits = HabitLog.query.filter_by(date=today).filter(
        HabitLog.habit_id.in_([h.id for h in active_habits])
    ).count()
    
    # Upcoming followups
    upcoming_followups = Contact.query.filter(
        Contact.user_id == user_id,
        Contact.next_followup_date.isnot(None),
        Contact.next_followup_date <= today + timedelta(days=7)
    ).order_by(Contact.next_followup_date).limit(5).all()
    
    # In-progress learning
    learning_resources = LearningResource.query.filter_by(
        user_id=user_id,
        status='in_progress'
    ).limit(5).all()
    
    return jsonify({
        'today_tasks': [t.to_dict() for t in today_tasks],
        'active_projects': [p.to_dict() for p in active_projects],
        'week_income': float(week_income),
        'week_expenses': float(week_expenses),
        'week_net': float(week_income - week_expenses),
        'recent_journals': [j.to_dict() for j in recent_journals],
        'habits': {
            'total': len(active_habits),
            'completed': completed_habits
        },
        'upcoming_followups': [c.to_dict() for c in upcoming_followups],
        'learning_in_progress': [lr.to_dict() for lr in learning_resources]
    }), 200
