import os

# Database configuration - use environment variables for production
SQLALCHEMY_DATABASE_URI = os.getenv(
    'DATABASE_URL', 
    "postgresql://postgres.aqwuidlalxfpkrvmvdon:#Toshlewi254@aws-0-us-east-2.pooler.supabase.com:6543/postgres"
)
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Secret key - use environment variable for production
SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')

# Debug mode - disable in production
DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() == 'true' 