from app import create_app, db
from app.models.career import Career
import json
from datetime import datetime, timedelta

def add_sample_careers():
    app = create_app()
    
    with app.app_context():
        # Check if careers already exist
        if Career.query.count() > 0:
            print("Careers already exist in the database. Skipping...")
            return

        sample_careers = [
            {
                'title': 'Senior Full-Stack Developer',
                'company': 'Galvan AI',
                'location': 'San Francisco, CA (Hybrid)',
                'type': 'Full-time',
                'department': 'Engineering',
                'description': 'We are looking for a Senior Full-Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications, working with modern technologies, and collaborating with cross-functional teams.',
                'requirements': [
                    '5+ years of experience in full-stack development',
                    'Strong proficiency in React, Node.js, and Python',
                    'Experience with cloud platforms (AWS, Azure, or GCP)',
                    'Knowledge of database design and SQL',
                    'Experience with CI/CD pipelines',
                    'Strong problem-solving and communication skills'
                ],
                'responsibilities': [
                    'Develop and maintain web applications',
                    'Collaborate with product managers and designers',
                    'Write clean, maintainable, and well-documented code',
                    'Participate in code reviews and technical discussions',
                    'Mentor junior developers',
                    'Contribute to technical architecture decisions'
                ],
                'benefits': [
                    'Competitive salary and equity package',
                    'Comprehensive health, dental, and vision insurance',
                    'Flexible work hours and remote work options',
                    'Professional development budget',
                    '401(k) matching',
                    'Unlimited PTO'
                ],
                'salary_range': '$120,000 - $180,000',
                'experience_level': 'Senior',
                'skills_required': ['React', 'Node.js', 'Python', 'AWS', 'PostgreSQL', 'Docker'],
                'application_deadline': (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
                'is_active': True
            },
            {
                'title': 'UX/UI Designer',
                'company': 'Galvan AI',
                'location': 'New York, NY (Remote)',
                'type': 'Full-time',
                'department': 'Design',
                'description': 'Join our design team to create beautiful and intuitive user experiences. You will work closely with product managers and developers to design user interfaces that delight our customers.',
                'requirements': [
                    '3+ years of experience in UX/UI design',
                    'Strong portfolio showcasing web and mobile applications',
                    'Proficiency in Figma, Sketch, or Adobe Creative Suite',
                    'Experience with user research and usability testing',
                    'Knowledge of design systems and component libraries',
                    'Understanding of accessibility principles'
                ],
                'responsibilities': [
                    'Create user-centered designs by understanding business requirements',
                    'Create user flows, wireframes, prototypes, and mockups',
                    'Translate requirements into style guides, design systems, and design patterns',
                    'Create original graphic designs (e.g., images, sketches, and tables)',
                    'Identify and troubleshoot UX problems',
                    'Collaborate with product managers and developers'
                ],
                'benefits': [
                    'Competitive salary and equity package',
                    'Health, dental, and vision insurance',
                    'Remote work flexibility',
                    'Design tools and software provided',
                    'Conference and workshop attendance',
                    'Flexible PTO policy'
                ],
                'salary_range': '$80,000 - $120,000',
                'experience_level': 'Mid-level',
                'skills_required': ['Figma', 'Sketch', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
                'application_deadline': (datetime.now() + timedelta(days=45)).strftime('%Y-%m-%d'),
                'is_active': True
            },
            {
                'title': 'Data Scientist',
                'company': 'Galvan AI',
                'location': 'Austin, TX (On-site)',
                'type': 'Full-time',
                'department': 'Data Science',
                'description': 'We are seeking a Data Scientist to help us build machine learning models and extract insights from our data. You will work on challenging problems and help drive data-driven decisions.',
                'requirements': [
                    'Master\'s degree in Computer Science, Statistics, or related field',
                    '3+ years of experience in data science or machine learning',
                    'Strong programming skills in Python and R',
                    'Experience with machine learning frameworks (TensorFlow, PyTorch)',
                    'Knowledge of statistical analysis and experimental design',
                    'Experience with big data technologies (Spark, Hadoop)'
                ],
                'responsibilities': [
                    'Develop and implement machine learning models',
                    'Analyze large datasets to extract meaningful insights',
                    'Design and conduct A/B tests',
                    'Create data visualizations and reports',
                    'Collaborate with engineering teams to deploy models',
                    'Stay up-to-date with latest research and techniques'
                ],
                'benefits': [
                    'Competitive salary and equity package',
                    'Comprehensive health insurance',
                    'Professional development opportunities',
                    'Conference attendance and training',
                    '401(k) matching',
                    'Relocation assistance'
                ],
                'salary_range': '$100,000 - $150,000',
                'experience_level': 'Mid-level',
                'skills_required': ['Python', 'R', 'TensorFlow', 'PyTorch', 'SQL', 'Spark'],
                'application_deadline': (datetime.now() + timedelta(days=60)).strftime('%Y-%m-%d'),
                'is_active': True
            },
            {
                'title': 'Product Manager',
                'company': 'Galvan AI',
                'location': 'Seattle, WA (Hybrid)',
                'type': 'Full-time',
                'department': 'Product',
                'description': 'Join our product team to help define and execute our product strategy. You will work with cross-functional teams to deliver products that solve real customer problems.',
                'requirements': [
                    '4+ years of experience in product management',
                    'Experience with agile development methodologies',
                    'Strong analytical and problem-solving skills',
                    'Excellent communication and leadership abilities',
                    'Experience with product analytics and user research',
                    'Technical background or ability to work with technical teams'
                ],
                'responsibilities': [
                    'Define product vision, strategy, and roadmap',
                    'Gather and prioritize product requirements',
                    'Work closely with engineering, design, and marketing teams',
                    'Analyze market trends and competitive landscape',
                    'Define and track key product metrics',
                    'Lead product launches and go-to-market strategies'
                ],
                'benefits': [
                    'Competitive salary and equity package',
                    'Health, dental, and vision insurance',
                    'Flexible work arrangements',
                    'Professional development budget',
                    '401(k) matching',
                    'Generous PTO policy'
                ],
                'salary_range': '$110,000 - $160,000',
                'experience_level': 'Senior',
                'skills_required': ['Product Strategy', 'Agile', 'Analytics', 'User Research', 'Go-to-Market'],
                'application_deadline': (datetime.now() + timedelta(days=40)).strftime('%Y-%m-%d'),
                'is_active': True
            },
            {
                'title': 'DevOps Engineer',
                'company': 'Galvan AI',
                'location': 'Remote (US)',
                'type': 'Full-time',
                'department': 'Engineering',
                'description': 'We are looking for a DevOps Engineer to help us build and maintain our infrastructure. You will work on automation, monitoring, and ensuring our systems are reliable and scalable.',
                'requirements': [
                    '3+ years of experience in DevOps or infrastructure engineering',
                    'Experience with cloud platforms (AWS, Azure, or GCP)',
                    'Knowledge of containerization (Docker, Kubernetes)',
                    'Experience with CI/CD pipelines and automation',
                    'Knowledge of monitoring and logging tools',
                    'Experience with infrastructure as code (Terraform, CloudFormation)'
                ],
                'responsibilities': [
                    'Design and implement CI/CD pipelines',
                    'Manage and monitor cloud infrastructure',
                    'Automate deployment and configuration processes',
                    'Ensure system reliability and performance',
                    'Implement security best practices',
                    'Collaborate with development teams'
                ],
                'benefits': [
                    'Competitive salary and equity package',
                    'Comprehensive health insurance',
                    'Remote work flexibility',
                    'Professional development opportunities',
                    '401(k) matching',
                    'Home office setup allowance'
                ],
                'salary_range': '$90,000 - $140,000',
                'experience_level': 'Mid-level',
                'skills_required': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Prometheus'],
                'application_deadline': (datetime.now() + timedelta(days=35)).strftime('%Y-%m-%d'),
                'is_active': True
            },
            {
                'title': 'Marketing Specialist',
                'company': 'Galvan AI',
                'location': 'Los Angeles, CA (Hybrid)',
                'type': 'Full-time',
                'department': 'Marketing',
                'description': 'Join our marketing team to help grow our brand and reach new customers. You will work on digital marketing campaigns, content creation, and brand development.',
                'requirements': [
                    '2+ years of experience in digital marketing',
                    'Experience with social media marketing and content creation',
                    'Knowledge of SEO and SEM principles',
                    'Experience with marketing analytics tools',
                    'Strong writing and communication skills',
                    'Creative mindset and attention to detail'
                ],
                'responsibilities': [
                    'Develop and execute digital marketing campaigns',
                    'Create engaging content for various platforms',
                    'Manage social media presence and engagement',
                    'Analyze marketing performance and optimize campaigns',
                    'Collaborate with design and content teams',
                    'Stay up-to-date with marketing trends and best practices'
                ],
                'benefits': [
                    'Competitive salary and benefits package',
                    'Health, dental, and vision insurance',
                    'Flexible work arrangements',
                    'Professional development opportunities',
                    '401(k) matching',
                    'Creative and collaborative work environment'
                ],
                'salary_range': '$60,000 - $90,000',
                'experience_level': 'Entry-level',
                'skills_required': ['Digital Marketing', 'Social Media', 'SEO', 'Content Creation', 'Analytics'],
                'application_deadline': (datetime.now() + timedelta(days=25)).strftime('%Y-%m-%d'),
                'is_active': True
            }
        ]

        for career_data in sample_careers:
            career = Career(
                title=career_data['title'],
                company=career_data['company'],
                location=career_data['location'],
                type=career_data['type'],
                department=career_data['department'],
                description=career_data['description'],
                requirements=json.dumps(career_data['requirements']),
                responsibilities=json.dumps(career_data['responsibilities']),
                benefits=json.dumps(career_data['benefits']),
                salary_range=career_data['salary_range'],
                experience_level=career_data['experience_level'],
                skills_required=json.dumps(career_data['skills_required']),
                application_deadline=datetime.strptime(career_data['application_deadline'], '%Y-%m-%d').date(),
                is_active=career_data['is_active']
            )
            db.session.add(career)

        db.session.commit()
        print(f"Successfully added {len(sample_careers)} sample careers to the database!")

if __name__ == '__main__':
    add_sample_careers() 