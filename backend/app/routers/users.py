from fastapi import APIRouter

from ..database import get_db

router = APIRouter(prefix="/users", tags=["users"])


@router.get("")
def get_users():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, email, role, store_name as storeName, address, created_at as createdAt FROM users")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.delete("/{user_id}")
def delete_user(user_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": f"User {user_id} deleted"}
