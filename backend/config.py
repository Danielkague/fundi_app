import os
from urllib.parse import urlparse

# Database configuration - use environment variables for production
database_url = os.getenv('DATABASE_URL')

if database_url:
    # Parse and validate the database URL
    try:
        parsed = urlparse(database_url)
        if not parsed.port:
            # If no port specified, use default PostgreSQL port
            if parsed.scheme == 'postgresql':
                database_url = f"{database_url}:5432"
    except Exception as e:
        print(f"Warning: Could not parse DATABASE_URL: {e}")
        # Fallback to default URL
        database_url = "postgresql://postgres.aqwuidlalxfpkrvmvdon:#Toshlewi254@aws-0-us-east-2.pooler.supabase.com:6543/postgres"
else:
    # Fallback to default URL if no environment variable
    database_url = "postgresql://postgres.aqwuidlalxfpkrvmvdon:#Toshlewi254@aws-0-us-east-2.pooler.supabase.com:6543/postgres"

SQLALCHEMY_DATABASE_URI = database_url
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Secret key - use environment variable for production
SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')

# Debug mode - disable in production
DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true' 