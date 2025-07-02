-- Sample data for Fundi Booking App (ServiceConnect)

-- Users (Fundis and Clients)
INSERT INTO user (phone, password, name, location, email, service, role) VALUES
('+254711111111', 'hashedpassword1', 'James Mwangi', 'Nairobi', 'james@example.com', 'Plumber', 'fundi'),
('+254722222222', 'hashedpassword2', 'Mary Wanjiku', 'Mombasa', 'mary@example.com', 'Electrician', 'fundi'),
('+254733333333', 'hashedpassword3', 'Ali Hassan', 'Kisumu', 'ali@example.com', 'Carpenter', 'fundi'),
('+254744444444', 'hashedpassword4', 'Grace Njeri', 'Nairobi', 'grace@example.com', NULL, 'client'),
('+254755555555', 'hashedpassword5', 'Peter Otieno', 'Eldoret', 'peter@example.com', NULL, 'client');

-- Jobs
INSERT INTO job (title, date, customer, location, amount, status, fundi_id) VALUES
('Fix leaking sink', '2024-07-01', 'Grace Njeri', 'Nairobi', 1500, 'completed', 1),
('Install new sockets', '2024-07-02', 'Peter Otieno', 'Eldoret', 2500, 'pending', NULL),
('Repair door', '2024-07-03', 'Grace Njeri', 'Nairobi', 1200, 'in_progress', 3);

-- Earnings
INSERT INTO earning (job_id, fundi_id, amount, date) VALUES
(1, 1, 1500, '2024-07-01'); 