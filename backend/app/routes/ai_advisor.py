from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import AIConversation, BusinessIdea, FinancialTransaction, Task, DailyCheckin
from datetime import datetime, timedelta
import os

bp = Blueprint('ai_advisor', __name__, url_prefix='/api/ai')

def get_user_context(user_id):
    """Gather user data for AI context"""
    today = datetime.utcnow().date()
    week_start = today - timedelta(days=today.weekday())
    
    # Financial data
    week_income = db.session.query(db.func.sum(FinancialTransaction.amount)).filter(
        FinancialTransaction.user_id == user_id,
        FinancialTransaction.type == 'income',
        FinancialTransaction.date >= week_start
    ).scalar() or 0
    
    week_expenses = db.session.query(db.func.sum(FinancialTransaction.amount)).filter(
        FinancialTransaction.user_id == user_id,
        FinancialTransaction.type == 'expense',
        FinancialTransaction.date >= week_start
    ).scalar() or 0
    
    # Business ideas
    business_ideas = BusinessIdea.query.filter_by(user_id=user_id, status='active').count()
    
    # Tasks
    overdue_tasks = Task.query.filter(
        Task.user_id == user_id,
        Task.status != 'completed',
        Task.due_date < today
    ).count()
    
    # Recent check-ins
    recent_checkins = DailyCheckin.query.filter(
        DailyCheckin.user_id == user_id,
        DailyCheckin.date >= week_start
    ).all()
    
    avg_productivity = sum(c.productivity_score or 0 for c in recent_checkins) / len(recent_checkins) if recent_checkins else 0
    
    return {
        'week_income': float(week_income),
        'week_expenses': float(week_expenses),
        'week_net': float(week_income - week_expenses),
        'active_business_ideas': business_ideas,
        'overdue_tasks': overdue_tasks,
        'avg_productivity_score': round(avg_productivity, 2),
        'checkins_this_week': len(recent_checkins)
    }

@bp.route('/analyze', methods=['POST'])
@jwt_required()
def analyze():
    """AI analysis and recommendations"""
    user_id = get_jwt_identity()
    data = request.get_json()
    user_message = data.get('message', '')
    
    context = get_user_context(user_id)
    
    # Simple rule-based recommendations (replace with OpenAI integration if API key provided)
    api_key = os.getenv('OPENAI_API_KEY')
    
    if api_key:
        # TODO: Integrate with OpenAI API
        ai_response = "OpenAI integration placeholder. Add actual API call here."
    else:
        # Rule-based fallback
        recommendations = []
        
        if context['overdue_tasks'] > 0:
            recommendations.append(f"⚠️ You have {context['overdue_tasks']} overdue tasks. Prioritize completing these first.")
        
        if context['week_net'] < 0:
            recommendations.append(f"💰 Your expenses (${context['week_expenses']:.2f}) exceeded income (${context['week_income']:.2f}) this week. Review spending.")
        
        if context['avg_productivity_score'] < 5:
            recommendations.append(f"📊 Your productivity score is {context['avg_productivity_score']}/10. Identify what's blocking your progress.")
        
        if context['checkins_this_week'] < 5:
            recommendations.append(f"✅ You've only checked in {context['checkins_this_week']} times this week. Daily check-ins help maintain accountability.")
        
        if not recommendations:
            recommendations.append("✨ Great work! Keep maintaining your current momentum.")
        
        ai_response = "\n\n".join(recommendations)
    
    # Save conversation
    conversation = AIConversation(
        user_id=user_id,
        conversation_type='analysis',
        user_message=user_message,
        ai_response=ai_response,
        context_data=str(context)
    )
    
    db.session.add(conversation)
    db.session.commit()
    
    return jsonify({
        'response': ai_response,
        'context': context
    }), 200

@bp.route('/recommendations', methods=['GET'])
@jwt_required()
def recommendations():
    """Get current recommendations"""
    user_id = get_jwt_identity()
    context = get_user_context(user_id)
    
    recommendations = []
    
    if context['overdue_tasks'] > 0:
        recommendations.append({
            'type': 'urgent',
            'category': 'productivity',
            'message': f"Complete {context['overdue_tasks']} overdue tasks",
            'priority': 'high'
        })
    
    if context['week_net'] < 0:
        recommendations.append({
            'type': 'warning',
            'category': 'financial',
            'message': f"Expenses exceeded income by ${abs(context['week_net']):.2f} this week",
            'priority': 'high'
        })
    
    if context['avg_productivity_score'] < 5 and context['avg_productivity_score'] > 0:
        recommendations.append({
            'type': 'improvement',
            'category': 'productivity',
            'message': f"Productivity score is {context['avg_productivity_score']}/10. Review your daily routine.",
            'priority': 'medium'
        })
    
    if context['checkins_this_week'] < 7:
        recommendations.append({
            'type': 'habit',
            'category': 'accountability',
            'message': f"Complete daily check-ins ({context['checkins_this_week']}/7 this week)",
            'priority': 'medium'
        })
    
    return jsonify({
        'recommendations': recommendations,
        'context': context
    }), 200

@bp.route('/history', methods=['GET'])
@jwt_required()
def history():
    """Get AI conversation history"""
    user_id = get_jwt_identity()
    conversations = AIConversation.query.filter_by(user_id=user_id).order_by(AIConversation.created_at.desc()).limit(50).all()
    return jsonify([c.to_dict() for c in conversations]), 200
