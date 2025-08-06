from app import create_app, db
import json

app = create_app()

with app.app_context():
    from app.models.blog import BlogPost
    
    # Sample blog post data
    sample_blogs = [
        {
            "title": "Building Scalable Web Applications with Flask and React",
            "excerpt": "Learn how to create modern, scalable web applications using Flask backend and React frontend with best practices and real-world examples.",
            "author": {
                "name": "Sarah Johnson",
                "avatar": "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&fit=crop&w=900&q=80",
                "role": "Senior Full-Stack Developer",
                "bio": "Sarah is a passionate developer with 8+ years of experience in building scalable web applications. She specializes in Python, React, and cloud technologies."
            },
            "readTime": "8 min read",
            "publishDate": "2024-01-15",
            "category": "Web Development",
            "image": "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&fit=crop&w=900&q=80",
            "tags": ["Flask", "React", "Python", "Web Development", "Full-Stack"],
            "featured": True,
            "intro": "In today's fast-paced digital world, building scalable web applications is crucial for business success. This comprehensive guide will walk you through creating a modern web application using Flask for the backend and React for the frontend.",
            "keyConcepts": [
                "Flask REST API Development",
                "React Component Architecture",
                "State Management with Redux",
                "Database Design with SQLAlchemy",
                "Authentication and Authorization"
            ],
            "implementation": "We'll start by setting up our Flask backend with proper project structure. The backend will handle user authentication, data persistence, and API endpoints. Then we'll create a React frontend with modern hooks and state management.",
            "bestPractices": [
                "Use environment variables for configuration",
                "Implement proper error handling",
                "Follow REST API conventions",
                "Write comprehensive tests",
                "Use TypeScript for better type safety"
            ],
            "conclusion": "Building scalable web applications requires careful planning and implementation. By following the patterns and practices outlined in this guide, you'll be well-equipped to create robust, maintainable applications that can grow with your business needs."
        },
        {
            "title": "Machine Learning Integration in Modern Web Apps",
            "excerpt": "Discover how to integrate machine learning capabilities into your web applications to provide intelligent features and enhanced user experiences.",
            "author": {
                "name": "Michael Chen",
                "avatar": "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&fit=crop&w=900&q=80",
                "role": "AI/ML Engineer",
                "bio": "Michael is an AI/ML engineer with expertise in integrating machine learning models into production web applications. He has worked on projects ranging from recommendation systems to computer vision applications."
            },
            "readTime": "12 min read",
            "publishDate": "2024-01-20",
            "category": "Machine Learning",
            "image": "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&fit=crop&w=900&q=80",
            "tags": ["Machine Learning", "Python", "TensorFlow", "Web Development", "AI"],
            "featured": True,
            "intro": "Machine learning is revolutionizing how we build web applications. From personalized recommendations to intelligent chatbots, ML integration can significantly enhance user experience and provide competitive advantages.",
            "keyConcepts": [
                "Model Deployment Strategies",
                "API Integration Patterns",
                "Real-time Prediction Services",
                "Data Preprocessing Pipelines",
                "Model Performance Monitoring"
            ],
            "implementation": "We'll explore different approaches to integrate ML models into web applications, including model serving with TensorFlow Serving, real-time predictions via REST APIs, and batch processing for large datasets.",
            "bestPractices": [
                "Start with simple models and iterate",
                "Implement proper model versioning",
                "Monitor model performance in production",
                "Use A/B testing for model evaluation",
                "Ensure data privacy and security"
            ],
            "conclusion": "Machine learning integration opens up new possibilities for web applications. By following best practices and choosing the right architecture, you can create intelligent applications that provide real value to users."
        },
        {
            "title": "Optimizing Database Performance for High-Traffic Applications",
            "excerpt": "Learn essential techniques for optimizing database performance to handle high traffic and ensure your application remains fast and responsive.",
            "author": {
                "name": "Emily Rodriguez",
                "avatar": "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&fit=crop&w=900&q=80",
                "role": "Database Engineer",
                "bio": "Emily is a database engineer with extensive experience in optimizing database performance for high-traffic applications. She specializes in PostgreSQL, Redis, and database architecture."
            },
            "readTime": "10 min read",
            "publishDate": "2024-01-25",
            "category": "Database",
            "image": "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&fit=crop&w=900&q=80",
            "tags": ["Database", "Performance", "PostgreSQL", "Redis", "Optimization"],
            "featured": False,
            "intro": "Database performance is critical for the success of any web application. As your user base grows, database bottlenecks can become a major issue affecting user experience and business operations.",
            "keyConcepts": [
                "Query Optimization Techniques",
                "Indexing Strategies",
                "Connection Pooling",
                "Caching Implementation",
                "Database Sharding"
            ],
            "implementation": "We'll cover practical techniques for optimizing database performance, including query analysis, proper indexing, connection pooling, and implementing caching strategies with Redis.",
            "bestPractices": [
                "Regular query performance monitoring",
                "Implement proper indexing strategies",
                "Use connection pooling effectively",
                "Implement caching for frequently accessed data",
                "Consider read replicas for scaling"
            ],
            "conclusion": "Database optimization is an ongoing process that requires monitoring, analysis, and continuous improvement. By implementing these techniques, you can ensure your application remains performant even under high load."
        }
    ]
    
    # Add sample blog posts
    for blog_data in sample_blogs:
        blog_post = BlogPost.from_dict(blog_data)
        db.session.add(blog_post)
    
    db.session.commit()
    print("Sample blog posts added successfully!")
    
    # Display added blog posts
    blog_posts = BlogPost.query.all()
    print(f"\nTotal blog posts in database: {len(blog_posts)}")
    for post in blog_posts:
        print(f"- {post.title} (Featured: {post.featured})") 