from app import db
from datetime import datetime
import json

class JobApplication(db.Model):
    __tablename__ = 'job_applications'
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.String(255), nullable=False)
    job_title = db.Column(db.String(255), nullable=False)
    applicant_name = db.Column(db.String(255), nullable=False)
    applicant_email = db.Column(db.String(255), nullable=False)
    applicant_phone = db.Column(db.String(50), nullable=False)
    cover_letter = db.Column(db.Text, nullable=False)
    resume = db.Column(db.Text, nullable=True)  # JSON string: fileUrl, fileName, fileSize, fileType
    questionnaire_id = db.Column(db.String(255), nullable=True)
    responses = db.Column(db.Text, nullable=True)  # JSON string: list of {questionId, questionLabel, questionType, answer}
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            '_id': str(self.id),
            'jobId': self.job_id,
            'jobTitle': self.job_title,
            'applicantName': self.applicant_name,
            'applicantEmail': self.applicant_email,
            'applicantPhone': self.applicant_phone,
            'coverLetter': self.cover_letter,
            'resume': json.loads(self.resume) if self.resume else None,
            'questionnaireId': self.questionnaire_id,
            'responses': json.loads(self.responses) if self.responses else [],
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }

    @staticmethod
    def from_dict(data):
        return JobApplication(
            job_id=data['jobId'],
            job_title=data['jobTitle'],
            applicant_name=data['applicantName'],
            applicant_email=data['applicantEmail'],
            applicant_phone=data['applicantPhone'],
            cover_letter=data['coverLetter'],
            resume=json.dumps(data.get('resume')) if data.get('resume') else None,
            questionnaire_id=data.get('questionnaireId'),
            responses=json.dumps(data.get('responses', []))
        )