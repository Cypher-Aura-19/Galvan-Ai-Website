from app import db
from datetime import datetime

class Career(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(100), nullable=False)  # Full-time, Part-time, Contract, etc.
    department = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)  # Store as JSON string
    responsibilities = db.Column(db.Text)  # Store as JSON string
    benefits = db.Column(db.Text)  # Store as JSON string
    salary_range = db.Column(db.String(100))  # e.g., "$50,000 - $80,000"
    experience_level = db.Column(db.String(100))  # Entry, Mid, Senior, etc.
    skills_required = db.Column(db.Text)  # Store as JSON string
    application_deadline = db.Column(db.Date)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert career to dictionary for JSON response"""
        import json
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'location': self.location,
            'type': self.type,
            'department': self.department,
            'description': self.description,
            'requirements': json.loads(self.requirements) if self.requirements else [],
            'responsibilities': json.loads(self.responsibilities) if self.responsibilities else [],
            'benefits': json.loads(self.benefits) if self.benefits else [],
            'salary_range': self.salary_range,
            'experience_level': self.experience_level,
            'skills_required': json.loads(self.skills_required) if self.skills_required else [],
            'application_deadline': self.application_deadline.isoformat() if self.application_deadline else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @staticmethod
    def from_dict(data):
        """Create career from dictionary"""
        import json
        from datetime import datetime
        
        # Parse application deadline if provided
        application_deadline = None
        if data.get('application_deadline'):
            try:
                application_deadline = datetime.strptime(data['application_deadline'], '%Y-%m-%d').date()
            except:
                pass

        return Career(
            title=data['title'],
            company=data['company'],
            location=data['location'],
            type=data['type'],
            department=data['department'],
            description=data['description'],
            requirements=json.dumps(data.get('requirements', [])),
            responsibilities=json.dumps(data.get('responsibilities', [])),
            benefits=json.dumps(data.get('benefits', [])),
            salary_range=data.get('salary_range', ''),
            experience_level=data.get('experience_level', ''),
            skills_required=json.dumps(data.get('skills_required', [])),
            application_deadline=application_deadline,
            is_active=data.get('is_active', True)
        ) 