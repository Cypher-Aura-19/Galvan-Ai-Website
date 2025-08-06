from app import create_app, db
from app.models.questionnaire import Questionnaire
import json

def add_sample_questionnaires():
    app = create_app()
    
    with app.app_context():
        # Sample questionnaire 1 - Software Engineer Application
        questions1 = [
            {
                "id": "q1_1",
                "type": "text",
                "label": "Full Name",
                "placeholder": "Enter your full name",
                "required": True,
                "order": 0,
                "validation": {
                    "minLength": 2,
                    "maxLength": 100
                }
            },
            {
                "id": "q1_2",
                "type": "email",
                "label": "Email Address",
                "placeholder": "your.email@example.com",
                "required": True,
                "order": 1,
                "validation": {
                    "maxLength": 254
                }
            },
            {
                "id": "q1_3",
                "type": "phone",
                "label": "Phone Number",
                "placeholder": "+1 (555) 123-4567",
                "required": True,
                "order": 2
            },
            {
                "id": "q1_4",
                "type": "textarea",
                "label": "Tell us about your experience with Python",
                "placeholder": "Describe your experience with Python programming...",
                "required": True,
                "order": 3,
                "validation": {
                    "minLength": 50,
                    "maxLength": 1000
                }
            },
            {
                "id": "q1_5",
                "type": "select",
                "label": "Years of Experience",
                "required": True,
                "order": 4,
                "options": ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"]
            },
            {
                "id": "q1_6",
                "type": "checkbox",
                "label": "Technologies you're familiar with",
                "required": True,
                "order": 5,
                "options": ["React", "Node.js", "Django", "Flask", "PostgreSQL", "MongoDB", "AWS", "Docker"]
            },
            {
                "id": "q1_7",
                "type": "file",
                "label": "Resume/CV",
                "required": True,
                "order": 6,
                "validation": {
                    "allowedFileTypes": ["pdf", "doc", "docx"],
                    "maxFileSize": 5242880,  # 5MB
                    "maxFiles": 1
                }
            }
        ]

        questionnaire1 = Questionnaire(
            job_id="software-engineer-001",
            title="Software Engineer Application Form",
            description="Complete application form for the Software Engineer position. Please provide detailed information about your experience and skills.",
            questions=json.dumps(questions1),
            is_active=True
        )

        # Sample questionnaire 2 - Marketing Manager Application
        questions2 = [
            {
                "id": "q2_1",
                "type": "text",
                "label": "Full Name",
                "placeholder": "Enter your full name",
                "required": True,
                "order": 0,
                "validation": {
                    "minLength": 2,
                    "maxLength": 100
                }
            },
            {
                "id": "q2_2",
                "type": "email",
                "label": "Email Address",
                "placeholder": "your.email@example.com",
                "required": True,
                "order": 1
            },
            {
                "id": "q2_3",
                "type": "radio",
                "label": "Preferred work arrangement",
                "required": True,
                "order": 2,
                "options": ["Remote", "Hybrid", "On-site"]
            },
            {
                "id": "q2_4",
                "type": "textarea",
                "label": "Describe a successful marketing campaign you led",
                "placeholder": "Provide details about the campaign, results, and your role...",
                "required": True,
                "order": 3,
                "validation": {
                    "minLength": 100,
                    "maxLength": 1500
                }
            },
            {
                "id": "q2_5",
                "type": "number",
                "label": "Years of Marketing Experience",
                "placeholder": "Enter number of years",
                "required": True,
                "order": 4,
                "validation": {
                    "min": 0,
                    "max": 50
                }
            },
            {
                "id": "q2_6",
                "type": "checkbox",
                "label": "Marketing tools you're proficient with",
                "required": True,
                "order": 5,
                "options": ["Google Analytics", "HubSpot", "Mailchimp", "Hootsuite", "Canva", "Adobe Creative Suite", "Facebook Ads", "Google Ads"]
            },
            {
                "id": "q2_7",
                "type": "file",
                "label": "Portfolio (optional)",
                "required": False,
                "order": 6,
                "validation": {
                    "allowedFileTypes": ["pdf", "doc", "docx", "jpg", "png"],
                    "maxFileSize": 10485760,  # 10MB
                    "maxFiles": 3
                }
            }
        ]

        questionnaire2 = Questionnaire(
            job_id="marketing-manager-001",
            title="Marketing Manager Application",
            description="Application form for the Marketing Manager position. Share your marketing experience and campaign successes.",
            questions=json.dumps(questions2),
            is_active=True
        )

        # Sample questionnaire 3 - Data Analyst Application
        questions3 = [
            {
                "id": "q3_1",
                "type": "text",
                "label": "Full Name",
                "placeholder": "Enter your full name",
                "required": True,
                "order": 0
            },
            {
                "id": "q3_2",
                "type": "email",
                "label": "Email Address",
                "placeholder": "your.email@example.com",
                "required": True,
                "order": 1
            },
            {
                "id": "q3_3",
                "type": "select",
                "label": "Highest Education Level",
                "required": True,
                "order": 2,
                "options": ["High School", "Bachelor's Degree", "Master's Degree", "PhD", "Other"]
            },
            {
                "id": "q3_4",
                "type": "textarea",
                "label": "Describe your experience with data analysis tools",
                "placeholder": "Tell us about your experience with SQL, Python, R, Tableau, etc...",
                "required": True,
                "order": 3,
                "validation": {
                    "minLength": 75,
                    "maxLength": 800
                }
            },
            {
                "id": "q3_5",
                "type": "checkbox",
                "label": "Programming languages you know",
                "required": True,
                "order": 4,
                "options": ["Python", "R", "SQL", "JavaScript", "Java", "Scala", "Julia"]
            },
            {
                "id": "q3_6",
                "type": "checkbox",
                "label": "Data visualization tools",
                "required": True,
                "order": 5,
                "options": ["Tableau", "Power BI", "Looker", "D3.js", "Plotly", "Matplotlib", "Seaborn"]
            },
            {
                "id": "q3_7",
                "type": "file",
                "label": "Sample Analysis Report",
                "placeholder": "Upload a sample of your work",
                "required": True,
                "order": 6,
                "validation": {
                    "allowedFileTypes": ["pdf", "doc", "docx", "xlsx", "pptx"],
                    "maxFileSize": 10485760,  # 10MB
                    "maxFiles": 2
                }
            }
        ]

        questionnaire3 = Questionnaire(
            job_id="data-analyst-001",
            title="Data Analyst Application Form",
            description="Application form for the Data Analyst position. Showcase your analytical skills and experience.",
            questions=json.dumps(questions3),
            is_active=False  # Inactive for testing
        )

        # Add all questionnaires to database
        db.session.add(questionnaire1)
        db.session.add(questionnaire2)
        db.session.add(questionnaire3)
        
        try:
            db.session.commit()
            print("✅ Sample questionnaires added successfully!")
            print(f"📝 Added {Questionnaire.query.count()} questionnaires")
            
            # Print details
            for q in Questionnaire.query.all():
                questions = json.loads(q.questions)
                print(f"  - {q.title} ({len(questions)} questions, {'Active' if q.is_active else 'Inactive'})")
                
        except Exception as e:
            print(f"❌ Error adding sample questionnaires: {e}")
            db.session.rollback()

if __name__ == "__main__":
    add_sample_questionnaires() 