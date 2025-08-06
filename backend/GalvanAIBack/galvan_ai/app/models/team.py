from app import db
from datetime import datetime

class Team(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    avatar = db.Column(db.Text, nullable=False)  # Store as base64 or URL
    bio = db.Column(db.Text, nullable=False)
    email = db.Column(db.String(100), nullable=False)
    linkedin = db.Column(db.String(200))  # Optional field
    github = db.Column(db.String(200))  # Optional field
    twitter = db.Column(db.String(200))  # Optional field
    website = db.Column(db.String(200))  # Optional field
    department = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    skills = db.Column(db.Text)  # Store as JSON string
    background_interests = db.Column(db.Text)  # Store as JSON string
    awards = db.Column(db.Text)  # Store as JSON string
    certifications = db.Column(db.Text)  # Store as JSON string
    location = db.Column(db.String(200))  # Optional field
    languages = db.Column(db.Text)  # Store as JSON string
    fun_fact = db.Column(db.Text)  # Optional field
    quote = db.Column(db.Text)  # Optional field
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert team member to dictionary for JSON response"""
        import json
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'avatar': self.avatar,
            'bio': self.bio,
            'email': self.email,
            'linkedin': self.linkedin,
            'github': self.github,
            'twitter': self.twitter,
            'website': self.website,
            'department': self.department,
            'position': self.position,
            'skills': json.loads(self.skills) if self.skills else [],
            'background_interests': json.loads(self.background_interests) if self.background_interests else [],
            'awards': json.loads(self.awards) if self.awards else [],
            'certifications': json.loads(self.certifications) if self.certifications else [],
            'location': self.location,
            'languages': json.loads(self.languages) if self.languages else [],
            'fun_fact': self.fun_fact,
            'quote': self.quote,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @staticmethod
    def from_dict(data):
        """Create team member from dictionary"""
        import json
        return Team(
            name=data['name'],
            role=data['role'],
            avatar=data['avatar'],
            bio=data['bio'],
            email=data['email'],
            linkedin=data.get('linkedin', ''),
            github=data.get('github', ''),
            twitter=data.get('twitter', ''),
            website=data.get('website', ''),
            department=data['department'],
            position=data['position'],
            skills=json.dumps(data.get('skills', [])),
            background_interests=json.dumps(data.get('background_interests', [])),
            awards=json.dumps(data.get('awards', [])),
            certifications=json.dumps(data.get('certifications', [])),
            location=data.get('location', ''),
            languages=json.dumps(data.get('languages', [])),
            fun_fact=data.get('fun_fact', ''),
            quote=data.get('quote', '')
        ) 