from flask import Flask, request, jsonify, render_template, abort, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session
from datetime import datetime, timedelta
from backend.db import db

app = Flask(
    __name__,
    static_folder=os.path.abspath('static'),
    template_folder=os.path.abspath('templates')
)
CORS(app)

# Load config from config.py
app.config.from_pyfile('config.py')
db.init_app(app)

from backend.models import User, Job, Earning

app.secret_key = app.config['SECRET_KEY']

import os
print("TEMPLATE FOLDER (Flask):", app.template_folder)
print("TEMPLATE FOLDER (abs):", os.path.abspath(app.template_folder))
print("TEMPLATES DIR EXISTS:", os.path.isdir(app.template_folder))
print("TEMPLATES DIR CONTENTS:", os.listdir(app.template_folder))
print("STATIC FOLDER (Flask):", app.static_folder)
print("STATIC FOLDER (abs):", os.path.abspath(app.static_folder))
print("STATIC DIR EXISTS:", os.path.isdir(app.static_folder))
print("STATIC DIR CONTENTS:", os.listdir(app.static_folder))

@app.route('/')
def landing():
    return render_template('landing.html')

@app.route('/login')
def login_page():
    return render_template('index.html')

@app.route('/register')
def register_page():
    return render_template('register.html')

# --- Auth, Profile, Jobs, Earnings, Payment endpoints will be added here ---

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    jobs = Job.query.filter_by(fundi_id=user_id).all()
    jobs_list = [{
        'id': job.id,
        'title': job.title,
        'date': job.date.strftime('%Y-%m-%d'),
        'customer': job.customer,
        'location': job.location,
        'amount': job.amount,
        'status': job.status
    } for job in jobs]
    return jsonify(jobs_list)

@app.route('/api/jobs', methods=['POST'])
def create_job():
    # For demo/testing: allow job creation
    data = request.json
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    job = Job(
        title=data.get('title'),
        date=data.get('date'),
        customer=data.get('customer'),
        location=data.get('location'),
        amount=data.get('amount'),
        status='pending',
        fundi_id=user_id
    )
    db.session.add(job)
    db.session.commit()
    return jsonify({'message': 'Job created', 'job_id': job.id})

@app.route('/api/jobs/<int:job_id>/accept', methods=['POST'])
def accept_job(job_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    job = Job.query.get(job_id)
    if not job or (job.fundi_id is not None and job.fundi_id != user_id):
        return abort(404)
    job.fundi_id = user_id
    job.status = 'in_progress'
    db.session.commit()
    return jsonify({'message': 'Job accepted'})

@app.route('/api/jobs/<int:job_id>/decline', methods=['POST'])
def decline_job(job_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    job = Job.query.get(job_id)
    if not job or job.fundi_id != user_id:
        return abort(404)
    job.status = 'declined'
    db.session.commit()
    return jsonify({'message': 'Job declined'})

@app.route('/api/jobs/<int:job_id>/complete', methods=['POST'])
def complete_job(job_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    job = Job.query.get(job_id)
    if not job or job.fundi_id != user_id:
        return abort(404)
    job.status = 'completed'
    db.session.commit()
    return jsonify({'message': 'Job marked as completed'})

@app.route('/api/earnings', methods=['GET'])
def get_earnings():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    today = datetime.utcnow().date()
    week_ago = today - timedelta(days=7)
    # Get completed jobs for this fundi
    jobs = Job.query.filter_by(fundi_id=user_id, status='completed').all()
    total = sum(j.amount for j in jobs)
    today_total = sum(j.amount for j in jobs if j.date == today)
    week_total = sum(j.amount for j in jobs if week_ago <= j.date <= today)
    return jsonify({
        'total': total,
        'today': today_total,
        'week': week_total
    })

@app.cli.command('init-db')
def init_db():
    db.create_all()
    print('Database tables created.')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    phone = data.get('phone')
    password = data.get('password')
    name = data.get('name')
    role = data.get('role', 'fundi')  # Default to fundi
    if not phone or not password or not name or not role:
        return jsonify({'error': 'Missing required fields'}), 400
    if User.query.filter_by(phone=phone).first():
        return jsonify({'error': 'Phone already registered'}), 400
    hashed_pw = generate_password_hash(password)
    user = User(phone=phone, password=hashed_pw, name=name, role=role)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Registration successful'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    phone = data.get('phone')
    password = data.get('password')
    role = data.get('role')  # Must be specified
    user = User.query.filter_by(phone=phone, role=role).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid credentials'}), 401
    session['user_id'] = user.id
    session['role'] = user.role
    if user.role == 'client':
        session['client_name'] = user.name
    return jsonify({'message': 'Login successful', 'user': {'id': user.id, 'name': user.name, 'phone': user.phone, 'role': user.role}, 'redirect': '/client-dashboard' if user.role == 'client' else '/dashboard'})

@app.route('/api/profile', methods=['GET', 'POST'])
def profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    user = User.query.get(user_id)
    if request.method == 'GET':
        return jsonify({'id': user.id, 'name': user.name, 'phone': user.phone, 'email': user.email, 'location': user.location, 'service': user.service})
    # POST: update profile
    data = request.json
    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    user.location = data.get('location', user.location)
    user.service = data.get('service', user.service)
    db.session.commit()
    return jsonify({'message': 'Profile updated'})

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'})

@app.route('/api/pay', methods=['POST'])
def pay_job():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    data = request.json
    job_id = data.get('job_id')
    job = Job.query.get(job_id)
    if not job or job.fundi_id != user_id:
        return jsonify({'error': 'Job not found'}), 404
    if job.status != 'completed':
        return jsonify({'error': 'Job must be completed before payment'}), 400
    job.status = 'paid'
    db.session.commit()
    return jsonify({'message': 'Payment successful (mocked)'})

@app.route('/dashboard')
def dashboard_page():
    user_id = session.get('user_id')
    if not user_id:
        return redirect('/login')
    user = User.query.get(user_id)
    return render_template('dashboard.html', username=user.name if user else 'Fundi')

# --- Potential Jobs for Fundi ---
@app.route('/api/potential-jobs', methods=['GET'])
def get_potential_jobs():
    # Jobs with status 'pending' and no fundi assigned
    jobs = Job.query.filter_by(status='pending', fundi_id=None).all()
    jobs_list = [{
        'id': job.id,
        'title': job.title,
        'date': job.date.strftime('%Y-%m-%d'),
        'customer': job.customer,
        'location': job.location,
        'amount': job.amount,
        'status': job.status
    } for job in jobs]
    return jsonify(jobs_list)

# --- Fundi Active Job ---
@app.route('/api/fundi/active-job', methods=['GET'])
def fundi_active_job():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error': 'Not authenticated'}), 401
    job = Job.query.filter_by(fundi_id=user_id, status='in_progress').first()
    if not job:
        return jsonify({'active_job': None})
    return jsonify({'active_job': {
        'id': job.id,
        'title': job.title,
        'date': job.date.strftime('%Y-%m-%d'),
        'customer': job.customer,
        'location': job.location,
        'amount': job.amount,
        'status': job.status
    }})

# --- Client Job Requests (with fundi name) ---
@app.route('/api/client/jobs', methods=['GET', 'POST'])
def client_jobs():
    client_name = session.get('client_name', 'Demo Client')
    if request.method == 'GET':
        jobs = Job.query.filter_by(customer=client_name).all()
        jobs_list = []
        for job in jobs:
            fundi_name = None
            fundi_phone = None
            if job.fundi_id:
                fundi = User.query.get(job.fundi_id)
                if fundi:
                    fundi_name = fundi.name
                    fundi_phone = fundi.phone
            jobs_list.append({
                'id': job.id,
                'title': job.title,
                'date': job.date.strftime('%Y-%m-%d'),
                'location': job.location,
                'amount': job.amount,
                'status': job.status,
                'fundi_id': job.fundi_id,
                'fundi_name': fundi_name,
                'fundi_phone': fundi_phone
            })
        return jsonify(jobs_list)
    # POST: create a new job request
    data = request.json
    title = data.get('service')
    date = data.get('date')
    location = data.get('location')
    amount = data.get('amount')
    if not title or not date or not location or not amount:
        return jsonify({'error': 'Missing required fields'}), 400
    job = Job(
        title=title,
        date=date,
        customer=client_name,
        location=location,
        amount=amount,
        status='pending',
        fundi_id=None
    )
    db.session.add(job)
    db.session.commit()
    return jsonify({'message': 'Job request submitted', 'job_id': job.id})

# --- Fundi Search ---
@app.route('/api/fundis', methods=['GET'])
def search_fundis():
    q = request.args.get('q', '').strip().lower()
    query = User.query
    if q:
        query = query.filter((User.name.ilike(f'%{q}%')) | (User.service.ilike(f'%{q}%')))
    fundis = query.all()
    fundi_list = [{
        'id': f.id,
        'name': f.name,
        'service': f.service,
        'location': f.location
    } for f in fundis]
    return jsonify(fundi_list)

@app.route('/client-dashboard')
def client_dashboard_page():
    return render_template('client_dashboard.html')

if __name__ == '__main__':
    app.run(debug=True) 