from app import db
from datetime import datetime

class ContactQuote(db.Model):
    __tablename__ = 'contact_quotes'
    __table_args__ = (
        db.Index('ix_contact_created_at', 'created_at'),
    )
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255), nullable=False)
    project_details = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            '_id': str(self.id),
            'name': self.name,
            'email': self.email,
            'company': self.company,
            'projectDetails': self.project_details,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }

    @staticmethod
    def from_dict(data):
        return ContactQuote(
            name=data['name'],
            email=data['email'],
            company=data['company'],
            project_details=data['projectDetails']
        )

    def update_from_dict(self, data):
        if 'name' in data:
            self.name = data['name']
        if 'email' in data:
            self.email = data['email']
        if 'company' in data:
            self.company = data['company']
        if 'projectDetails' in data:
            self.project_details = data['projectDetails']