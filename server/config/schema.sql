-- Create audits table
CREATE TABLE IF NOT EXISTS audits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- Business Information
  business_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  website VARCHAR(255),
  industry VARCHAR(100),
  business_size VARCHAR(50),
  location VARCHAR(255),
  
  -- Digital Presence
  social_media_platforms TEXT,
  current_marketing_tools TEXT,
  target_audience TEXT,
  
  -- Marketing Goals
  marketing_goals TEXT,
  monthly_budget VARCHAR(100),
  biggest_challenges TEXT,
  
  -- Current Status
  has_website BOOLEAN DEFAULT FALSE,
  has_social_media BOOLEAN DEFAULT FALSE,
  has_email_marketing BOOLEAN DEFAULT FALSE,
  has_seo BOOLEAN DEFAULT FALSE,
  has_paid_ads BOOLEAN DEFAULT FALSE,
  has_analytics BOOLEAN DEFAULT FALSE,
  has_crm BOOLEAN DEFAULT FALSE,
  has_automation BOOLEAN DEFAULT FALSE,
  
  -- Audit Scores (calculated)
  website_score INT DEFAULT 0,
  social_score INT DEFAULT 0,
  marketing_score INT DEFAULT 0,
  automation_score INT DEFAULT 0,
  overall_score INT DEFAULT 0,
  
  -- Report
  report_generated BOOLEAN DEFAULT FALSE,
  pdf_path VARCHAR(500),
  
  -- Update Code for allowing users to edit their reports
  update_code VARCHAR(4) UNIQUE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_created_at (created_at),
  INDEX idx_business_name (business_name)
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  
  INDEX idx_username (username),
  INDEX idx_email (email)
);

-- Create audit_responses table for detailed answers
CREATE TABLE IF NOT EXISTS audit_responses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  audit_id INT NOT NULL,
  question VARCHAR(500) NOT NULL,
  answer TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE,
  INDEX idx_audit_id (audit_id),
  INDEX idx_category (category)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  audit_id INT NOT NULL,
  notification_type ENUM('audit_started', 'audit_completed', 'report_generated') NOT NULL,
  sent_to VARCHAR(255) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',
  error_message TEXT,
  
  FOREIGN KEY (audit_id) REFERENCES audits(id) ON DELETE CASCADE,
  INDEX idx_audit_id (audit_id),
  INDEX idx_sent_at (sent_at)
);
