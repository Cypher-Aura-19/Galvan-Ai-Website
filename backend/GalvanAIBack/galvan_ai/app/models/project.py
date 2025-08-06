from app import db
from datetime import datetime

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hero_subtitle = db.Column(db.String(200), nullable=False)
    hero_description = db.Column(db.Text, nullable=False)
    hero_banner = db.Column(db.Text, nullable=False)  # Store as base64 or URL
    gallery = db.Column(db.Text)  # Store as JSON string
    features = db.Column(db.Text)  # Store as JSON string
    team = db.Column(db.Text)  # Store as JSON string
    timeline = db.Column(db.Text)  # Store as JSON string
    testimonials = db.Column(db.Text)  # Store as JSON string
    technologies = db.Column(db.Text)  # Store as JSON string
    long_description = db.Column(db.Text, nullable=False)
    best_project = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert project to dictionary for JSON response"""
        import json
        
        return {
            'id': self.id,
            'hero': {
                'subtitle': self.hero_subtitle,
                'description': self.hero_description,
                'banner': self.hero_banner
            },
            'gallery': json.loads(self.gallery) if self.gallery else [],
            'features': json.loads(self.features) if self.features else [],
            'team': json.loads(self.team) if self.team else [],
            'timeline': json.loads(self.timeline) if self.timeline else [],
            'testimonials': json.loads(self.testimonials) if self.testimonials else [],
            'technologies': json.loads(self.technologies) if self.technologies else [],
            'longDescription': self.long_description,
            'bestProject': self.best_project,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @staticmethod
    def from_dict(data):
        """Create project from dictionary"""
        import json
        
        return Project(
            hero_subtitle=data['hero']['subtitle'],
            hero_description=data['hero']['description'],
            hero_banner=data['hero']['banner'],
            gallery=json.dumps(data.get('gallery', [])),
            features=json.dumps(data.get('features', [])),
            team=json.dumps(data.get('team', [])),
            timeline=json.dumps(data.get('timeline', [])),
            testimonials=json.dumps(data.get('testimonials', [])),
            technologies=json.dumps(data.get('technologies', [])),
            long_description=data['longDescription'],
            best_project=data.get('bestProject', False)
        ) 