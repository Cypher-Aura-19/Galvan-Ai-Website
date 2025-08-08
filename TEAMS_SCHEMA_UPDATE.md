# Teams Schema Update

## Overview
The teams schema has been updated to separate `background` and `interests` fields instead of using a combined `background_interests` field. This provides better organization and clarity for team member data.

## Changes Made

### Backend Changes
1. **Model Update** (`backend/GalvanAIBack/galvan_ai/app/models/team.py`):
   - Replaced `background_interests` field with separate `background` and `interests` fields
   - Both fields store JSON arrays as strings

2. **API Routes Update** (`backend/GalvanAIBack/galvan_ai/app/api.py`):
   - Updated validation to handle separate `background` and `interests` arrays
   - Updated field mapping in create and update operations

3. **Sample Data Update** (`backend/GalvanAIBack/galvan_ai/add_sample_teams.py`):
   - Updated sample team members to use separate background and interests fields

### Frontend Changes
1. **Admin Teams Page** (`app/admin/teams/page.tsx`):
   - Updated TeamMember type to include separate `background` and `interests` arrays
   - Split the form section into separate "Background" and "Interests" sections
   - Added separate input handlers for background and interests

2. **Teams Component** (`components/teams.tsx`):
   - Updated TeamMember type to include `avatar` field
   - Updated data mapping to handle separate background and interests arrays
   - Converts arrays to comma-separated strings for display

## Database Migration

### For Existing Databases
If you have an existing database with the old schema, run the migration script:

```bash
cd backend/GalvanAIBack/galvan_ai
python migrate_teams_schema.py
```

This script will:
- Convert existing `background_interests` data to the new `interests` field
- Initialize empty `background` arrays
- Preserve all other data

### For New Databases
If you're starting fresh, simply run:

```bash
cd backend/GalvanAIBack/galvan_ai
python recreate_db.py
python add_sample_teams.py
```

## Field Descriptions

### Background
- **Purpose**: Professional background, education, experience
- **Type**: Array of strings
- **Examples**: ["Computer Science Degree", "5+ years experience", "Frontend Specialist"]

### Interests
- **Purpose**: Personal interests, hobbies, passions
- **Type**: Array of strings
- **Examples**: ["AI/ML", "Open Source", "Photography", "Travel"]

## Usage in Admin Dashboard

1. **Adding Background**: Use the "Background" section to add professional qualifications, experience, and expertise
2. **Adding Interests**: Use the "Interests" section to add personal interests and hobbies
3. **Display**: The frontend will automatically convert arrays to readable comma-separated strings

## Benefits

1. **Better Organization**: Clear separation between professional background and personal interests
2. **Improved UX**: Separate form sections make it easier to manage different types of information
3. **Flexibility**: Can now have different validation rules or display logic for each field type
4. **Scalability**: Easier to add field-specific features in the future

## Testing

After applying the changes:

1. Start the Flask backend: `cd backend/GalvanAIBack/galvan_ai && python run.py`
2. Start the Next.js frontend: `npm run dev`
3. Navigate to `/admin/teams` to test the new form fields
4. Navigate to `/teams` to see how the data is displayed
