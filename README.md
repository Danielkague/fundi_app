# Fundi Booking Web App (ServiceConnect)

A modern, desktop-first web app for booking and managing local service providers (Fundis) in Kenya.

## Features
- **User Roles:** Fundi (service provider) and Client (service requester)
- **Registration & Login:** Role-based authentication
- **Fundi Dashboard:**
  - View, accept, decline, and complete jobs
  - Track earnings (today, week, total)
  - See and manage active jobs
  - See client name and phone for assigned jobs
  - Edit profile
- **Client Dashboard:**
  - Request services via a form
  - Track job requests and statuses
  - See assigned fundi's name and phone
  - Browse/search available fundis (scrollable cards)
- **Responsive Design:** Looks great on desktop and mobile, but optimized for desktop
- **Modern Navigation:** Consistent navigation bar on all pages
- **Flash Messages:** User feedback for actions (e.g., job request submitted)
- **Supabase/Postgres Database:** Cloud-hosted, scalable, and secure

## Tech Stack
- **Backend:** Python Flask, SQLAlchemy
- **Frontend:** HTML, CSS, Vanilla JS
- **Database:** Supabase (PostgreSQL)

## Folder Structure
```
fundi_app/
  ├── static/
  │     ├── css/
  │     └── js/
  ├── templates/
  │     ├── dashboard.html
  │     ├── client_dashboard.html
  │     ├── profile.html
  │     └── ...
  ├── backend/
  │     ├── app.py
  │     ├── models.py
  │     ├── db.py
  │     └── config.py
  ├── requirements.txt
  ├── README.md
  └── ...
```

## Local Setup Instructions

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd fundi_app
```

### 2. Set Up Python Environment
```sh
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate
pip install -r requirements.txt
```

### 3. Set Up Supabase/Postgres Database
- Create a [Supabase](https://supabase.com/) project.
- In the Supabase dashboard, go to **Database** > **Connect** and copy your connection string (use the IPv4-compatible pooler URI).
- In `backend/config.py`, set your connection string:
  ```python
  SQLALCHEMY_DATABASE_URI = 'postgresql://<user>:<password>@<host>:<port>/<database>'
  ```
- In Supabase, use the SQL editor to run your schema (see `fundidb_schema.sql`).
- (Optional) Import sample data from `fundidb_sample_data.sql`.

### 4. Initialize the Database Tables (if needed)
```sh
# From the project root:
flask init-db
```

### 5. Run the App
```sh
python -m backend.app
```
- Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

## Usage
- **Register** as a Fundi or Client.
- **Fundis:** Manage jobs, see client info, track earnings, and update your profile.
- **Clients:** Request services, track jobs, see your assigned fundi's contact info, and browse available fundis.

## Team Collaboration
- Each team member should set up their own Supabase project or use a shared one.
- Share code via GitHub or your preferred platform.
- Update the DB URI in your config as needed.

## License
MIT (or specify your license)

---

For more, see code comments and documentation in each file. 