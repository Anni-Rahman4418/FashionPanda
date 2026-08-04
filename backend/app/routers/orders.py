import json

from fastapi import APIRouter, status

from ..database import get_db
from ..schemas import OrderSchema, OrderStatusUpdateSchema
from ..serializers import order_to_dict

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("")
def get_orders():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [order_to_dict(row) for row in rows]


@router.post("", status_code=status.HTTP_201_CREATED)
def create_order(order: OrderSchema):
    conn = get_db()
    cursor = conn.cursor()
    order_id = f"ORD-{int(cursor.execute('SELECT COUNT(*) FROM orders').fetchone()[0]) + 9821}"

    # courier gets assigned automatically for now - no dispatch system yet
    cursor.execute("""
        INSERT INTO orders (id, user_id, user_name, user_address, user_phone, items, subtotal,
                             delivery_fee, tax, total_amount, payment_method, status,
                             estimated_delivery_time, courier_name, courier_phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        order_id, order.userId, order.userName, order.userAddress, order.userPhone,
        json.dumps(order.items), order.subtotal, order.deliveryFee, order.tax, order.totalAmount,
        order.paymentMethod, order.status, order.estimatedDeliveryTime,
        "Panda Express Rider", "+1 (555) 900-1122"
    ))
    conn.commit()
    conn.close()
    return {**order.dict(), "id": order_id}


@router.put("/{order_id}")
def update_order_status(order_id: str, payload: OrderStatusUpdateSchema):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (payload.status, order_id))
    conn.commit()
    conn.close()
    return {"id": order_id, "status": payload.status}


@router.delete("/{order_id}")
def cancel_order(order_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status = 'Cancelled' WHERE id = ?", (order_id,))
    conn.commit()
    conn.close()
    return {"id": order_id, "status": "Cancelled"}
