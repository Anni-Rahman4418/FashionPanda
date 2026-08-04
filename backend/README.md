# FashionPanda backend

FastAPI + sqlite. Split into small modules instead of one big file:

```
backend/
├── run.py                 # entry point, run this
├── requirements.txt
└── app/
    ├── main.py             # creates the app, sets up CORS, mounts the routers
    ├── database.py         # sqlite connection, table creation, seed data
    ├── schemas.py           # pydantic request/response models
    ├── serializers.py       # turns db rows into the camelCase shape the frontend expects
    └── routers/
        ├── auth.py          # /api/register, /api/login
        ├── products.py      # /api/products
        ├── orders.py        # /api/orders
        ├── payments.py      # /api/payments
        └── users.py         # /api/users
```

## Running it

```bash
pip install -r requirements.txt
python run.py
```

Or, equivalently:

```bash
uvicorn app.main:app --reload
```

Server comes up on `http://localhost:8000`. It uses a local `fashionpanda.db`
sqlite file which gets created (and seeded with a few sample products/users)
automatically on first run - delete that file if you want a clean slate.

No `.env` needed right now since there's no external service or secret key
in play yet.
