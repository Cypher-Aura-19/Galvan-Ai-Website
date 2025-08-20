from flask import Flask, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, current_user
from flask_cors import CORS

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'galvanai_secret_key'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///galvan_ai.db'
    app.config['SESSION_PERMANENT'] = False
    app.config['REMEMBER_COOKIE_DURATION'] = 0

    # Enable CORS for all routes
    CORS(app, origins=['http://localhost:3000', 'http://192.168.18.18:3000'], supports_credentials=True)

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.session_protection = 'strong'

    from .auth.routes import auth
    from .api import api
    
    app.register_blueprint(auth)
    app.register_blueprint(api)

    with app.app_context():
        from .models.user import User
        from .models.project import Project
        from .models.blog import BlogPost
        from .models.testimonial import Testimonial
        from .models.team import Team
        from .models.career import Career
        from .models.questionnaire import Questionnaire
        from .models.contact_quote import ContactQuote
        from .models.job_application import JobApplication
        db.create_all()

    @app.before_request
    def require_login():
        # Allow API routes without authentication for GET requests
        if request.endpoint and request.endpoint.startswith('api.'):
            if request.method == 'GET':
                return  # Allow GET requests to API
            
            # Allow job application and contact quote submissions without authentication
            if request.endpoint in ['api.create_job_application', 'api.create_contact_quote']:
                return  # Allow these endpoints without authentication
            
            # For other API methods, check if user is authenticated
            if not current_user.is_authenticated:
                return jsonify({'error': 'Authentication required'}), 401
        elif not current_user.is_authenticated and request.endpoint not in ['auth.login', 'static']:
            return redirect(url_for('auth.login'))

    return app
