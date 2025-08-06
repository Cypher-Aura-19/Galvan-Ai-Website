from app import db
from datetime import datetime

class Testimonial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    avatar = db.Column(db.Text, nullable=False)  # Store as base64 or URL
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    long_content = db.Column(db.Text)  # Optional field
    rating = db.Column(db.Integer, nullable=False)
    featured = db.Column(db.Boolean, default=False)
    tags = db.Column(db.Text)  # Store as JSON string
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert testimonial to dictionary for JSON response"""
        import json
        return {
            'id': self.id,
            'name': self.name,
            'role': self.role,
            'company': self.company,
            'avatar': self.avatar,
            'title': self.title,
            'content': self.content,
            'longContent': self.long_content,
            'rating': self.rating,
            'featured': self.featured,
            'tags': json.loads(self.tags) if self.tags else [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @staticmethod
    def from_dict(data):
        """Create testimonial from dictionary"""
        import json
        return Testimonial(
            name=data['name'],
            role=data['role'],
            company=data['company'],
            avatar=data['avatar'],
            title=data['title'],
            content=data['content'],
            long_content=data.get('longContent', ''),
            rating=data['rating'],
            featured=data.get('featured', False),
            tags=json.dumps(data.get('tags', []))
        ) 