"""
The db columns are snake_case, the frontend expects camelCase - these
just do that translation in one place instead of repeating it in every
route.
"""

import json


def product_to_dict(row) -> dict:
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
        "createdAt": item["created_at"],
    }


def order_to_dict(row) -> dict:
    item = dict(row)
    return {
        "id": item["id"],
        "userId": item["user_id"],
        "userName": item["user_name"],
        "userAddress": item["user_address"],
        "userPhone": item["user_phone"],
        "items": json.loads(item["items"]),
        "subtotal": item["subtotal"],
        "deliveryFee": item["delivery_fee"],
        "tax": item["tax"],
        "totalAmount": item["total_amount"],
        "paymentMethod": item["payment_method"],
        "status": item["status"],
        "estimatedDeliveryTime": item["estimated_delivery_time"],
        "courierName": item["courier_name"],
        "courierPhone": item["courier_phone"],
        "createdAt": item["created_at"],
    }
