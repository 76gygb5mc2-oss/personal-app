from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # User preferences
    timezone = db.Column(db.String(50), default='America/Los_Angeles')
    theme = db.Column(db.String(20), default='dark')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'timezone': self.timezone,
            'theme': self.theme,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class BusinessIdea(db.Model):
    __tablename__ = 'business_ideas'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    status = db.Column(db.String(50), default='idea')  # idea, evaluating, active, paused, completed, abandoned
    estimated_investment = db.Column(db.Float)
    estimated_monthly_revenue = db.Column(db.Float)
    estimated_time_required = db.Column(db.Integer)  # hours per week
    priority_score = db.Column(db.Integer)  # 1-10
    risk_level = db.Column(db.String(20))  # low, medium, high
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'status': self.status,
            'estimated_investment': self.estimated_investment,
            'estimated_monthly_revenue': self.estimated_monthly_revenue,
            'estimated_time_required': self.estimated_time_required,
            'priority_score': self.priority_score,
            'risk_level': self.risk_level,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Project(db.Model):
    __tablename__ = 'projects'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))  # business, personal, learning, etc.
    status = db.Column(db.String(50), default='active')  # active, paused, completed, cancelled
    priority = db.Column(db.String(20))  # critical, high, medium, low
    start_date = db.Column(db.Date)
    target_date = db.Column(db.Date)
    completion_date = db.Column(db.Date)
    progress_percentage = db.Column(db.Integer, default=0)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tasks = db.relationship('Task', backref='project', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'status': self.status,
            'priority': self.priority,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'target_date': self.target_date.isoformat() if self.target_date else None,
            'completion_date': self.completion_date.isoformat() if self.completion_date else None,
            'progress_percentage': self.progress_percentage,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default='todo')  # todo, in_progress, completed, cancelled
    priority = db.Column(db.String(20))  # critical, high, medium, low
    due_date = db.Column(db.Date)
    completed_at = db.Column(db.DateTime)
    estimated_hours = db.Column(db.Float)
    actual_hours = db.Column(db.Float)
    tags = db.Column(db.String(500))  # comma-separated
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'estimated_hours': self.estimated_hours,
            'actual_hours': self.actual_hours,
            'tags': self.tags,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class FinancialTransaction(db.Model):
    __tablename__ = 'financial_transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    type = db.Column(db.String(20), nullable=False)  # income, expense
    category = db.Column(db.String(100), nullable=False)
    subcategory = db.Column(db.String(100))
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(500))
    payment_method = db.Column(db.String(50))
    is_recurring = db.Column(db.Boolean, default=False)
    tags = db.Column(db.String(500))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'type': self.type,
            'category': self.category,
            'subcategory': self.subcategory,
            'amount': self.amount,
            'description': self.description,
            'payment_method': self.payment_method,
            'is_recurring': self.is_recurring,
            'tags': self.tags,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class FinancialGoal(db.Model):
    __tablename__ = 'financial_goals'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    goal_type = db.Column(db.String(50))  # savings, debt_payoff, income, net_worth
    target_amount = db.Column(db.Float, nullable=False)
    current_amount = db.Column(db.Float, default=0)
    target_date = db.Column(db.Date)
    status = db.Column(db.String(50), default='active')  # active, completed, cancelled
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'goal_type': self.goal_type,
            'target_amount': self.target_amount,
            'current_amount': self.current_amount,
            'progress_percentage': (self.current_amount / self.target_amount * 100) if self.target_amount > 0 else 0,
            'target_date': self.target_date.isoformat() if self.target_date else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class CommunicationPractice(db.Model):
    __tablename__ = 'communication_practices'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    practice_type = db.Column(db.String(50))  # speaking, vocabulary, presentation, conversation
    topic = db.Column(db.String(200))
    duration_minutes = db.Column(db.Integer)
    confidence_rating = db.Column(db.Integer)  # 1-10
    notes = db.Column(db.Text)
    areas_to_improve = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'practice_type': self.practice_type,
            'topic': self.topic,
            'duration_minutes': self.duration_minutes,
            'confidence_rating': self.confidence_rating,
            'notes': self.notes,
            'areas_to_improve': self.areas_to_improve,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Vocabulary(db.Model):
    __tablename__ = 'vocabulary'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    word = db.Column(db.String(100), nullable=False)
    definition = db.Column(db.Text)
    example_sentence = db.Column(db.Text)
    category = db.Column(db.String(100))
    mastery_level = db.Column(db.Integer, default=1)  # 1-5
    last_reviewed = db.Column(db.Date)
    times_reviewed = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'word': self.word,
            'definition': self.definition,
            'example_sentence': self.example_sentence,
            'category': self.category,
            'mastery_level': self.mastery_level,
            'last_reviewed': self.last_reviewed.isoformat() if self.last_reviewed else None,
            'times_reviewed': self.times_reviewed,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class JournalEntry(db.Model):
    __tablename__ = 'journal_entries'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    entry_type = db.Column(db.String(50), default='daily')  # daily, weekly, monthly, reflection
    content = db.Column(db.Text, nullable=False)
    mood = db.Column(db.String(50))
    energy_level = db.Column(db.Integer)  # 1-10
    productivity_score = db.Column(db.Integer)  # 1-10
    gratitude = db.Column(db.Text)
    tags = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'entry_type': self.entry_type,
            'content': self.content,
            'mood': self.mood,
            'energy_level': self.energy_level,
            'productivity_score': self.productivity_score,
            'gratitude': self.gratitude,
            'tags': self.tags,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Habit(db.Model):
    __tablename__ = 'habits'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100))
    frequency = db.Column(db.String(50))  # daily, weekly, custom
    target_count = db.Column(db.Integer, default=1)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    logs = db.relationship('HabitLog', backref='habit', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'frequency': self.frequency,
            'target_count': self.target_count,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class HabitLog(db.Model):
    __tablename__ = 'habit_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey('habits.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    completed = db.Column(db.Boolean, default=True)
    count = db.Column(db.Integer, default=1)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'habit_id': self.habit_id,
            'date': self.date.isoformat() if self.date else None,
            'completed': self.completed,
            'count': self.count,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Contact(db.Model):
    __tablename__ = 'contacts'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    relationship_type = db.Column(db.String(100))  # family, friend, mentor, colleague, business
    email = db.Column(db.String(120))
    phone = db.Column(db.String(20))
    importance_level = db.Column(db.String(20))  # critical, high, medium, low
    relationship_quality = db.Column(db.Integer)  # 1-10
    last_contact_date = db.Column(db.Date)
    next_followup_date = db.Column(db.Date)
    notes = db.Column(db.Text)
    tags = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    interactions = db.relationship('Interaction', backref='contact', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'relationship_type': self.relationship_type,
            'email': self.email,
            'phone': self.phone,
            'importance_level': self.importance_level,
            'relationship_quality': self.relationship_quality,
            'last_contact_date': self.last_contact_date.isoformat() if self.last_contact_date else None,
            'next_followup_date': self.next_followup_date.isoformat() if self.next_followup_date else None,
            'notes': self.notes,
            'tags': self.tags,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Interaction(db.Model):
    __tablename__ = 'interactions'
    
    id = db.Column(db.Integer, primary_key=True)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    interaction_type = db.Column(db.String(50))  # meeting, call, email, text, social
    summary = db.Column(db.Text)
    quality_rating = db.Column(db.Integer)  # 1-10
    action_items = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'contact_id': self.contact_id,
            'date': self.date.isoformat() if self.date else None,
            'interaction_type': self.interaction_type,
            'summary': self.summary,
            'quality_rating': self.quality_rating,
            'action_items': self.action_items,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class LearningResource(db.Model):
    __tablename__ = 'learning_resources'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    resource_type = db.Column(db.String(50))  # course, book, video, article, certification
    category = db.Column(db.String(100))
    url = db.Column(db.String(500))
    status = db.Column(db.String(50), default='not_started')  # not_started, in_progress, completed, paused
    priority = db.Column(db.String(20))
    progress_percentage = db.Column(db.Integer, default=0)
    start_date = db.Column(db.Date)
    completion_date = db.Column(db.Date)
    rating = db.Column(db.Integer)  # 1-10
    notes = db.Column(db.Text)
    tags = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'resource_type': self.resource_type,
            'category': self.category,
            'url': self.url,
            'status': self.status,
            'priority': self.priority,
            'progress_percentage': self.progress_percentage,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'completion_date': self.completion_date.isoformat() if self.completion_date else None,
            'rating': self.rating,
            'notes': self.notes,
            'tags': self.tags,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class Note(db.Model):
    __tablename__ = 'notes'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100))
    tags = db.Column(db.String(500))
    is_favorite = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'category': self.category,
            'tags': self.tags,
            'is_favorite': self.is_favorite,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class HealthMetric(db.Model):
    __tablename__ = 'health_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    weight = db.Column(db.Float)
    sleep_hours = db.Column(db.Float)
    sleep_quality = db.Column(db.Integer)  # 1-10
    water_intake_oz = db.Column(db.Integer)
    energy_level = db.Column(db.Integer)  # 1-10
    stress_level = db.Column(db.Integer)  # 1-10
    exercise_minutes = db.Column(db.Integer)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'weight': self.weight,
            'sleep_hours': self.sleep_hours,
            'sleep_quality': self.sleep_quality,
            'water_intake_oz': self.water_intake_oz,
            'energy_level': self.energy_level,
            'stress_level': self.stress_level,
            'exercise_minutes': self.exercise_minutes,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class DailyCheckin(db.Model):
    __tablename__ = 'daily_checkins'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow, unique=True)
    
    # Daily questions
    top_priorities = db.Column(db.Text)  # JSON array
    money_action = db.Column(db.Text)
    skill_improved = db.Column(db.Text)
    distractions = db.Column(db.Text)
    tomorrow_focus = db.Column(db.Text)
    biggest_win = db.Column(db.Text)
    biggest_challenge = db.Column(db.Text)
    
    # Scores
    productivity_score = db.Column(db.Integer)  # 1-10
    focus_score = db.Column(db.Integer)  # 1-10
    discipline_score = db.Column(db.Integer)  # 1-10
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'date': self.date.isoformat() if self.date else None,
            'top_priorities': self.top_priorities,
            'money_action': self.money_action,
            'skill_improved': self.skill_improved,
            'distractions': self.distractions,
            'tomorrow_focus': self.tomorrow_focus,
            'biggest_win': self.biggest_win,
            'biggest_challenge': self.biggest_challenge,
            'productivity_score': self.productivity_score,
            'focus_score': self.focus_score,
            'discipline_score': self.discipline_score,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class WeeklyReview(db.Model):
    __tablename__ = 'weekly_reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    week_start_date = db.Column(db.Date, nullable=False)
    week_end_date = db.Column(db.Date, nullable=False)
    
    # Weekly metrics
    income_earned = db.Column(db.Float)
    money_saved = db.Column(db.Float)
    hours_learning = db.Column(db.Float)
    business_progress = db.Column(db.Text)
    health_progress = db.Column(db.Text)
    
    # Reflections
    biggest_mistake = db.Column(db.Text)
    biggest_lesson = db.Column(db.Text)
    goals_completed = db.Column(db.Text)
    goals_missed = db.Column(db.Text)
    time_wasted = db.Column(db.Text)
    
    # Next week
    next_week_priorities = db.Column(db.Text)
    next_week_focus = db.Column(db.Text)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'week_start_date': self.week_start_date.isoformat() if self.week_start_date else None,
            'week_end_date': self.week_end_date.isoformat() if self.week_end_date else None,
            'income_earned': self.income_earned,
            'money_saved': self.money_saved,
            'hours_learning': self.hours_learning,
            'business_progress': self.business_progress,
            'health_progress': self.health_progress,
            'biggest_mistake': self.biggest_mistake,
            'biggest_lesson': self.biggest_lesson,
            'goals_completed': self.goals_completed,
            'goals_missed': self.goals_missed,
            'time_wasted': self.time_wasted,
            'next_week_priorities': self.next_week_priorities,
            'next_week_focus': self.next_week_focus,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class AIConversation(db.Model):
    __tablename__ = 'ai_conversations'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    conversation_type = db.Column(db.String(50))  # analysis, recommendation, challenge, planning
    user_message = db.Column(db.Text, nullable=False)
    ai_response = db.Column(db.Text, nullable=False)
    context_data = db.Column(db.Text)  # JSON with relevant user data
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'conversation_type': self.conversation_type,
            'user_message': self.user_message,
            'ai_response': self.ai_response,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
