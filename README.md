# Fundi Booking App

A Flask-based web application for connecting clients with skilled workers (fundis) for various services.

## Features

- **User Authentication**: Registration and login for both clients and fundis
- **Role-based Dashboards**: Separate interfaces for clients and fundis
- **Job Management**: Create, accept, decline, and complete jobs
- **Earnings Tracking**: Fundis can track their earnings
- **Contact Information**: Clients and fundis can view each other's contact details
- **Responsive Design**: Modern dark-themed UI that works on all devices

## Tech Stack

- **Backend**: Flask (Python)
- **Database**: PostgreSQL (Supabase)
- **Frontend**: HTML, CSS, JavaScript
- **Deployment**: Render.com ready

## Local Development

### Prerequisites

- Python 3.7+
- PostgreSQL database (or Supabase account)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd fundi_app
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables (create a `.env` file):
```bash
DATABASE_URL=your_supabase_connection_string
SECRET_KEY=your_secret_key
FLASK_DEBUG=True
```

4. Initialize the database:
```bash
python -m backend.app init-db
```

5. Run the application:
```bash
python -m backend.app
```

The app will be available at `http://localhost:5000`

## Deployment

### Deploy to Render.com

1. **Connect your GitHub repository** to Render.com

2. **Create a new Web Service**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn backend.app:app`

3. **Set Environment Variables**:
   - `DATABASE_URL`: Your Supabase PostgreSQL connection string
   - `SECRET_KEY`: A secure random string for session encryption
   - `FLASK_DEBUG`: Set to `False` for production

4. **Deploy**: Render will automatically deploy your app and provide a URL

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: Flask secret key for session management
- `FLASK_DEBUG`: Set to `False` in production

## Project Structure

```
fundi_app/
├── backend/
│   ├── app.py          # Main Flask application
│   ├── config.py       # Configuration settings
│   ├── db.py          # Database initialization
│   └── models.py      # SQLAlchemy models
├── static/
│   ├── css/
│   │   └── styles.css  # Main stylesheet
│   └── js/
│       ├── app.js      # Main JavaScript
│       └── client_app.js
├── templates/
│   ├── dashboard.html      # Fundi dashboard
│   ├── client_dashboard.html
│   ├── index.html         # Login page
│   ├── landing.html       # Landing page
│   ├── profile.html       # Profile page
│   └── register.html      # Registration page
├── Procfile              # For deployment
├── requirements.txt      # Python dependencies
└── README.md
```

## Database Schema

The app uses PostgreSQL with the following main tables:
- `users`: User accounts (clients and fundis)
- `jobs`: Job listings and assignments
- `earnings`: Fundi earnings tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 