"""Request/response models used by the routers."""

from typing import List, Optional
from pydantic import BaseModel


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
