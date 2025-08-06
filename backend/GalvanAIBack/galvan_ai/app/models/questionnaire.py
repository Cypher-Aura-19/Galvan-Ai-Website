from app import db
from datetime import datetime
import json

class Questionnaire(db.Model):
    __tablename__ = 'questionnaires'
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    questions = db.Column(db.Text, nullable=False)  # JSON string
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'jobId': self.job_id,
            'title': self.title,
            'description': self.description,
            'questions': json.loads(self.questions) if self.questions else [],
            'isActive': self.is_active,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }

    @staticmethod
    def from_dict(data):
        return Questionnaire(
            job_id=data['jobId'],
            title=data['title'],
            description=data['description'],
            questions=json.dumps(data.get('questions', [])),
            is_active=data.get('isActive', True)
        )

    def update_from_dict(self, data):
        if 'jobId' in data:
            self.job_id = data['jobId']
        if 'title' in data:
            self.title = data['title']
        if 'description' in data:
            self.description = data['description']
        if 'questions' in data:
            self.questions = json.dumps(data['questions'])
        if 'isActive' in data:
            self.is_active = data['isActive']
        self.updated_at = datetime.utcnow() 