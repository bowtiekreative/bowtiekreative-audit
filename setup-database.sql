-- Run this file as MySQL root user to set up the database
-- mysql -u root -p < setup-database.sql

-- Create database
CREATE DATABASE IF NOT EXISTS audit;

-- Create user with password
CREATE USER IF NOT EXISTS 'audit'@'localhost' IDENTIFIED BY '5878892404@Deerfoot';
CREATE USER IF NOT EXISTS 'audit'@'127.0.0.1' IDENTIFIED BY '5878892404@Deerfoot';
CREATE USER IF NOT EXISTS 'audit'@'%' IDENTIFIED BY '5878892404@Deerfoot';

-- Grant privileges
GRANT ALL PRIVILEGES ON audit.* TO 'audit'@'localhost';
GRANT ALL PRIVILEGES ON audit.* TO 'audit'@'127.0.0.1';
GRANT ALL PRIVILEGES ON audit.* TO 'audit'@'%';

-- Flush privileges
FLUSH PRIVILEGES;

-- Select the database
USE audit;

-- Show current user
SELECT USER(), CURRENT_USER();

-- Confirm setup
SHOW GRANTS FOR 'audit'@'localhost';
