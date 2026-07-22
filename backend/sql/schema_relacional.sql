-- Esquema relacional corregido y mejorado para Mikato Estéticas Caninas
-- Basado en la exportación del modelo relacional (PDF) con ajustes para multitenencia,
-- integridad referencial, normalización de ventas y campos usados por la app actual.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS sale_items;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS package_products;
DROP TABLE IF EXISTS packages;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS businesses;
DROP TABLE IF EXISTS languages;

SET FOREIGN_KEY_CHECKS = 1;

-- Catálogo de idiomas soportados
CREATE TABLE languages (
  id_language INT AUTO_INCREMENT PRIMARY KEY,
  language VARCHAR(100) NOT NULL,
  code VARCHAR(10) DEFAULT 'es',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Negocios (tenant)
CREATE TABLE businesses (
  id_business CHAR(36) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  email VARCHAR(120) DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  color VARCHAR(50) DEFAULT '#E06C4F',
  theme VARCHAR(100) DEFAULT 'coral',
  colors JSON DEFAULT NULL,
  id_language INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_businesses_language
    FOREIGN KEY (id_language) REFERENCES languages(id_language)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usuarios del sistema
CREATE TABLE users (
  id_users CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  username VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'owner', 'staff', 'user') NOT NULL DEFAULT 'user',
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_business CHAR(36) DEFAULT NULL,
  CONSTRAINT fk_users_business
    FOREIGN KEY (id_business) REFERENCES businesses(id_business)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clientes y mascotas
CREATE TABLE clients (
  id_client INT AUTO_INCREMENT PRIMARY KEY,
  id_business CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) DEFAULT NULL,
  phone VARCHAR(50) DEFAULT NULL,
  address VARCHAR(500) DEFAULT NULL,
  especie VARCHAR(50) DEFAULT 'perro',
  mascota VARCHAR(255) NOT NULL,
  raza VARCHAR(255) DEFAULT NULL,
  tamano VARCHAR(50) DEFAULT NULL,
  edad VARCHAR(50) DEFAULT NULL,
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_clients_business
    FOREIGN KEY (id_business) REFERENCES businesses(id_business)
    ON UPDATE CASCADE ON DELETE CASCADE,
  INDEX idx_clients_name (name),
  INDEX idx_clients_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Servicios (baños, cortes, etc.)
CREATE TABLE services (
  id_service INT AUTO_INCREMENT PRIMARY KEY,
  id_business CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cost DECIMAL(10, 2) DEFAULT 0.00,
  price DECIMAL(10, 2) DEFAULT 0.00,
  icon VARCHAR(100) DEFAULT NULL,
  color VARCHAR(20) DEFAULT NULL,
  type VARCHAR(50) DEFAULT 'servicio',
  duration_minutes INT DEFAULT 60,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_services_business
    FOREIGN KEY (id_business) REFERENCES businesses(id_business)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Productos (shampoo, accesorios, etc.)
CREATE TABLE products (
  id_product INT AUTO_INCREMENT PRIMARY KEY,
  id_business CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(1000) DEFAULT NULL,
  stock INT DEFAULT 0,
  cost DECIMAL(10, 2) DEFAULT 0.00,
  price DECIMAL(10, 2) DEFAULT 0.00,
  icon VARCHAR(100) DEFAULT NULL,
  color VARCHAR(20) DEFAULT NULL,
  type VARCHAR(50) DEFAULT 'producto',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_business
    FOREIGN KEY (id_business) REFERENCES businesses(id_business)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Paquetes de servicios/productos
CREATE TABLE packages (
  id_package INT AUTO_INCREMENT PRIMARY KEY,
  id_business CHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  cost DECIMAL(10, 2) DEFAULT 0.00,
  price DECIMAL(10, 2) DEFAULT 0.00,
  icon VARCHAR(100) DEFAULT NULL,
  color VARCHAR(20) DEFAULT NULL,
  type VARCHAR(50) DEFAULT 'paquete',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_packages_business
    FOREIGN KEY (id_business) REFERENCES businesses(id_business)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Productos incluidos en cada paquete
CREATE TABLE package_products (
  id_package_product INT AUTO_INCREMENT PRIMARY KEY,
  id_package INT NOT NULL,
  id_product INT NOT NULL,
  quantity INT DEFAULT 1,
  CONSTRAINT fk_pp_package
    FOREIGN KEY (id_package) REFERENCES packages(id_package)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_pp_product
    FOREIGN KEY (id_product) REFERENCES products(id_product)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Citas/Agenda
CREATE TABLE appointments (
  id_appointment INT AUTO_INCREMENT PRIMARY KEY,
  id_business CHAR(36) NOT NULL,
  title VARCHAR(255) DEFAULT NULL,
  date DATETIME NOT NULL,
  id_client INT DEFAULT NULL,
  id_user CHAR(36) DEFAULT NULL,
  id_service INT DEFAULT NULL,
  id_package INT DEFAULT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_appointments_business
    FOREIGN KEY (id_business) REFERENCES businesses(id_business)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_appointments_client
    FOREIGN KEY (id_client) REFERENCES clients(id_client)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_appointments_user
    FOREIGN KEY (id_user) REFERENCES users(id_users)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_appointments_service
    FOREIGN KEY (id_service) REFERENCES services(id_service)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_appointments_package
    FOREIGN KEY (id_package) REFERENCES packages(id_package)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_appointments_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ventas (encabezado)
CREATE TABLE sales (
  id_sale INT AUTO_INCREMENT PRIMARY KEY,
  id_business CHAR(36) NOT NULL,
  id_user CHAR(36) DEFAULT NULL,
  id_client INT DEFAULT NULL,
  folio VARCHAR(50) DEFAULT NULL UNIQUE,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  subtotal DECIMAL(10, 2) DEFAULT 0.00,
  discount_rate DECIMAL(5, 2) DEFAULT 0.00,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  iva DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) DEFAULT 0.00,
  payment_method VARCHAR(50) DEFAULT NULL,
  status ENUM('open', 'closed', 'cancelled') DEFAULT 'closed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_business
    FOREIGN KEY (id_business) REFERENCES businesses(id_business)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_sales_user
    FOREIGN KEY (id_user) REFERENCES users(id_users)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_sales_client
    FOREIGN KEY (id_client) REFERENCES clients(id_client)
    ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX idx_sales_date (date),
  INDEX idx_sales_folio (folio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Detalle de ventas (líneas)
CREATE TABLE sale_items (
  id_sale_item INT AUTO_INCREMENT PRIMARY KEY,
  id_sale INT NOT NULL,
  item_type ENUM('service', 'product', 'package') NOT NULL,
  item_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  quantity INT DEFAULT 1,
  unit_price DECIMAL(10, 2) DEFAULT 0.00,
  cost DECIMAL(10, 2) DEFAULT 0.00,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  subtotal DECIMAL(10, 2) DEFAULT 0.00,
  iva DECIMAL(10, 2) DEFAULT 0.00,
  total DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sale_items_sale
    FOREIGN KEY (id_sale) REFERENCES sales(id_sale)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos iniciales
INSERT INTO languages (language, code) VALUES
  ('Español', 'es'),
  ('English', 'en');
