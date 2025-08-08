#!/usr/bin/env python3

from app import create_app, db
from app.models.team import Team
import json

def migrate_teams_schema():
    app = create_app()
    with app.app_context():
        print("🔄 Migrating teams schema...")
        
        try:
            # Get all existing team members
            teams = Team.query.all()
            
            for team in teams:
                # Check if background_interests exists and split it
                if hasattr(team, 'background_interests') and team.background_interests:
                    try:
                        # Parse the existing background_interests
                        background_interests_data = json.loads(team.background_interests)
                        
                        # Split into background and interests (you can customize this logic)
                        # For now, we'll put everything in interests and leave background empty
                        team.background = json.dumps([])
                        team.interests = json.dumps(background_interests_data)
                        
                        print(f"✅ Migrated {team.name}: background_interests -> interests")
                    except json.JSONDecodeError:
                        # If it's not valid JSON, treat it as interests
                        team.background = json.dumps([])
                        team.interests = json.dumps([team.background_interests])
                        print(f"✅ Migrated {team.name}: background_interests (string) -> interests")
                else:
                    # Initialize empty arrays if no background_interests
                    team.background = json.dumps([])
                    team.interests = json.dumps([])
                    print(f"✅ Initialized {team.name}: empty background and interests")
            
            # Commit the changes
            db.session.commit()
            print("🎉 Teams schema migration completed successfully!")
            
        except Exception as e:
            print(f"❌ Error during migration: {e}")
            db.session.rollback()

if __name__ == "__main__":
    migrate_teams_schema()
