import json
from typing import Optional

from fastapi import APIRouter, HTTPException, status

from ..database import get_db
from ..schemas import ProductSchema, ProductUpdateSchema
from ..serializers import product_to_dict

router = APIRouter(prefix="/products", tags=["products"])


@router.get("")
def get_products(category: Optional[str] = None, search: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM products WHERE 1=1"
    params = []
    if category and category != "All":
        query += " AND category = ?"
        params.append(category)
    if search:
        query += " AND (name LIKE ? OR description LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%"])
    query += " ORDER BY created_at DESC"

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    return [product_to_dict(row) for row in rows]


@router.get("/{product_id}")
def get_product_by_id(product_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Product not found")
    return product_to_dict(row)


@router.post("", status_code=status.HTTP_201_CREATED)
def create_product(product: ProductSchema):
    conn = get_db()
    cursor = conn.cursor()
    prod_id = f"prod-{int(cursor.execute('SELECT COUNT(*) FROM products').fetchone()[0]) + 101}"

    cursor.execute("""
        INSERT INTO products (id, name, description, price, original_price, category, image_url,
                               stock, retailer_id, retailer_name, sizes, colors, rating,
                               delivery_eta_minutes, is_express)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        prod_id, product.name, product.description, product.price, product.originalPrice,
        product.category, product.imageUrl, product.stock, product.retailerId, product.retailerName,
        json.dumps(product.sizes), json.dumps(product.colors), product.rating,
        product.deliveryEtaMinutes, int(product.isExpress)
    ))
    conn.commit()
    conn.close()
    return {**product.dict(), "id": prod_id}


@router.put("/{product_id}")
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
        if key in ("sizes", "colors"):
            val = json.dumps(val)
        elif key == "isExpress":
            val = int(val)

        snake_key = "".join(["_" + c.lower() if c.isupper() else c for c in key]).lstrip("_")
        set_clauses.append(f"{snake_key} = ?")
        params.append(val)

    params.append(product_id)
    cursor.execute(f"UPDATE products SET {', '.join(set_clauses)} WHERE id = ?", params)
    conn.commit()
    conn.close()
    return get_product_by_id(product_id)


@router.delete("/{product_id}")
def delete_product(product_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM products WHERE id = ?", (product_id,))
    conn.commit()
    conn.close()
    return {"success": True, "message": f"Product {product_id} deleted"}
