# Fundi Booking Web App (ServiceConnect)

A modern, mobile-first web app for booking and managing local service providers (Fundis) in Kenya.

## Features
- **User Roles:** Fundi (service provider) and Client (service requester)
- **Registration & Login:** Role-based authentication
- **Fundi Dashboard:**
  - View, accept, decline, and complete jobs
  - Track earnings (today, week, total)
  - See and manage active jobs
  - Edit profile
- **Client Dashboard:**
  - Request services
  - Track job requests and statuses
  - See assigned fundi's name and phone
  - Browse/search fundis
- **Responsive Design:** Looks great on desktop and mobile
- **M-Pesa Payment (Mocked):** Simulate job payments

## Tech Stack
- **Backend:** Python Flask, SQLAlchemy
- **Frontend:** HTML, CSS, Vanilla JS
- **Database:** MySQL

## Folder Structure
```
fundi_app/
  ├── static/
  │     ├── css/
  │     ├── js/
  │     └── images/
  ├── templates/
  │     └── index.html
  ├── backend/
  │     ├── app.py
  │     ├── models.py
  │     └── config.py
  ├── requirements.txt
  ├── README.md
  └── .gitignore
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

### 3. Set Up MySQL Database
- Install MySQL if you don't have it.
- Create a database:
  ```sql
  CREATE DATABASE fundidb;
  ```
- (Optional) Create a user and grant privileges:
  ```sql
  CREATE USER 'fundiuser'@'localhost' IDENTIFIED BY 'yourpassword';
  GRANT ALL PRIVILEGES ON fundidb.* TO 'fundiuser'@'localhost';
  FLUSH PRIVILEGES;
  ```
- **Import the schema:**
  ```sh
  mysql -u youruser -p fundidb < fundidb_schema.sql
  ```
- (Optional) **Import sample data:**
  ```sh
  mysql -u youruser -p fundidb < fundidb_sample_data.sql
  ```
- Update your `backend/config.py` (or wherever your DB URI is) to match your credentials:
  ```python
  SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://fundiuser:yourpassword@localhost/fundidb'
  ```

### 4. Initialize the Database Tables
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
- **Fundis:** Manage jobs, track earnings, and update your profile.
- **Clients:** Request services, track jobs, and see your assigned fundi's contact info.

## Team Collaboration
- Each team member should set up their own local MySQL and import the schema (see above).
- Share code via GitHub or your preferred platform.
- For a shared database, consider using a cloud MySQL provider (e.g., PlanetScale) and update the DB URI in your config.

## License
MIT (or specify your license)

---

For more, see code comments and documentation in each file. 