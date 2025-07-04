import os

SQLALCHEMY_DATABASE_URI = os.getenv(
    'SUPABASE_DB_URI',
    'postgresql://postgres:#Toshlewi254@aqwuidlalxfpkrvmvdon.postgres.supabase.co:5432/postgres'
)
SQLALCHEMY_TRACK_MODIFICATIONS = False

SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey') 