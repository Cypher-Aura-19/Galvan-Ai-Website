from app import db
from datetime import datetime

class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    excerpt = db.Column(db.Text, nullable=False)
    author_name = db.Column(db.String(100), nullable=False)
    author_avatar = db.Column(db.Text, nullable=False)  # Store as base64 or URL
    author_role = db.Column(db.String(100), nullable=False)
    author_bio = db.Column(db.Text, nullable=False)
    read_time = db.Column(db.String(50), nullable=False)
    publish_date = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    image = db.Column(db.Text, nullable=False)  # Store as base64 or URL
    tags = db.Column(db.Text)  # Store as JSON string
    featured = db.Column(db.Boolean, default=False)
    intro = db.Column(db.Text, nullable=False)
    key_concepts = db.Column(db.Text)  # Store as JSON string
    implementation = db.Column(db.Text, nullable=False)
    best_practices = db.Column(db.Text)  # Store as JSON string
    conclusion = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert blog post to dictionary for JSON response"""
        import json
        return {
            'id': self.id,
            'title': self.title,
            'excerpt': self.excerpt,
            'author': {
                'name': self.author_name,
                'avatar': self.author_avatar,
                'role': self.author_role,
                'bio': self.author_bio
            },
            'readTime': self.read_time,
            'publishDate': self.publish_date,
            'category': self.category,
            'image': self.image,
            'tags': json.loads(self.tags) if self.tags else [],
            'featured': self.featured,
            'intro': self.intro,
            'keyConcepts': json.loads(self.key_concepts) if self.key_concepts else [],
            'implementation': self.implementation,
            'bestPractices': json.loads(self.best_practices) if self.best_practices else [],
            'conclusion': self.conclusion,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    @staticmethod
    def from_dict(data):
        """Create blog post from dictionary"""
        import json
        return BlogPost(
            title=data['title'],
            excerpt=data['excerpt'],
            author_name=data['author']['name'],
            author_avatar=data['author']['avatar'],
            author_role=data['author']['role'],
            author_bio=data['author']['bio'],
            read_time=data['readTime'],
            publish_date=data['publishDate'],
            category=data['category'],
            image=data['image'],
            tags=json.dumps(data.get('tags', [])),
            featured=data.get('featured', False),
            intro=data['intro'],
            key_concepts=json.dumps(data.get('keyConcepts', [])),
            implementation=data['implementation'],
            best_practices=json.dumps(data.get('bestPractices', [])),
            conclusion=data['conclusion']
        ) 