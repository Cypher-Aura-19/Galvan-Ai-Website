from app import create_app, db
import json

app = create_app()

with app.app_context():
    from app.models.testimonial import Testimonial

    sample_testimonials = [
        {
            "name": "Sarah Johnson",
            "role": "CEO",
            "company": "TechStart Inc.",
            "avatar": "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&fit=crop&w=900&q=80",
            "title": "Exceptional Web Development Services",
            "content": "Galvan AI delivered an outstanding website that exceeded our expectations. The team was professional, responsive, and delivered on time.",
            "longContent": "Working with Galvan AI was an absolute pleasure. From the initial consultation to the final launch, their team demonstrated exceptional expertise in web development. They took the time to understand our business needs and created a solution that perfectly aligned with our vision. The website they built for us has significantly improved our online presence and user engagement. I highly recommend their services to anyone looking for quality web development.",
            "rating": 5,
            "featured": True,
            "tags": ["Web Development", "Professional", "Responsive"]
        },
        {
            "name": "Michael Chen",
            "role": "CTO",
            "company": "InnovateCorp",
            "avatar": "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&fit=crop&w=900&q=80",
            "title": "Innovative AI Solutions",
            "content": "The AI integration they implemented has revolutionized our business processes. Highly skilled team with cutting-edge technology.",
            "longContent": "Galvan AI's expertise in artificial intelligence and machine learning has transformed how we operate. They implemented sophisticated AI solutions that have streamlined our workflows and improved efficiency by 40%. Their team's deep understanding of both business requirements and technical implementation made the entire process smooth and successful. The solutions they delivered are scalable and future-proof.",
            "rating": 5,
            "featured": True,
            "tags": ["AI/ML", "Innovation", "Efficiency"]
        },
        {
            "name": "Emily Rodriguez",
            "role": "Marketing Director",
            "company": "GrowthFirst",
            "avatar": "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&fit=crop&w=900&q=80",
            "title": "Outstanding Digital Marketing Platform",
            "content": "Their digital marketing platform has helped us increase our ROI by 300%. The analytics and insights are invaluable.",
            "longContent": "Galvan AI built us a comprehensive digital marketing platform that has been a game-changer for our business. The platform provides detailed analytics, automated campaign management, and powerful insights that have helped us make data-driven decisions. Our marketing ROI has increased by 300% since implementing their solution. The team continues to provide excellent support and regular updates.",
            "rating": 5,
            "featured": False,
            "tags": ["Digital Marketing", "Analytics", "ROI"]
        },
        {
            "name": "David Thompson",
            "role": "Product Manager",
            "company": "StartupHub",
            "avatar": "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&fit=crop&w=900&q=80",
            "title": "Scalable Mobile Application",
            "content": "They developed a robust mobile app that scales beautifully. The user experience is intuitive and engaging.",
            "longContent": "Galvan AI developed our mobile application from concept to launch, and the results have been phenomenal. The app is not only visually appealing but also highly functional and scalable. User engagement metrics have exceeded our expectations, and the app has received excellent reviews on both iOS and Android platforms. Their attention to detail and commitment to quality is evident in every aspect of the application.",
            "rating": 4,
            "featured": False,
            "tags": ["Mobile Development", "User Experience", "Scalability"]
        },
        {
            "name": "Lisa Wang",
            "role": "Operations Manager",
            "company": "EcoSolutions",
            "avatar": "https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&fit=crop&w=900&q=80",
            "title": "Efficient E-commerce Solution",
            "content": "Our online store has seen a 200% increase in sales since implementing their e-commerce solution. Excellent work!",
            "longContent": "Galvan AI transformed our traditional business into a thriving e-commerce operation. Their solution included inventory management, payment processing, customer relationship management, and analytics. The platform is user-friendly for both customers and administrators. Since launch, we've seen a 200% increase in sales and significant improvements in customer satisfaction scores.",
            "rating": 5,
            "featured": True,
            "tags": ["E-commerce", "Sales", "Customer Experience"]
        },
        {
            "name": "James Wilson",
            "role": "IT Director",
            "company": "Enterprise Solutions",
            "avatar": "https://images.pexels.com/photos/2379006/pexels-photo-2379006.jpeg?auto=compress&fit=crop&w=900&q=80",
            "title": "Enterprise-Grade Security",
            "content": "Their security implementation is top-notch. We feel confident that our data is protected with their solutions.",
            "longContent": "Security was our primary concern when choosing a development partner, and Galvan AI exceeded our expectations. They implemented enterprise-grade security measures including encryption, secure authentication, and regular security audits. Their team demonstrated deep knowledge of cybersecurity best practices and ensured compliance with industry standards. We have complete confidence in the security of our systems.",
            "rating": 5,
            "featured": False,
            "tags": ["Security", "Enterprise", "Compliance"]
        }
    ]

    for testimonial_data in sample_testimonials:
        testimonial = Testimonial.from_dict(testimonial_data)
        db.session.add(testimonial)

    db.session.commit()
    print("Sample testimonials added successfully!")
    testimonials = Testimonial.query.all()
    print(f"\nTotal testimonials in database: {len(testimonials)}")
    for testimonial in testimonials:
        print(f"- {testimonial.name} ({testimonial.company}) - Rating: {testimonial.rating} - Featured: {testimonial.featured}") 