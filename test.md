"title":"t3",
 "author":"a3",
 "category":"c3",
 "price":300,
 "quantity":3
 
# Sample Users

## Admin
POST /register
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "adminpass",
  "role": "admin"
}
```

## Seller
POST /register
```json
{
  "name": "Seller One",
  "email": "seller1@example.com",
  "password": "sellerpass",
  "role": "seller"
}
```

## User
POST /register
```json
{
  "name": "Normal User",
  "email": "user1@example.com",
  "password": "userpass",
  "role": "user"
}
```

# Login

POST /login
```json
{
  "email": "admin@example.com",
  "password": "adminpass"
}
```
```json
{
  "email": "seller1@example.com",
  "password": "sellerpass"
}
```
```json
{
  "email": "user1@example.com",
  "password": "userpass"
}
```

# Sample Books (as Seller)

POST /books (token: seller/admin)
```json
{
  "title": "Book One",
  "author": "Author A",
  "category": "Fiction",
  "price": 100,
  "quantity": 10
}
```
```json
{
  "title": "Book Two",
  "author": "Author B",
  "category": "Science",
  "price": 200,
  "quantity": 5
}
```

# Get All Books (as any user)
GET /books

# Search Books (as any user)
GET /books?category=Fiction
GET /books?author=Author%20A

# Buy Books (as user/seller)
POST /order (token: user/seller)
```json
{
  "books": ["<bookId1>", "<bookId2>"],
  "totalAmount": 300
}
```

# Get My Orders (as user/seller)
GET /myorders

# Delete My Order (as user/seller)
DELETE /myorders/<orderId>

# Seller: Update Own Book
PATCH /books/<bookId> (token: seller)
```json
{
  "price": 150
}
```

# Seller: Delete Own Book
DELETE /books/<bookId> (token: seller)

# Admin: Get All Users
GET /users (token: admin)

# Admin: Block/Unblock User or Seller
PATCH /users/<userId>/block (token: admin)
PATCH /users/<userId>/unblock (token: admin)

# Admin: Delete User or Seller
DELETE /users/<userId> (token: admin)

# Admin: Get All Books
GET /allbooks (token: admin)