import sqlite3

from fastapi import APIRouter, HTTPException, status

from ..database import get_db
from ..schemas import UserRegisterSchema, UserLoginSchema

router = APIRouter(tags=["auth"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
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
        return {"id": user_id, "name": user.name, "email": user.email, "role": user.role}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Email already registered")
    finally:
        conn.close()


@router.post("/login")
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
            "role": user_dict["role"],
        }
    }
