-- Sample schema for Fundi Booking App (ServiceConnect)

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    email VARCHAR(100),
    service VARCHAR(100),
    role VARCHAR(20) DEFAULT 'fundi',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    customer VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    fundi_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fundi_id) REFERENCES user(id)
);

CREATE TABLE earning (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT,
    fundi_id INT,
    amount INT NOT NULL,
    date DATE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job(id),
    FOREIGN KEY (fundi_id) REFERENCES user(id)
); 