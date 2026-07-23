import sqlite3
import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="FashionPanda API",
    description="Express Fashion Delivery Platform REST API with full CRUD operations for Products, Orders, Users, and Payments.",
    version="1.0.0"
)

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "fashionpanda.db"

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Database Initializer & Seeder
def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table
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

    # Products table
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

    # Orders table
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

    # Payments table
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

    # Seed Initial Data if empty
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
        INSERT INTO users (id, name, email, password, role, store_name, address)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, [
            ('user-1', 'Anni Rahman', 'anni@fashionpanda.com', '123456', 'customer', None, '742 Evergreen Terrace'),
            ('user-2', 'Velvet Vault Boutique', 'contact@velvetvault.com', '123456', 'retailer', 'Velvet Vault Boutique', '108 Soho Street'),
            ('user-3', 'Panda Admin', 'admin@fashionpanda.com', '123456', 'admin', None, 'Panda HQ')
        ])

    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        cursor.executemany("""
        INSERT INTO products (id, name, description, price, original_price, category, image_url, stock, retailer_id, retailer_name, sizes, colors, rating, delivery_eta_minutes, is_express)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, [
            (
                'prod-101', 'Neon Cyberpunk Oversized Hoodie',
                'Heavyweight organic cotton hoodie with reflective print and magnetic zip pockets.',
                129.99, 169.99, 'Streetwear',
                'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
                24, 'user-2', 'Velvet Vault Boutique', json.dumps(['S', 'M', 'L', 'XL']), json.dumps(['Obsidian Black', 'Cyber Neon']), 4.9, 45, 1
            ),
            (
                'prod-102', 'Tailored Velvet Double-Breasted Blazer',
                'Italian velvet tailored blazer with satin peak lapels.',
                349.50, 420.00, 'Formal',
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
                8, 'user-2', 'Velvet Vault Boutique', json.dumps(['M', 'L', 'XL']), json.dumps(['Midnight Blue', 'Emerald Green']), 4.8, 60, 0
            ),
            (
                'prod-103', 'Retro Acid-Wash Denim Jacket',
                'Vintage 90s distressed denim with plush shearling lining.',
                189.00, 215.00, 'Streetwear',
                'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=800&q=80',
                15, 'user-2', 'Urban Threadz', json.dumps(['XS', 'S', 'M']), json.dumps(['Vintage Wash']), 4.7, 30, 1
            )
        ])

    conn.commit()
    conn.close()

# Initialize Database on startup
init_db()

# PYDANTIC SCHEMAS
class UserRegisterSchema(BaseModel):
    name: str
    email: str
    password: str = "123456"
    role: str = "customer"
    storeName: Optional[str] = None
    address: Optional[str] = None

class UserLoginSchema(BaseModel):
    email: str
    password: str

class ProductSchema(BaseModel):
    name: str
    description: str
    price: float
    originalPrice: Optional[float] = None
    category: str
    imageUrl: str
    stock: int = 10
    retailerId: str = "user-2"
    retailerName: str = "Velvet Vault Boutique"
    sizes: List[str] = ["S", "M", "L"]
    colors: List[str] = ["Black"]
    rating: float = 5.0
    deliveryEtaMinutes: int = 45
    isExpress: bool = True

class ProductUpdateSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    originalPrice: Optional[float] = None
    category: Optional[str] = None
    imageUrl: Optional[str] = None
    stock: Optional[int] = None
    retailerName: Optional[str] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    rating: Optional[float] = None
    deliveryEtaMinutes: Optional[int] = None
    isExpress: Optional[bool] = None

class OrderSchema(BaseModel):
    userId: str
    userName: str
    userAddress: str
    userPhone: str
    items: List[dict]
    subtotal: float
    deliveryFee: float
    tax: float
    totalAmount: float
    paymentMethod: str
    status: str = "Placed"
    estimatedDeliveryTime: str = "35 mins"

class OrderStatusUpdateSchema(BaseModel):
    status: str

class PaymentSchema(BaseModel):
    orderId: str
    paymentMethod: str
    amount: float

# ROUTES

@app.get("/")
def home():
    return {"message": "Welcome to FashionPanda API", "status": "online", "version": "1.0.0"}

# AUTH ROUTES
@app.post("/api/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserRegisterSchema):
    conn = get_db()
    cursor = conn.cursor()
    user_id = f"user-{int(cursor.execute('SELECT COUNT(*) FROM users').fetchone()[0]) + 101}"
    try:
        cursor.execute(
            "INSERT INTO users (id, name, email, password, role, store_name, address) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (user_id, user.name, user.email, user.password, user.role, user.storeName, user.address)
        )
        conn.commit()
        conn.close()
        return {"id": user_id, "name": user.name, "email": user.email, "role": user.role}
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

@app.post("/api/login")
def login_user(creds: UserLoginSchema):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ? AND password = ?", (creds.email, creds.password))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user_dict = dict(row)
    return {
        "success": True,
        "message": "Login Successful",
        "user": {
            "id": user_dict["id"],
            "name": user_dict["name"],
            "email": user_dict["email"],
            "role": user_dict["role"]
        }
    }

# PRODUCTS CRUD
@app.get("/api/products")
def get_products(category: Optional[str] = None, search: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    query = "SELECT * FROM products WHERE 1=1"
    params = []
    if category and category != 'All':
        query += " AND category = ?"
        params.append(category)
    if search:
        query += " AND (name LIKE ? OR description LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])
    
    query += " ORDER BY created_at DESC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        item = dict(r)
        result.append({
            "id": item["id"],
            "name": item["name"],
            "description": item["description"],
            "price": item["price"],
            "originalPrice": item["original_price"],
            "category": item["category"],
            "imageUrl": item["image_url"],
            "stock": item["stock"],
            "retailerId": item["retailer_id"],
            "retailerName": item["retailer_name"],
            "sizes": json.loads(item["sizes"]),
            "colors": json.loads(item["colors"]),
            "rating": item["rating"],
            "deliveryEtaMinutes": item["delivery_eta_minutes"],
            "isExpress": bool(item["is_express"]),
            "createdAt": item["created_at"]
        })
    return result

@app.get("/api/products/{product_id}")
def get_product_by_id(product_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    item = dict(row)
    return {
        "id": item["id"],
        "name": item["name"],
        "description": item["description"],
        "price": item["price"],
        "originalPrice": item["original_price"],
        "category": item["category"],
        "imageUrl": item["image_url"],
        "stock": item["stock"],
        "retailerId": item["retailer_id"],
        "retailerName": item["retailer_name"],
        "sizes": json.loads(item["sizes"]),
        "colors": json.loads(item["colors"]),
        "rating": item["rating"],
        "deliveryEtaMinutes": item["delivery_eta_minutes"],
        "isExpress": bool(item["is_express"]),
        "createdAt": item["created_at"]
    }

@app.post("/api/products", status_code=status.HTTP_201_CREATED)
def create_product(product: ProductSchema):
    conn = get_db()
    cursor = conn.cursor()
    prod_id = f"prod-{int(cursor.execute('SELECT COUNT(*) FROM products').fetchone()[0]) + 101}"
    cursor.execute("""
    INSERT INTO products (id, name, description, price, original_price, category, image_url, stock, retailer_id, retailer_name, sizes, colors, rating, delivery_eta_minutes, is_express)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        prod_id, product.name, product.description, product.price, product.originalPrice,
        product.category, product.imageUrl, product.stock, product.retailerId, product.retailerName,
        json.dumps(product.sizes), json.dumps(product.colors), product.rating, product.deliveryEtaMinutes, int(product.isExpress)
    ))
    conn.commit()
    conn.close()
    return {**product.dict(), "id": prod_id}

@app.put("/api/products/{product_id}")
def update_product(product_id: str, updates: ProductUpdateSchema):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    if not cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail="Product not found")

    update_dict = updates.dict(exclude_unset=True)
    if not update_dict:
        conn.close()
        return get_product_by_id(product_id)

    set_clauses = []
    params = []
    for key, val in update_dict.items():
        if key == 'sizes' or key == 'colors':
            val = json.dumps(val)
        elif key == 'isExpress':
            val = int(val)
        
        # Convert camelCase to snake_case
        snake_key = "".join(["_" + c.lower() if c.isupper() else c for c in key]).lstrip("_")
        set_clauses.append(f"{snake_key} = ?")
        params.append(val)

    params.append(product_id)
    cursor.execute(f"UPDATE products SET {', '.join(set_clauses)} WHERE id = ?", params)
    conn.commit()
    conn.close()
    return get_product_by_id(product_id)

@app.delete("/api/products/{product_id}")
def delete_product(product_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": f"Product {product_id} deleted"}

# ORDERS CRUD
@app.get("/api/orders")
def get_orders():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    res = []
    for r in rows:
        o = dict(r)
        res.append({
            "id": o["id"],
            "userId": o["user_id"],
            "userName": o["user_name"],
            "userAddress": o["user_address"],
            "userPhone": o["user_phone"],
            "items": json.loads(o["items"]),
            "subtotal": o["subtotal"],
            "deliveryFee": o["delivery_fee"],
            "tax": o["tax"],
            "totalAmount": o["total_amount"],
            "paymentMethod": o["payment_method"],
            "status": o["status"],
            "estimatedDeliveryTime": o["estimated_delivery_time"],
            "courierName": o["courier_name"],
            "courierPhone": o["courier_phone"],
            "createdAt": o["created_at"]
        })
    return res

@app.post("/api/orders", status_code=status.HTTP_201_CREATED)
def create_order(order: OrderSchema):
    conn = get_db()
    cursor = conn.cursor()
    order_id = f"ORD-{int(cursor.execute('SELECT COUNT(*) FROM orders').fetchone()[0]) + 9821}"
    cursor.execute("""
    INSERT INTO orders (id, user_id, user_name, user_address, user_phone, items, subtotal, delivery_fee, tax, total_amount, payment_method, status, estimated_delivery_time, courier_name, courier_phone)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        order_id, order.userId, order.userName, order.userAddress, order.userPhone,
        json.dumps(order.items), order.subtotal, order.deliveryFee, order.tax, order.totalAmount,
        order.paymentMethod, order.status, order.estimatedDeliveryTime, 'Panda Express Rider', '+1 (555) 900-1122'
    ))
    conn.commit()
    conn.close()
    return {**order.dict(), "id": order_id}

@app.put("/api/orders/{order_id}")
def update_order_status(order_id: str, payload: OrderStatusUpdateSchema):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (payload.status, order_id))
    conn.commit()
    conn.close()
    return {"id": order_id, "status": payload.status}

@app.delete("/api/orders/{order_id}")
def cancel_order(order_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status = 'Cancelled' WHERE id = ?", (order_id,))
    conn.commit()
    conn.close()
    return {"id": order_id, "status": "Cancelled"}

# PAYMENTS API
@app.post("/api/payments")
def process_payment(pay: PaymentSchema):
    conn = get_db()
    cursor = conn.cursor()
    pay_id = f"PAY-{int(cursor.execute('SELECT COUNT(*) FROM payments').fetchone()[0]) + 501}"
    cursor.execute(
        "INSERT INTO payments (id, order_id, payment_method, amount, status) VALUES (?, ?, ?, ?, ?)",
        (pay_id, pay.orderId, pay.paymentMethod, pay.amount, 'Success')
    )
    conn.commit()
    conn.close()
    return {"paymentId": pay_id, "orderId": pay.orderId, "status": "Success"}

# USERS CRUD
@app.get("/api/users")
def get_users():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, role, store_name as storeName, address, created_at as createdAt FROM users")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.delete("/api/users/{user_id}")
def delete_user(user_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": f"User {user_id} deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
