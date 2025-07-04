import os

SQLALCHEMY_DATABASE_URI = "postgresql://postgres.aqwuidlalxfpkrvmvdon:#Toshlewi254@aws-0-us-east-2.pooler.supabase.com:6543/postgres"
SQLALCHEMY_TRACK_MODIFICATIONS = False

SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey') 