# Sirawdink OS - Personal Operating System

A comprehensive personal management platform designed to optimize business success, financial growth, communication skills, mindset, health, relationships, and learning.

## Features

- **Business Development Center** - Track opportunities, projects, revenue, and strategic decisions
- **Financial Growth Center** - Income/expense tracking, budgeting, net worth monitoring
- **Communication Center** - Speaking practice, vocabulary building, presentation prep
- **Mindset & Development** - Daily reflections, habit tracking, goal alignment
- **Relationship Management** - Contact tracking, follow-ups, relationship quality monitoring
- **Learning Center** - Course tracking, knowledge management, skill development
- **Health & Fitness** - Exercise, nutrition, sleep, and wellness tracking
- **AI Strategic Advisor** - Intelligent recommendations and pattern analysis
- **Check-in Systems** - Daily, weekly, and monthly review workflows
- **Reporting Engine** - Comprehensive analytics and progress visualization

## Tech Stack

- **Backend**: Python Flask with SQLAlchemy ORM
- **Database**: PostgreSQL
- **Frontend**: React with Material-UI
- **Authentication**: Flask-JWT-Extended
- **AI Integration**: OpenAI API (configurable)
- **Deployment**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose
- OpenAI API key (optional, for AI features)

### Installation

1. Clone and navigate to the project:
```bash
cd sirawdink-os
```

2. Create environment file:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the application:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Development Setup

1. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Install Node dependencies:
```bash
cd frontend
npm install
```

3. Run database migrations:
```bash
cd backend
flask db upgrade
```

4. Start development servers:
```bash
# Terminal 1 - Backend
cd backend
flask run

# Terminal 2 - Frontend
cd frontend
npm start
```

## Project Structure

```
sirawdink-os/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helpers and utilities
│   │   └── __init__.py      # App factory
│   ├── migrations/          # Database migrations
│   ├── config.py            # Configuration
│   ├── requirements.txt     # Python dependencies
│   └── run.py              # Application entry point
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # React context
│   │   └── App.js          # Main app component
│   └── package.json        # Node dependencies
├── docker-compose.yml      # Docker orchestration
├── Dockerfile.backend      # Backend container
├── Dockerfile.frontend     # Frontend container
└── README.md              # This file
```

## API Documentation

API documentation is available at http://localhost:5000/api/docs when running the application.

## Configuration

Key environment variables in `.env`:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET_KEY` - Secret for JWT tokens
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `FLASK_ENV` - development/production
- `FRONTEND_URL` - Frontend URL for CORS

## Deployment

### Production Deployment

1. Update `.env` with production values
2. Build and deploy with Docker:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment Options

- **DigitalOcean App Platform** - Easiest, ~$12/month
- **AWS EC2/RDS** - Flexible, ~$15-30/month
- **Heroku** - Simple, ~$16/month
- **Railway** - Modern, ~$10-20/month

## Backup and Data Export

Export all data:
```bash
python backend/scripts/export_data.py
```

Database backup:
```bash
docker-compose exec db pg_dump -U postgres sirawdink_os > backup.sql
```

## Security Notes

- Change default JWT secret in production
- Use HTTPS in production
- Set secure CORS origins
- Regularly update dependencies
- Enable database backups
- Use environment variables for all secrets

## Support and Maintenance

This is a custom personal application. For issues:
1. Check logs: `docker-compose logs`
2. Restart services: `docker-compose restart`
3. Rebuild: `docker-compose up -d --build`

## License

Private personal use only.
