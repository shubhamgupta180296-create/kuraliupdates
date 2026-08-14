PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 email TEXT UNIQUE NOT NULL,
 phone TEXT,
 password_hash TEXT NOT NULL,
 password_salt TEXT NOT NULL,
 role TEXT NOT NULL DEFAULT 'customer',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY,
 user_id INTEGER NOT NULL,
 expires_at INTEGER NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sellers (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 user_id INTEGER UNIQUE,
 business_name TEXT NOT NULL,
 owner_name TEXT NOT NULL,
 phone TEXT NOT NULL,
 category TEXT NOT NULL,
 address TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS categories (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 seller_id INTEGER NOT NULL,
 name TEXT NOT NULL,
 description TEXT,
 price_paise INTEGER NOT NULL,
 category TEXT NOT NULL,
 image_url TEXT,
 stock INTEGER NOT NULL DEFAULT 0,
 status TEXT NOT NULL DEFAULT 'pending',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(seller_id) REFERENCES sellers(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wards (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 ward_number INTEGER UNIQUE NOT NULL,
 name TEXT,
 mc_name TEXT,
 mc_phone TEXT,
 mc_email TEXT
);

CREATE TABLE IF NOT EXISTS complaints (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 complaint_no TEXT UNIQUE NOT NULL,
 user_id INTEGER,
 name TEXT NOT NULL,
 phone TEXT NOT NULL,
 ward_id INTEGER NOT NULL,
 issue_type TEXT NOT NULL,
 details TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'submitted',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL,
 FOREIGN KEY(ward_id) REFERENCES wards(id)
);

CREATE TABLE IF NOT EXISTS complaint_updates (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 complaint_id INTEGER NOT NULL,
 status TEXT NOT NULL,
 note TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 order_no TEXT UNIQUE NOT NULL,
 user_id INTEGER,
 customer_name TEXT NOT NULL,
 phone TEXT NOT NULL,
 address TEXT NOT NULL,
 total_paise INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'placed',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 order_id INTEGER NOT NULL,
 product_id INTEGER NOT NULL,
 seller_id INTEGER NOT NULL,
 quantity INTEGER NOT NULL,
 unit_price_paise INTEGER NOT NULL,
 FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE,
 FOREIGN KEY(product_id) REFERENCES products(id),
 FOREIGN KEY(seller_id) REFERENCES sellers(id)
);

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_complaints_no ON complaints(complaint_no);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

INSERT OR IGNORE INTO categories(name) VALUES
('Food'),('Fashion'),('Home'),('Services'),('Electronics'),('Other');

-- Placeholder wards. Replace with verified official data before launch.
INSERT OR IGNORE INTO wards(ward_number,name) VALUES
(1,'Ward 1'),(2,'Ward 2'),(3,'Ward 3'),(4,'Ward 4'),(5,'Ward 5'),
(6,'Ward 6'),(7,'Ward 7'),(8,'Ward 8'),(9,'Ward 9'),(10,'Ward 10'),
(11,'Ward 11'),(12,'Ward 12'),(13,'Ward 13'),(14,'Ward 14'),(15,'Ward 15');
