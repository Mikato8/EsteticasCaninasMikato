
CREATE TABLE IF NOT EXISTS businesses (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NULL,
  email VARCHAR(120) NULL,
  address VARCHAR(255) NULL,
  color VARCHAR(20) DEFAULT '#E06C4F',
  theme VARCHAR(30) NOT NULL DEFAULT 'coral',
  colors JSON NULL,
  language VARCHAR(5) DEFAULT 'es',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  business_id CHAR(36) NOT NULL,
  name VARCHAR(120) NOT NULL,
  username VARCHAR(80) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_business FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS business_data (
  business_id CHAR(36) PRIMARY KEY,
  clients JSON NOT NULL,
  services JSON NOT NULL,
  products JSON NOT NULL,
  packages JSON NOT NULL,
  appointments JSON NOT NULL,
  sales JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_business_data_business FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);
