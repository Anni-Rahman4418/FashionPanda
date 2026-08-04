from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routers import auth, products, orders, payments, users

app = FastAPI(
    title="FashionPanda API",
    description="Express Fashion Delivery Platform REST API with full CRUD operations for Products, Orders, Users, and Payments.",
    version="1.0.0",
)

# frontend runs on a different port during dev, so we need this open
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

app.include_router(auth.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(users.router, prefix="/api")


@app.get("/")
def home():
    return {"message": "Welcome to FashionPanda API", "status": "online", "version": "1.0.0"}
