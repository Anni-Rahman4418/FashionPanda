"""
Everything related to the sqlite connection lives here - the schema, the
seed data and a couple of small helpers. Keeping it separate from the
routes means we can swap sqlite for something else later without touching
any of the API code.
"""

import sqlite3
import json

DB_PATH = "fashionpanda.db"


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'customer',
            store_name TEXT,
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            price REAL NOT NULL,
            original_price REAL,
            category TEXT NOT NULL,
            image_url TEXT NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0,
            retailer_id TEXT NOT NULL,
            retailer_name TEXT NOT NULL,
            sizes JSON NOT NULL,
            colors JSON NOT NULL,
            rating REAL DEFAULT 5.0,
            delivery_eta_minutes INTEGER DEFAULT 45,
            is_express BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            user_name TEXT NOT NULL,
            user_address TEXT NOT NULL,
            user_phone TEXT NOT NULL,
            items JSON NOT NULL,
            subtotal REAL NOT NULL,
            delivery_fee REAL NOT NULL,
            tax REAL NOT NULL,
            total_amount REAL NOT NULL,
            payment_method TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Placed',
            estimated_delivery_time TEXT NOT NULL,
            courier_name TEXT,
            courier_phone TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS payments (
            id TEXT PRIMARY KEY,
            order_id TEXT NOT NULL,
            payment_method TEXT NOT NULL,
            amount REAL NOT NULL,
            status TEXT NOT NULL DEFAULT 'Success',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    _seed_if_empty(cursor, conn)
    conn.close()


def _seed_if_empty(cursor, conn):
    # only seed on a fresh db, don't want to duplicate rows on every restart
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
            INSERT INTO users (id, name, email, password, role, store_name, address)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, [
            ('user-1', 'Anni Rahman', 'anni@fashionpanda.com', '123456', 'customer', None, '742 Evergreen Terrace'),
            ('user-2', 'Velvet Vault Boutique', 'contact@velvetvault.com', '123456', 'retailer', 'Velvet Vault Boutique', '108 Soho Street'),
            ('user-3', 'Panda Admin', 'admin@fashionpanda.com', '123456', 'admin', None, 'Panda HQ'),
        ])

    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
            INSERT INTO products (id, name, description, price, original_price, category, image_url,
                                   stock, retailer_id, retailer_name, sizes, colors, rating,
                                   delivery_eta_minutes, is_express)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, [
            (
                'prod-101', 'Neon Cyberpunk Oversized Hoodie',
                'Heavyweight organic cotton hoodie with reflective print and magnetic zip pockets.',
                129.99, 169.99, 'Streetwear',
                'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
                24, 'user-2', 'Velvet Vault Boutique',
                json.dumps(['S', 'M', 'L', 'XL']), json.dumps(['Obsidian Black', 'Cyber Neon']),
                4.9, 45, 1
            ),
            (
                'prod-102', 'Tailored Velvet Double-Breasted Blazer',
                'Italian velvet tailored blazer with satin peak lapels.',
                349.50, 420.00, 'Formal',
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
                8, 'user-2', 'Velvet Vault Boutique',
                json.dumps(['M', 'L', 'XL']), json.dumps(['Midnight Blue', 'Emerald Green']),
                4.8, 60, 0
            ),
            (
                'prod-103', 'Retro Acid-Wash Denim Jacket',
                'Vintage 90s distressed denim with plush shearling lining.',
                189.00, 215.00, 'Streetwear',
                'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80',
                15, 'user-2', 'Urban Threadz',
                json.dumps(['XS', 'S', 'M']), json.dumps(['Vintage Wash']),
                4.7, 30, 1
            ),
        ])

    conn.commit()
