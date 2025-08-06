from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.project import Project
from app.models.blog import BlogPost
from app.models.testimonial import Testimonial
from app.models.team import Team
from app.models.career import Career
from app.models.questionnaire import Questionnaire
from app.models.contact_quote import ContactQuote
from app.models.job_application import JobApplication
import json

api = Blueprint('api', __name__)

@api.route('/api/projects', methods=['GET'])
def get_projects():
    """Get all projects"""
    try:
        projects = Project.query.order_by(Project.created_at.desc()).all()
        return jsonify([project.to_dict() for project in projects])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/projects/best', methods=['GET'])
def get_best_projects():
    """Get only best projects"""
    try:
        best_projects = Project.query.filter_by(best_project=True).order_by(Project.created_at.desc()).all()
        return jsonify([project.to_dict() for project in best_projects])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/projects', methods=['POST'])
@login_required
def create_project():
    """Create a new project"""
    try:
        data = request.get_json()
        
        # Comprehensive validation
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate hero section
        if not data.get('hero') or not isinstance(data['hero'], dict):
            return jsonify({'error': 'Hero section is required and must be an object'}), 400
        
        hero = data['hero']
        if not hero.get('subtitle') or not isinstance(hero['subtitle'], str):
            return jsonify({'error': 'Hero subtitle is required and must be a string'}), 400
        
        if not hero.get('description') or not isinstance(hero['description'], str):
            return jsonify({'error': 'Hero description is required and must be a string'}), 400
        
        if not hero.get('banner') or not isinstance(hero['banner'], str):
            return jsonify({'error': 'Hero banner is required and must be a string'}), 400
        
        # Validate long description
        if not data.get('longDescription') or not isinstance(data['longDescription'], str):
            return jsonify({'error': 'Long description is required and must be a string'}), 400
        
        # Validate arrays
        if not isinstance(data.get('gallery', []), list):
            return jsonify({'error': 'Gallery must be an array'}), 400
        
        if not isinstance(data.get('features', []), list):
            return jsonify({'error': 'Features must be an array'}), 400
        
        if not isinstance(data.get('team', []), list):
            return jsonify({'error': 'Team must be an array'}), 400
        
        if not isinstance(data.get('timeline', []), list):
            return jsonify({'error': 'Timeline must be an array'}), 400
        
        if not isinstance(data.get('testimonials', []), list):
            return jsonify({'error': 'Testimonials must be an array'}), 400
        
        if not isinstance(data.get('technologies', []), list):
            return jsonify({'error': 'Technologies must be an array'}), 400
        
        # Validate team members structure
        for i, member in enumerate(data.get('team', [])):
            if not isinstance(member, dict):
                return jsonify({'error': f'Team member {i+1} must be an object'}), 400
            if not member.get('name') or not isinstance(member['name'], str):
                return jsonify({'error': f'Team member {i+1} name is required and must be a string'}), 400
            if not member.get('role') or not isinstance(member['role'], str):
                return jsonify({'error': f'Team member {i+1} role is required and must be a string'}), 400
            if not member.get('avatar') or not isinstance(member['avatar'], str):
                return jsonify({'error': f'Team member {i+1} avatar is required and must be a string'}), 400
        
        # Validate timeline items structure
        for i, item in enumerate(data.get('timeline', [])):
            if not isinstance(item, dict):
                return jsonify({'error': f'Timeline item {i+1} must be an object'}), 400
            if not item.get('phase') or not isinstance(item['phase'], str):
                return jsonify({'error': f'Timeline item {i+1} phase is required and must be a string'}), 400
            if not item.get('date') or not isinstance(item['date'], str):
                return jsonify({'error': f'Timeline item {i+1} date is required and must be a string'}), 400
        
        # Validate testimonials structure
        for i, testimonial in enumerate(data.get('testimonials', [])):
            if not isinstance(testimonial, dict):
                return jsonify({'error': f'Testimonial {i+1} must be an object'}), 400
            if not testimonial.get('quote') or not isinstance(testimonial['quote'], str):
                return jsonify({'error': f'Testimonial {i+1} quote is required and must be a string'}), 400
            if not testimonial.get('author') or not isinstance(testimonial['author'], str):
                return jsonify({'error': f'Testimonial {i+1} author is required and must be a string'}), 400
        
        # Check best project limit
        if data.get('bestProject'):
            best_projects_count = Project.query.filter_by(best_project=True).count()
            if best_projects_count >= 4:
                return jsonify({'error': 'Maximum of 4 best projects allowed'}), 400
        
        # Create project
        project = Project.from_dict(data)
        db.session.add(project)
        db.session.commit()
        
        return jsonify({'success': True, 'id': project.id, 'message': 'Project created successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/projects/<int:project_id>', methods=['PUT'])
@login_required
def update_project(project_id):
    """Update an existing project"""
    try:
        project = Project.query.get_or_404(project_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Check best project limit if setting to true
        if data.get('bestProject') and not project.best_project:
            best_projects_count = Project.query.filter_by(best_project=True).count()
            if best_projects_count >= 4:
                return jsonify({'error': 'Maximum of 4 best projects allowed'}), 400
        
        # Update fields with validation
        if 'hero' in data:
            if not isinstance(data['hero'], dict):
                return jsonify({'error': 'Hero must be an object'}), 400
            
            if 'subtitle' in data['hero']:
                if not isinstance(data['hero']['subtitle'], str):
                    return jsonify({'error': 'Hero subtitle must be a string'}), 400
                project.hero_subtitle = data['hero']['subtitle']
            
            if 'description' in data['hero']:
                if not isinstance(data['hero']['description'], str):
                    return jsonify({'error': 'Hero description must be a string'}), 400
                project.hero_description = data['hero']['description']
            
            if 'banner' in data['hero']:
                if not isinstance(data['hero']['banner'], str):
                    return jsonify({'error': 'Hero banner must be a string'}), 400
                project.hero_banner = data['hero']['banner']
        
        if 'gallery' in data:
            if not isinstance(data['gallery'], list):
                return jsonify({'error': 'Gallery must be an array'}), 400
            project.gallery = json.dumps(data['gallery'])
        
        if 'features' in data:
            if not isinstance(data['features'], list):
                return jsonify({'error': 'Features must be an array'}), 400
            project.features = json.dumps(data['features'])
        
        if 'team' in data:
            if not isinstance(data['team'], list):
                return jsonify({'error': 'Team must be an array'}), 400
            # Validate team structure
            for i, member in enumerate(data['team']):
                if not isinstance(member, dict):
                    return jsonify({'error': f'Team member {i+1} must be an object'}), 400
                if not member.get('name') or not isinstance(member['name'], str):
                    return jsonify({'error': f'Team member {i+1} name is required and must be a string'}), 400
                if not member.get('role') or not isinstance(member['role'], str):
                    return jsonify({'error': f'Team member {i+1} role is required and must be a string'}), 400
                if not member.get('avatar') or not isinstance(member['avatar'], str):
                    return jsonify({'error': f'Team member {i+1} avatar is required and must be a string'}), 400
            project.team = json.dumps(data['team'])
        
        if 'timeline' in data:
            if not isinstance(data['timeline'], list):
                return jsonify({'error': 'Timeline must be an array'}), 400
            # Validate timeline structure
            for i, item in enumerate(data['timeline']):
                if not isinstance(item, dict):
                    return jsonify({'error': f'Timeline item {i+1} must be an object'}), 400
                if not item.get('phase') or not isinstance(item['phase'], str):
                    return jsonify({'error': f'Timeline item {i+1} phase is required and must be a string'}), 400
                if not item.get('date') or not isinstance(item['date'], str):
                    return jsonify({'error': f'Timeline item {i+1} date is required and must be a string'}), 400
            project.timeline = json.dumps(data['timeline'])
        
        if 'testimonials' in data:
            if not isinstance(data['testimonials'], list):
                return jsonify({'error': 'Testimonials must be an array'}), 400
            # Validate testimonials structure
            for i, testimonial in enumerate(data['testimonials']):
                if not isinstance(testimonial, dict):
                    return jsonify({'error': f'Testimonial {i+1} must be an object'}), 400
                if not testimonial.get('quote') or not isinstance(testimonial['quote'], str):
                    return jsonify({'error': f'Testimonial {i+1} quote is required and must be a string'}), 400
                if not testimonial.get('author') or not isinstance(testimonial['author'], str):
                    return jsonify({'error': f'Testimonial {i+1} author is required and must be a string'}), 400
            project.testimonials = json.dumps(data['testimonials'])
        
        if 'technologies' in data:
            if not isinstance(data['technologies'], list):
                return jsonify({'error': 'Technologies must be an array'}), 400
            project.technologies = json.dumps(data['technologies'])
        
        if 'longDescription' in data:
            if not isinstance(data['longDescription'], str):
                return jsonify({'error': 'Long description must be a string'}), 400
            project.long_description = data['longDescription']
        
        if 'bestProject' in data:
            if not isinstance(data['bestProject'], bool):
                return jsonify({'error': 'Best project must be a boolean'}), 400
            project.best_project = data['bestProject']
        
        db.session.commit()
        return jsonify({'success': True, 'message': 'Project updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/projects/<int:project_id>', methods=['DELETE'])
@login_required
def delete_project(project_id):
    """Delete a project"""
    try:
        project = Project.query.get_or_404(project_id)
        db.session.delete(project)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Project deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    """Get a specific project"""
    try:
        project = Project.query.get_or_404(project_id)
        return jsonify(project.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Blog Posts API Routes
@api.route('/api/blog-posts', methods=['GET'])
def get_blog_posts():
    """Get all blog posts"""
    try:
        posts = BlogPost.query.order_by(BlogPost.created_at.desc()).all()
        return jsonify([post.to_dict() for post in posts])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/blog-posts/featured', methods=['GET'])
def get_featured_blog_posts():
    """Get only featured blog posts"""
    try:
        featured_posts = BlogPost.query.filter_by(featured=True).order_by(BlogPost.created_at.desc()).all()
        return jsonify([post.to_dict() for post in featured_posts])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/blog-posts', methods=['POST'])
@login_required
def create_blog_post():
    """Create a new blog post"""
    try:
        data = request.get_json()
        
        # Comprehensive validation
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate required fields
        if not data.get('title') or not isinstance(data['title'], str):
            return jsonify({'error': 'Title is required and must be a string'}), 400
        
        if not data.get('excerpt') or not isinstance(data['excerpt'], str):
            return jsonify({'error': 'Excerpt is required and must be a string'}), 400
        
        # Validate author object
        if not data.get('author') or not isinstance(data['author'], dict):
            return jsonify({'error': 'Author is required and must be an object'}), 400
        
        author = data['author']
        if not author.get('name') or not isinstance(author['name'], str):
            return jsonify({'error': 'Author name is required and must be a string'}), 400
        
        if not author.get('avatar') or not isinstance(author['avatar'], str):
            return jsonify({'error': 'Author avatar is required and must be a string'}), 400
        
        if not author.get('role') or not isinstance(author['role'], str):
            return jsonify({'error': 'Author role is required and must be a string'}), 400
        
        if not author.get('bio') or not isinstance(author['bio'], str):
            return jsonify({'error': 'Author bio is required and must be a string'}), 400
        
        # Validate other required fields
        if not data.get('readTime') or not isinstance(data['readTime'], str):
            return jsonify({'error': 'Read time is required and must be a string'}), 400
        
        if not data.get('publishDate') or not isinstance(data['publishDate'], str):
            return jsonify({'error': 'Publish date is required and must be a string'}), 400
        
        if not data.get('category') or not isinstance(data['category'], str):
            return jsonify({'error': 'Category is required and must be a string'}), 400
        
        if not data.get('image') or not isinstance(data['image'], str):
            return jsonify({'error': 'Image is required and must be a string'}), 400
        
        if not data.get('intro') or not isinstance(data['intro'], str):
            return jsonify({'error': 'Intro is required and must be a string'}), 400
        
        if not data.get('implementation') or not isinstance(data['implementation'], str):
            return jsonify({'error': 'Implementation is required and must be a string'}), 400
        
        if not data.get('conclusion') or not isinstance(data['conclusion'], str):
            return jsonify({'error': 'Conclusion is required and must be a string'}), 400
        
        # Validate arrays
        if not isinstance(data.get('tags', []), list):
            return jsonify({'error': 'Tags must be an array'}), 400
        
        if not isinstance(data.get('keyConcepts', []), list):
            return jsonify({'error': 'Key concepts must be an array'}), 400
        
        if not isinstance(data.get('bestPractices', []), list):
            return jsonify({'error': 'Best practices must be an array'}), 400
        
        # Create blog post
        blog_post = BlogPost.from_dict(data)
        db.session.add(blog_post)
        db.session.commit()
        
        return jsonify({'success': True, 'id': blog_post.id, 'message': 'Blog post created successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/blog-posts/<int:post_id>', methods=['PUT'])
@login_required
def update_blog_post(post_id):
    """Update an existing blog post"""
    try:
        blog_post = BlogPost.query.get_or_404(post_id)
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update fields with validation
        if 'title' in data:
            if not isinstance(data['title'], str):
                return jsonify({'error': 'Title must be a string'}), 400
            blog_post.title = data['title']
        
        if 'excerpt' in data:
            if not isinstance(data['excerpt'], str):
                return jsonify({'error': 'Excerpt must be a string'}), 400
            blog_post.excerpt = data['excerpt']
        
        if 'author' in data:
            if not isinstance(data['author'], dict):
                return jsonify({'error': 'Author must be an object'}), 400
            
            author = data['author']
            if 'name' in author:
                if not isinstance(author['name'], str):
                    return jsonify({'error': 'Author name must be a string'}), 400
                blog_post.author_name = author['name']
            
            if 'avatar' in author:
                if not isinstance(author['avatar'], str):
                    return jsonify({'error': 'Author avatar must be a string'}), 400
                blog_post.author_avatar = author['avatar']
            
            if 'role' in author:
                if not isinstance(author['role'], str):
                    return jsonify({'error': 'Author role must be a string'}), 400
                blog_post.author_role = author['role']
            
            if 'bio' in author:
                if not isinstance(author['bio'], str):
                    return jsonify({'error': 'Author bio must be a string'}), 400
                blog_post.author_bio = author['bio']
        
        if 'readTime' in data:
            if not isinstance(data['readTime'], str):
                return jsonify({'error': 'Read time must be a string'}), 400
            blog_post.read_time = data['readTime']
        
        if 'publishDate' in data:
            if not isinstance(data['publishDate'], str):
                return jsonify({'error': 'Publish date must be a string'}), 400
            blog_post.publish_date = data['publishDate']
        
        if 'category' in data:
            if not isinstance(data['category'], str):
                return jsonify({'error': 'Category must be a string'}), 400
            blog_post.category = data['category']
        
        if 'image' in data:
            if not isinstance(data['image'], str):
                return jsonify({'error': 'Image must be a string'}), 400
            blog_post.image = data['image']
        
        if 'tags' in data:
            if not isinstance(data['tags'], list):
                return jsonify({'error': 'Tags must be an array'}), 400
            blog_post.tags = json.dumps(data['tags'])
        
        if 'featured' in data:
            if not isinstance(data['featured'], bool):
                return jsonify({'error': 'Featured must be a boolean'}), 400
            blog_post.featured = data['featured']
        
        if 'intro' in data:
            if not isinstance(data['intro'], str):
                return jsonify({'error': 'Intro must be a string'}), 400
            blog_post.intro = data['intro']
        
        if 'keyConcepts' in data:
            if not isinstance(data['keyConcepts'], list):
                return jsonify({'error': 'Key concepts must be an array'}), 400
            blog_post.key_concepts = json.dumps(data['keyConcepts'])
        
        if 'implementation' in data:
            if not isinstance(data['implementation'], str):
                return jsonify({'error': 'Implementation must be a string'}), 400
            blog_post.implementation = data['implementation']
        
        if 'bestPractices' in data:
            if not isinstance(data['bestPractices'], list):
                return jsonify({'error': 'Best practices must be an array'}), 400
            blog_post.best_practices = json.dumps(data['bestPractices'])
        
        if 'conclusion' in data:
            if not isinstance(data['conclusion'], str):
                return jsonify({'error': 'Conclusion must be a string'}), 400
            blog_post.conclusion = data['conclusion']
        
        db.session.commit()
        return jsonify({'success': True, 'message': 'Blog post updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/blog-posts/<int:post_id>', methods=['DELETE'])
@login_required
def delete_blog_post(post_id):
    """Delete a blog post"""
    try:
        blog_post = BlogPost.query.get_or_404(post_id)
        db.session.delete(blog_post)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Blog post deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/blog-posts/<int:post_id>', methods=['GET'])
def get_blog_post(post_id):
    """Get a specific blog post"""
    try:
        blog_post = BlogPost.query.get_or_404(post_id)
        return jsonify(blog_post.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Testimonials API Routes
@api.route('/api/testimonials', methods=['GET'])
def get_testimonials():
    """Get all testimonials"""
    try:
        testimonials = Testimonial.query.order_by(Testimonial.created_at.desc()).all()
        return jsonify([testimonial.to_dict() for testimonial in testimonials])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/testimonials/featured', methods=['GET'])
def get_featured_testimonials():
    """Get only featured testimonials"""
    try:
        featured_testimonials = Testimonial.query.filter_by(featured=True).order_by(Testimonial.created_at.desc()).all()
        return jsonify([testimonial.to_dict() for testimonial in featured_testimonials])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/testimonials', methods=['POST'])
@login_required
def create_testimonial():
    """Create a new testimonial"""
    try:
        data = request.get_json()
        
        # Validation
        if not data.get('name') or not isinstance(data['name'], str):
            return jsonify({'error': 'Name is required and must be a string'}), 400
        
        if not data.get('role') or not isinstance(data['role'], str):
            return jsonify({'error': 'Role is required and must be a string'}), 400
        
        if not data.get('company') or not isinstance(data['company'], str):
            return jsonify({'error': 'Company is required and must be a string'}), 400
        
        if not data.get('avatar') or not isinstance(data['avatar'], str):
            return jsonify({'error': 'Avatar is required and must be a string'}), 400
        
        if not data.get('title') or not isinstance(data['title'], str):
            return jsonify({'error': 'Title is required and must be a string'}), 400
        
        if not data.get('content') or not isinstance(data['content'], str):
            return jsonify({'error': 'Content is required and must be a string'}), 400
        
        if not isinstance(data.get('rating'), int) or data['rating'] < 1 or data['rating'] > 5:
            return jsonify({'error': 'Rating must be a number between 1 and 5'}), 400
        
        if 'longContent' in data and not isinstance(data['longContent'], str):
            return jsonify({'error': 'Long content must be a string'}), 400
        
        if 'featured' in data and not isinstance(data['featured'], bool):
            return jsonify({'error': 'Featured must be a boolean'}), 400
        
        if 'tags' in data and not isinstance(data['tags'], list):
            return jsonify({'error': 'Tags must be an array'}), 400
        
        testimonial = Testimonial.from_dict(data)
        db.session.add(testimonial)
        db.session.commit()
        return jsonify({'success': True, 'id': testimonial.id, 'message': 'Testimonial created successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/testimonials/<int:testimonial_id>', methods=['PUT'])
@login_required
def update_testimonial(testimonial_id):
    """Update an existing testimonial"""
    try:
        testimonial = Testimonial.query.get_or_404(testimonial_id)
        data = request.get_json()
        
        # Update fields with validation
        if 'name' in data:
            if not isinstance(data['name'], str):
                return jsonify({'error': 'Name must be a string'}), 400
            testimonial.name = data['name']
        
        if 'role' in data:
            if not isinstance(data['role'], str):
                return jsonify({'error': 'Role must be a string'}), 400
            testimonial.role = data['role']
        
        if 'company' in data:
            if not isinstance(data['company'], str):
                return jsonify({'error': 'Company must be a string'}), 400
            testimonial.company = data['company']
        
        if 'avatar' in data:
            if not isinstance(data['avatar'], str):
                return jsonify({'error': 'Avatar must be a string'}), 400
            testimonial.avatar = data['avatar']
        
        if 'title' in data:
            if not isinstance(data['title'], str):
                return jsonify({'error': 'Title must be a string'}), 400
            testimonial.title = data['title']
        
        if 'content' in data:
            if not isinstance(data['content'], str):
                return jsonify({'error': 'Content must be a string'}), 400
            testimonial.content = data['content']
        
        if 'longContent' in data:
            if not isinstance(data['longContent'], str):
                return jsonify({'error': 'Long content must be a string'}), 400
            testimonial.long_content = data['longContent']
        
        if 'rating' in data:
            if not isinstance(data['rating'], int) or data['rating'] < 1 or data['rating'] > 5:
                return jsonify({'error': 'Rating must be a number between 1 and 5'}), 400
            testimonial.rating = data['rating']
        
        if 'featured' in data:
            if not isinstance(data['featured'], bool):
                return jsonify({'error': 'Featured must be a boolean'}), 400
            testimonial.featured = data['featured']
        
        if 'tags' in data:
            if not isinstance(data['tags'], list):
                return jsonify({'error': 'Tags must be an array'}), 400
            testimonial.tags = json.dumps(data['tags'])
        
        db.session.commit()
        return jsonify({'success': True, 'message': 'Testimonial updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/testimonials/<int:testimonial_id>', methods=['DELETE'])
@login_required
def delete_testimonial(testimonial_id):
    """Delete a testimonial"""
    try:
        testimonial = Testimonial.query.get_or_404(testimonial_id)
        db.session.delete(testimonial)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Testimonial deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/testimonials/<int:testimonial_id>', methods=['GET'])
def get_testimonial(testimonial_id):
    """Get a specific testimonial"""
    try:
        testimonial = Testimonial.query.get_or_404(testimonial_id)
        return jsonify(testimonial.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Team Routes
@api.route('/api/teams', methods=['GET'])
def get_teams():
    """Get all team members"""
    try:
        teams = Team.query.all()
        return jsonify([team.to_dict() for team in teams])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/teams', methods=['POST'])
@login_required
def create_team():
    """Create a new team member"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate required fields
        required_fields = ['name', 'role', 'avatar', 'bio', 'email', 'department', 'position']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Validate email format
        if '@' not in data['email']:
            return jsonify({'error': 'Invalid email format'}), 400

        # Validate skills array
        if 'skills' in data and not isinstance(data['skills'], list):
            return jsonify({'error': 'Skills must be an array'}), 400

        # Validate array fields
        array_fields = ['background_interests', 'awards', 'certifications', 'languages']
        for field in array_fields:
            if field in data and not isinstance(data[field], list):
                return jsonify({'error': f'{field} must be an array'}), 400

        # Validate social media URLs
        social_fields = ['linkedin', 'github', 'twitter', 'website']
        for field in social_fields:
            if data.get(field) and not data[field].startswith(('http://', 'https://')):
                return jsonify({'error': f'{field} must be a valid URL'}), 400

        team = Team.from_dict(data)
        db.session.add(team)
        db.session.commit()
        
        return jsonify({'success': True, 'id': team.id, 'message': 'Team member created successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/teams/<int:team_id>', methods=['PUT'])
@login_required
def update_team(team_id):
    """Update a team member"""
    try:
        team = Team.query.get(team_id)
        if not team:
            return jsonify({'error': 'Team member not found'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate required fields
        required_fields = ['name', 'role', 'avatar', 'bio', 'email', 'department', 'position']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Validate email format
        if '@' not in data['email']:
            return jsonify({'error': 'Invalid email format'}), 400

        # Validate skills array
        if 'skills' in data and not isinstance(data['skills'], list):
            return jsonify({'error': 'Skills must be an array'}), 400

        # Validate array fields
        array_fields = ['background_interests', 'awards', 'certifications', 'languages']
        for field in array_fields:
            if field in data and not isinstance(data[field], list):
                return jsonify({'error': f'{field} must be an array'}), 400

        # Validate social media URLs
        social_fields = ['linkedin', 'github', 'twitter', 'website']
        for field in social_fields:
            if data.get(field) and not data[field].startswith(('http://', 'https://')):
                return jsonify({'error': f'{field} must be a valid URL'}), 400

        # Update fields
        team.name = data['name']
        team.role = data['role']
        team.avatar = data['avatar']
        team.bio = data['bio']
        team.email = data['email']
        team.linkedin = data.get('linkedin', '')
        team.github = data.get('github', '')
        team.twitter = data.get('twitter', '')
        team.website = data.get('website', '')
        team.department = data['department']
        team.position = data['position']
        team.skills = json.dumps(data.get('skills', []))
        team.background_interests = json.dumps(data.get('background_interests', []))
        team.awards = json.dumps(data.get('awards', []))
        team.certifications = json.dumps(data.get('certifications', []))
        team.location = data.get('location', '')
        team.languages = json.dumps(data.get('languages', []))
        team.fun_fact = data.get('fun_fact', '')
        team.quote = data.get('quote', '')

        db.session.commit()
        return jsonify({'success': True, 'message': 'Team member updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/teams/<int:team_id>', methods=['DELETE'])
@login_required
def delete_team(team_id):
    """Delete a team member"""
    try:
        team = Team.query.get(team_id)
        if not team:
            return jsonify({'error': 'Team member not found'}), 404

        db.session.delete(team)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Team member deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/teams/<int:team_id>', methods=['GET'])
def get_team(team_id):
    """Get a specific team member"""
    try:
        team = Team.query.get(team_id)
        if not team:
            return jsonify({'error': 'Team member not found'}), 404

        return jsonify(team.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Career Routes
@api.route('/api/careers', methods=['GET'])
def get_careers():
    """Get all careers"""
    try:
        careers = Career.query.all()
        return jsonify([career.to_dict() for career in careers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/careers/active', methods=['GET'])
def get_active_careers():
    """Get active careers only"""
    try:
        active_careers = Career.query.filter_by(is_active=True).all()
        return jsonify([career.to_dict() for career in active_careers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/careers', methods=['POST'])
@login_required
def create_career():
    """Create a new career"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate required fields
        required_fields = ['title', 'company', 'location', 'type', 'department', 'description']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Validate arrays
        array_fields = ['requirements', 'responsibilities', 'benefits', 'skills_required']
        for field in array_fields:
            if field in data and not isinstance(data[field], list):
                return jsonify({'error': f'{field} must be an array'}), 400

        # Validate date format
        if data.get('application_deadline'):
            try:
                from datetime import datetime
                datetime.strptime(data['application_deadline'], '%Y-%m-%d')
            except:
                return jsonify({'error': 'application_deadline must be in YYYY-MM-DD format'}), 400

        career = Career.from_dict(data)
        db.session.add(career)
        db.session.commit()
        
        return jsonify({'success': True, 'id': career.id, 'message': 'Career created successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/careers/<int:career_id>', methods=['PUT'])
@login_required
def update_career(career_id):
    """Update a career"""
    try:
        career = Career.query.get(career_id)
        if not career:
            return jsonify({'error': 'Career not found'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate required fields
        required_fields = ['title', 'company', 'location', 'type', 'department', 'description']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400

        # Validate arrays
        array_fields = ['requirements', 'responsibilities', 'benefits', 'skills_required']
        for field in array_fields:
            if field in data and not isinstance(data[field], list):
                return jsonify({'error': f'{field} must be an array'}), 400

        # Validate date format
        if data.get('application_deadline'):
            try:
                from datetime import datetime
                datetime.strptime(data['application_deadline'], '%Y-%m-%d')
            except:
                return jsonify({'error': 'application_deadline must be in YYYY-MM-DD format'}), 400

        # Update fields
        career.title = data['title']
        career.company = data['company']
        career.location = data['location']
        career.type = data['type']
        career.department = data['department']
        career.description = data['description']
        career.requirements = json.dumps(data.get('requirements', []))
        career.responsibilities = json.dumps(data.get('responsibilities', []))
        career.benefits = json.dumps(data.get('benefits', []))
        career.salary_range = data.get('salary_range', '')
        career.experience_level = data.get('experience_level', '')
        career.skills_required = json.dumps(data.get('skills_required', []))
        career.is_active = data.get('is_active', True)

        # Update application deadline
        if data.get('application_deadline'):
            from datetime import datetime
            career.application_deadline = datetime.strptime(data['application_deadline'], '%Y-%m-%d').date()
        else:
            career.application_deadline = None

        db.session.commit()
        return jsonify({'success': True, 'message': 'Career updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/careers/<int:career_id>', methods=['DELETE'])
@login_required
def delete_career(career_id):
    """Delete a career"""
    try:
        career = Career.query.get(career_id)
        if not career:
            return jsonify({'error': 'Career not found'}), 404

        db.session.delete(career)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Career deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/careers/<int:career_id>', methods=['GET'])
def get_career(career_id):
    """Get a specific career"""
    try:
        career = Career.query.get(career_id)
        if not career:
            return jsonify({'error': 'Career not found'}), 404

        return jsonify(career.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ==================== QUESTIONNAIRE ROUTES ====================

@api.route('/api/questionnaires', methods=['GET'])
def get_questionnaires():
    """Get all questionnaires"""
    try:
        job_id = request.args.get('jobId')
        if job_id:
            questionnaires = Questionnaire.query.filter_by(job_id=job_id).order_by(Questionnaire.created_at.desc()).all()
        else:
            questionnaires = Questionnaire.query.order_by(Questionnaire.created_at.desc()).all()
        return jsonify([questionnaire.to_dict() for questionnaire in questionnaires])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/questionnaires/active', methods=['GET'])
def get_active_questionnaires():
    """Get only active questionnaires"""
    try:
        questionnaires = Questionnaire.query.filter_by(is_active=True).order_by(Questionnaire.created_at.desc()).all()
        return jsonify([questionnaire.to_dict() for questionnaire in questionnaires])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/questionnaires', methods=['POST'])
@login_required
def create_questionnaire():
    """Create a new questionnaire"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate required fields
        if not data.get('jobId') or not isinstance(data['jobId'], str) or data['jobId'].strip() == '':
            return jsonify({'error': 'Job ID is required and must be a string'}), 400

        if not data.get('title') or not isinstance(data['title'], str) or data['title'].strip() == '':
            return jsonify({'error': 'Title is required and must be a string'}), 400

        if not data.get('description') or not isinstance(data['description'], str) or data['description'].strip() == '':
            return jsonify({'error': 'Description is required and must be a string'}), 400

        # Validate questions array
        if not isinstance(data.get('questions', []), list) or len(data['questions']) == 0:
            return jsonify({'error': 'At least one question is required'}), 400

        # Validate each question
        for i, question in enumerate(data['questions']):
            if not isinstance(question, dict):
                return jsonify({'error': f'Question {i+1} must be an object'}), 400

            # Required question fields
            if not question.get('id') or not isinstance(question['id'], str):
                return jsonify({'error': f'Question {i+1} ID is required and must be a string'}), 400

            if not question.get('type') or not isinstance(question['type'], str):
                return jsonify({'error': f'Question {i+1} type is required and must be a string'}), 400

            if not question.get('label') or not isinstance(question['label'], str):
                return jsonify({'error': f'Question {i+1} label is required and must be a string'}), 400

            # Validate question type
            valid_types = ['text', 'textarea', 'select', 'radio', 'checkbox', 'file', 'email', 'phone', 'number', 'date']
            if question['type'] not in valid_types:
                return jsonify({'error': f'Question {i+1} type must be one of: {", ".join(valid_types)}'}), 400

            # Validate required field
            if not isinstance(question.get('required', False), bool):
                return jsonify({'error': f'Question {i+1} required field must be a boolean'}), 400

            # Validate order
            if not isinstance(question.get('order', 0), int):
                return jsonify({'error': f'Question {i+1} order must be an integer'}), 400

            # Validate options for select/radio/checkbox types
            if question['type'] in ['select', 'radio', 'checkbox']:
                if not isinstance(question.get('options', []), list) or len(question['options']) == 0:
                    return jsonify({'error': f'Question {i+1} ({question["type"]}) requires at least one option'}), 400
                
                # Validate each option
                for j, option in enumerate(question['options']):
                    if not isinstance(option, str) or option.strip() == '':
                        return jsonify({'error': f'Question {i+1} option {j+1} must be a non-empty string'}), 400

            # Validate validation object
            if 'validation' in question:
                if not isinstance(question['validation'], dict):
                    return jsonify({'error': f'Question {i+1} validation must be an object'}), 400

                validation = question['validation']

                # Validate text input restrictions
                if question['type'] in ['text', 'textarea', 'email']:
                    if 'minLength' in validation and (not isinstance(validation['minLength'], int) or validation['minLength'] < 0):
                        return jsonify({'error': f'Question {i+1} minLength must be a non-negative integer'}), 400
                    
                    if 'maxLength' in validation and (not isinstance(validation['maxLength'], int) or validation['maxLength'] <= 0):
                        return jsonify({'error': f'Question {i+1} maxLength must be a positive integer'}), 400
                    
                    if 'minLength' in validation and 'maxLength' in validation and validation['minLength'] > validation['maxLength']:
                        return jsonify({'error': f'Question {i+1} minLength cannot be greater than maxLength'}), 400

                # Validate number input restrictions
                if question['type'] == 'number':
                    if 'min' in validation and not isinstance(validation['min'], (int, float)):
                        return jsonify({'error': f'Question {i+1} min must be a number'}), 400
                    
                    if 'max' in validation and not isinstance(validation['max'], (int, float)):
                        return jsonify({'error': f'Question {i+1} max must be a number'}), 400

                # Validate file upload restrictions
                if question['type'] == 'file':
                    if 'allowedFileTypes' in validation:
                        if not isinstance(validation['allowedFileTypes'], list) or len(validation['allowedFileTypes']) == 0:
                            return jsonify({'error': f'Question {i+1} allowedFileTypes must be a non-empty array'}), 400
                        
                        for file_type in validation['allowedFileTypes']:
                            if not isinstance(file_type, str) or file_type.strip() == '':
                                return jsonify({'error': f'Question {i+1} allowedFileTypes must contain non-empty strings'}), 400
                    
                    if 'maxFileSize' in validation and (not isinstance(validation['maxFileSize'], int) or validation['maxFileSize'] <= 0 or validation['maxFileSize'] > 50 * 1024 * 1024):
                        return jsonify({'error': f'Question {i+1} maxFileSize must be between 1 byte and 50MB'}), 400
                    
                    if 'maxFiles' in validation and (not isinstance(validation['maxFiles'], int) or validation['maxFiles'] <= 0 or validation['maxFiles'] > 10):
                        return jsonify({'error': f'Question {i+1} maxFiles must be between 1 and 10'}), 400

        # Set default validation values
        for question in data['questions']:
            if question['type'] in ['text', 'textarea', 'email'] and 'validation' not in question:
                question['validation'] = {}
                if question['type'] == 'text':
                    question['validation']['maxLength'] = 255
                elif question['type'] == 'textarea':
                    question['validation']['maxLength'] = 2000
                elif question['type'] == 'email':
                    question['validation']['maxLength'] = 254

        questionnaire = Questionnaire.from_dict(data)
        db.session.add(questionnaire)
        db.session.commit()
        
        return jsonify({'success': True, 'id': questionnaire.id, 'message': 'Questionnaire created successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/questionnaires/<int:questionnaire_id>', methods=['PUT'])
@login_required
def update_questionnaire(questionnaire_id):
    """Update a questionnaire"""
    try:
        questionnaire = Questionnaire.query.get(questionnaire_id)
        if not questionnaire:
            return jsonify({'error': 'Questionnaire not found'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate required fields
        if not data.get('jobId') or not isinstance(data['jobId'], str) or data['jobId'].strip() == '':
            return jsonify({'error': 'Job ID is required and must be a string'}), 400

        if not data.get('title') or not isinstance(data['title'], str) or data['title'].strip() == '':
            return jsonify({'error': 'Title is required and must be a string'}), 400

        if not data.get('description') or not isinstance(data['description'], str) or data['description'].strip() == '':
            return jsonify({'error': 'Description is required and must be a string'}), 400

        # Validate questions array
        if not isinstance(data.get('questions', []), list) or len(data['questions']) == 0:
            return jsonify({'error': 'At least one question is required'}), 400

        # Validate each question (same validation as create)
        for i, question in enumerate(data['questions']):
            if not isinstance(question, dict):
                return jsonify({'error': f'Question {i+1} must be an object'}), 400

            # Required question fields
            if not question.get('id') or not isinstance(question['id'], str):
                return jsonify({'error': f'Question {i+1} ID is required and must be a string'}), 400

            if not question.get('type') or not isinstance(question['type'], str):
                return jsonify({'error': f'Question {i+1} type is required and must be a string'}), 400

            if not question.get('label') or not isinstance(question['label'], str):
                return jsonify({'error': f'Question {i+1} label is required and must be a string'}), 400

            # Validate question type
            valid_types = ['text', 'textarea', 'select', 'radio', 'checkbox', 'file', 'email', 'phone', 'number', 'date']
            if question['type'] not in valid_types:
                return jsonify({'error': f'Question {i+1} type must be one of: {", ".join(valid_types)}'}), 400

            # Validate required field
            if not isinstance(question.get('required', False), bool):
                return jsonify({'error': f'Question {i+1} required field must be a boolean'}), 400

            # Validate order
            if not isinstance(question.get('order', 0), int):
                return jsonify({'error': f'Question {i+1} order must be an integer'}), 400

            # Validate options for select/radio/checkbox types
            if question['type'] in ['select', 'radio', 'checkbox']:
                if not isinstance(question.get('options', []), list) or len(question['options']) == 0:
                    return jsonify({'error': f'Question {i+1} ({question["type"]}) requires at least one option'}), 400
                
                # Validate each option
                for j, option in enumerate(question['options']):
                    if not isinstance(option, str) or option.strip() == '':
                        return jsonify({'error': f'Question {i+1} option {j+1} must be a non-empty string'}), 400

            # Validate validation object (same as create)
            if 'validation' in question:
                if not isinstance(question['validation'], dict):
                    return jsonify({'error': f'Question {i+1} validation must be an object'}), 400

                validation = question['validation']

                # Validate text input restrictions
                if question['type'] in ['text', 'textarea', 'email']:
                    if 'minLength' in validation and (not isinstance(validation['minLength'], int) or validation['minLength'] < 0):
                        return jsonify({'error': f'Question {i+1} minLength must be a non-negative integer'}), 400
                    
                    if 'maxLength' in validation and (not isinstance(validation['maxLength'], int) or validation['maxLength'] <= 0):
                        return jsonify({'error': f'Question {i+1} maxLength must be a positive integer'}), 400
                    
                    if 'minLength' in validation and 'maxLength' in validation and validation['minLength'] > validation['maxLength']:
                        return jsonify({'error': f'Question {i+1} minLength cannot be greater than maxLength'}), 400

                # Validate number input restrictions
                if question['type'] == 'number':
                    if 'min' in validation and not isinstance(validation['min'], (int, float)):
                        return jsonify({'error': f'Question {i+1} min must be a number'}), 400
                    
                    if 'max' in validation and not isinstance(validation['max'], (int, float)):
                        return jsonify({'error': f'Question {i+1} max must be a number'}), 400

                # Validate file upload restrictions
                if question['type'] == 'file':
                    if 'allowedFileTypes' in validation:
                        if not isinstance(validation['allowedFileTypes'], list) or len(validation['allowedFileTypes']) == 0:
                            return jsonify({'error': f'Question {i+1} allowedFileTypes must be a non-empty array'}), 400
                        
                        for file_type in validation['allowedFileTypes']:
                            if not isinstance(file_type, str) or file_type.strip() == '':
                                return jsonify({'error': f'Question {i+1} allowedFileTypes must contain non-empty strings'}), 400
                    
                    if 'maxFileSize' in validation and (not isinstance(validation['maxFileSize'], int) or validation['maxFileSize'] <= 0 or validation['maxFileSize'] > 50 * 1024 * 1024):
                        return jsonify({'error': f'Question {i+1} maxFileSize must be between 1 byte and 50MB'}), 400
                    
                    if 'maxFiles' in validation and (not isinstance(validation['maxFiles'], int) or validation['maxFiles'] <= 0 or validation['maxFiles'] > 10):
                        return jsonify({'error': f'Question {i+1} maxFiles must be between 1 and 10'}), 400

        # Set default validation values
        for question in data['questions']:
            if question['type'] in ['text', 'textarea', 'email'] and 'validation' not in question:
                question['validation'] = {}
                if question['type'] == 'text':
                    question['validation']['maxLength'] = 255
                elif question['type'] == 'textarea':
                    question['validation']['maxLength'] = 2000
                elif question['type'] == 'email':
                    question['validation']['maxLength'] = 254

        # Update questionnaire
        questionnaire.update_from_dict(data)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Questionnaire updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/questionnaires/<int:questionnaire_id>', methods=['DELETE'])
@login_required
def delete_questionnaire(questionnaire_id):
    """Delete a questionnaire"""
    try:
        questionnaire = Questionnaire.query.get(questionnaire_id)
        if not questionnaire:
            return jsonify({'error': 'Questionnaire not found'}), 404

        db.session.delete(questionnaire)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Questionnaire deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/questionnaires/<int:questionnaire_id>', methods=['GET'])
def get_questionnaire(questionnaire_id):
    """Get a specific questionnaire"""
    try:
        questionnaire = Questionnaire.query.get(questionnaire_id)
        if not questionnaire:
            return jsonify({'error': 'Questionnaire not found'}), 404

        return jsonify(questionnaire.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/contact-quotes', methods=['GET'])
def get_contact_quotes():
    """Get all contact/project quotes"""
    try:
        quotes = ContactQuote.query.order_by(ContactQuote.created_at.desc()).all()
        return jsonify([q.to_dict() for q in quotes])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/contact-quotes', methods=['POST'])
def create_contact_quote():
    """Submit a new contact/project quote"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        # Validation
        if not data.get('name') or not isinstance(data['name'], str) or not data['name'].strip():
            return jsonify({'error': 'Name is required'}), 400
        if not data.get('email') or not isinstance(data['email'], str) or not data['email'].strip():
            return jsonify({'error': 'Email is required'}), 400
        import re
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        if not data.get('company') or not isinstance(data['company'], str) or not data['company'].strip():
            return jsonify({'error': 'Company is required'}), 400
        if not data.get('projectDetails') or not isinstance(data['projectDetails'], str) or not data['projectDetails'].strip():
            return jsonify({'error': 'Project details are required'}), 400
        # Create and save
        quote = ContactQuote.from_dict(data)
        db.session.add(quote)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Contact form submitted successfully', 'insertedId': quote.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

from flask_login import login_required
@api.route('/api/contact-quotes/<int:quote_id>', methods=['DELETE'])
@login_required
def delete_contact_quote(quote_id):
    try:
        quote = ContactQuote.query.get(quote_id)
        if not quote:
            return jsonify({'error': 'Quote not found'}), 404
        db.session.delete(quote)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Quote deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/job-applications', methods=['GET'])
def get_job_applications():
    try:
        job_id = request.args.get('jobId')
        status = request.args.get('status')
        query = JobApplication.query
        if job_id:
            query = query.filter_by(job_id=job_id)
        if status:
            query = query.filter_by(status=status)
        applications = query.order_by(JobApplication.created_at.desc()).all()
        return jsonify([a.to_dict() for a in applications])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/api/job-applications', methods=['POST'])
def create_job_application():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        # Validation
        required_fields = ['jobId', 'jobTitle', 'applicantName', 'applicantEmail', 'applicantPhone', 'coverLetter']
        for field in required_fields:
            if not data.get(field) or not isinstance(data[field], str) or not data[field].strip():
                return jsonify({'error': f'{field} is required'}), 400
        # Email validation
        import re
        email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
        if not re.match(email_regex, data['applicantEmail']):
            return jsonify({'error': 'Invalid email format'}), 400
        # Resume validation (optional)
        if data.get('resume') and not isinstance(data['resume'], dict):
            return jsonify({'error': 'Resume must be an object'}), 400
        # Responses validation (optional)
        if data.get('responses') and not isinstance(data['responses'], list):
            return jsonify({'error': 'Responses must be a list'}), 400
        # Create and save
        application = JobApplication.from_dict(data)
        db.session.add(application)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Application submitted successfully', 'applicationId': application.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

from flask_login import login_required
@api.route('/api/job-applications/<int:application_id>', methods=['PUT'])
@login_required
def update_job_application(application_id):
    try:
        data = request.get_json()
        application = JobApplication.query.get(application_id)
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        # Allow updating status and notes only
        if 'status' in data:
            application.status = data['status']
        if 'notes' in data:
            application.notes = data['notes']
        db.session.commit()
        return jsonify({'success': True, 'message': 'Application updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@api.route('/api/job-applications/<int:application_id>', methods=['DELETE'])
@login_required
def delete_job_application(application_id):
    try:
        application = JobApplication.query.get(application_id)
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        db.session.delete(application)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Application deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500