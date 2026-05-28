from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models import BusinessIdea, Project, Task
from datetime import datetime

bp = Blueprint('business', __name__, url_prefix='/api/business')

@bp.route('/ideas', methods=['GET'])
@jwt_required()
def get_ideas():
    """Get all business ideas"""
    user_id = get_jwt_identity()
    ideas = BusinessIdea.query.filter_by(user_id=user_id).order_by(BusinessIdea.priority_score.desc()).all()
    return jsonify([idea.to_dict() for idea in ideas]), 200

@bp.route('/ideas', methods=['POST'])
@jwt_required()
def create_idea():
    """Create new business idea"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    idea = BusinessIdea(
        user_id=user_id,
        title=data.get('title'),
        description=data.get('description'),
        category=data.get('category'),
        status=data.get('status', 'idea'),
        estimated_investment=data.get('estimated_investment'),
        estimated_monthly_revenue=data.get('estimated_monthly_revenue'),
        estimated_time_required=data.get('estimated_time_required'),
        priority_score=data.get('priority_score'),
        risk_level=data.get('risk_level'),
        notes=data.get('notes')
    )
    
    db.session.add(idea)
    db.session.commit()
    
    return jsonify(idea.to_dict()), 201

@bp.route('/ideas/<int:id>', methods=['PUT'])
@jwt_required()
def update_idea(id):
    """Update business idea"""
    user_id = get_jwt_identity()
    idea = BusinessIdea.query.filter_by(id=id, user_id=user_id).first()
    
    if not idea:
        return jsonify({'error': 'Idea not found'}), 404
    
    data = request.get_json()
    
    for key in ['title', 'description', 'category', 'status', 'estimated_investment', 
                'estimated_monthly_revenue', 'estimated_time_required', 'priority_score', 
                'risk_level', 'notes']:
        if key in data:
            setattr(idea, key, data[key])
    
    db.session.commit()
    return jsonify(idea.to_dict()), 200

@bp.route('/ideas/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_idea(id):
    """Delete business idea"""
    user_id = get_jwt_identity()
    idea = BusinessIdea.query.filter_by(id=id, user_id=user_id).first()
    
    if not idea:
        return jsonify({'error': 'Idea not found'}), 404
    
    db.session.delete(idea)
    db.session.commit()
    
    return jsonify({'message': 'Idea deleted'}), 200

@bp.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():
    """Get all projects"""
    user_id = get_jwt_identity()
    projects = Project.query.filter_by(user_id=user_id).order_by(Project.updated_at.desc()).all()
    return jsonify([p.to_dict() for p in projects]), 200

@bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    """Create new project"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    project = Project(
        user_id=user_id,
        name=data.get('name'),
        description=data.get('description'),
        category=data.get('category'),
        status=data.get('status', 'active'),
        priority=data.get('priority'),
        start_date=datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
        target_date=datetime.fromisoformat(data['target_date']) if data.get('target_date') else None,
        notes=data.get('notes')
    )
    
    db.session.add(project)
    db.session.commit()
    
    return jsonify(project.to_dict()), 201

@bp.route('/projects/<int:id>', methods=['PUT'])
@jwt_required()
def update_project(id):
    """Update project"""
    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=id, user_id=user_id).first()
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    data = request.get_json()
    
    for key in ['name', 'description', 'category', 'status', 'priority', 'progress_percentage', 'notes']:
        if key in data:
            setattr(project, key, data[key])
    
    if 'start_date' in data and data['start_date']:
        project.start_date = datetime.fromisoformat(data['start_date'])
    if 'target_date' in data and data['target_date']:
        project.target_date = datetime.fromisoformat(data['target_date'])
    if 'completion_date' in data and data['completion_date']:
        project.completion_date = datetime.fromisoformat(data['completion_date'])
    
    db.session.commit()
    return jsonify(project.to_dict()), 200

@bp.route('/projects/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_project(id):
    """Delete project"""
    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=id, user_id=user_id).first()
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    db.session.delete(project)
    db.session.commit()
    
    return jsonify({'message': 'Project deleted'}), 200

@bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    """Get all tasks"""
    user_id = get_jwt_identity()
    project_id = request.args.get('project_id', type=int)
    
    query = Task.query.filter_by(user_id=user_id)
    
    if project_id:
        query = query.filter_by(project_id=project_id)
    
    tasks = query.order_by(Task.due_date.asc()).all()
    return jsonify([t.to_dict() for t in tasks]), 200

@bp.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():
    """Create new task"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    task = Task(
        user_id=user_id,
        project_id=data.get('project_id'),
        title=data.get('title'),
        description=data.get('description'),
        status=data.get('status', 'todo'),
        priority=data.get('priority'),
        due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
        estimated_hours=data.get('estimated_hours'),
        tags=data.get('tags')
    )
    
    db.session.add(task)
    db.session.commit()
    
    return jsonify(task.to_dict()), 201

@bp.route('/tasks/<int:id>', methods=['PUT'])
@jwt_required()
def update_task(id):
    """Update task"""
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=id, user_id=user_id).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    data = request.get_json()
    
    for key in ['title', 'description', 'status', 'priority', 'estimated_hours', 'actual_hours', 'tags']:
        if key in data:
            setattr(task, key, data[key])
    
    if 'due_date' in data and data['due_date']:
        task.due_date = datetime.fromisoformat(data['due_date'])
    
    if data.get('status') == 'completed' and not task.completed_at:
        task.completed_at = datetime.utcnow()
    
    db.session.commit()
    return jsonify(task.to_dict()), 200

@bp.route('/tasks/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):
    """Delete task"""
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=id, user_id=user_id).first()
    
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    
    db.session.delete(task)
    db.session.commit()
    
    return jsonify({'message': 'Task deleted'}), 200
