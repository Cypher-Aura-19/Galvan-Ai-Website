from app import create_app, db

app = create_app()
with app.app_context():
    from app.models.user import User  # move import inside app context
    from werkzeug.security import generate_password_hash

    username = input("Enter new username: ")
    password = input("Enter password: ")
    hashed_password = generate_password_hash(password)
    user = User(username=username, password=hashed_password)
    db.session.add(user)
    db.session.commit()
    print(f"User '{username}' added.")