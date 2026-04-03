# Microservices API

## Table of Contents

- [Health](#health)
  - [GET /health](#get-health)
  - [GET /users/health](#get-usershealth)
  - [GET /products/health](#get-productshealth)
- [Authentication (JWT)](#authentication-jwt)
  - [POST /users/login](#post-userslogin)
- [Users](#users)
  - [POST /users](#post-users)
  - [GET /users/me](#get-usersme)
  - [PUT /users/me](#put-usersme)
  - [DELETE /users/me](#delete-usersme)
- [Products](#products)
  - [GET /products/:id](#get-productsid)
  - [POST /products](#post-products)
  - [PUT /products/:id](#put-productsid)
  - [DELETE /products/:id](#delete-productsid)

## Health

### GET `/health`

Returns the gateway health.

Response:

- `200 OK`
  - Body:
    ```json
    { "status": "ok" }
    ```

### GET `/users/health`

Proxied to the User Service health endpoint.

Response:

- `200 OK`
  - Body:
    ```json
    { "status": "ok" }
    ```

### GET `/products/health`

Proxied to the Product Service health endpoint.

Response:

- `200 OK`
  - Body:
    ```json
    { "status": "ok" }
    ```

## Authentication (JWT)

Some endpoints require a JWT issued by the User Service.

Header:

- `Authorization: Bearer <token>`

Error behavior:

- Missing/invalid `Authorization` header:
  - `401 Unauthorized` (missing/invalid scheme or missing token)
- Invalid token:
  - `403 Forbidden`

### POST `/users/login`

Authenticate a user and receive a JWT.

Request:

- `Content-Type: application/json`
- Body:
  ```json
  { "email": "user@example.com", "password": "secret" }
  ```

Responses:

- `200 OK`
  - Body:
    ```json
    { "token": "<jwt>" }
    ```
- `400 Bad Request`
  - Body (plain text):
    - `Email and password are required`
- `401 Unauthorized`
  - Body (plain text):
    - `Invalid credentials`

## Users

### POST `/users`

Create a new user.

Auth: none

Request:

- `Content-Type: application/json`
- Body:
  ```json
  { "name": "Alice", "email": "alice@example.com", "password": "secret" }
  ```

Responses:

- `201 Created`
  - Body (example):
    ```json
    {
      "_id": "60f...aBc123",
      "name": "Alice",
      "email": "alice@example.com",
      "__v": 0
    }
    ```
- `400 Bad Request`
  - Body (plain text or error):
    - `name, email, and password are required`
    - or a Mongoose/Mongo validation error (e.g., duplicate email)

### GET `/users/me`

Fetch the authenticated user profile.

Auth: required

Responses:

- `200 OK`
  - Body (example):
    ```json
    {
      "_id": "60f...aBc123",
      "name": "Alice",
      "email": "alice@example.com",
      "__v": 0
    }
    ```
- `401 Unauthorized` (missing token)
- `403 Forbidden` (invalid token)
- `404 Not Found`
  - Body (plain text): `User not found`
- `400 Bad Request`
  - Body: Mongoose/Mongo validation/cast error (e.g., malformed user id)

### PUT `/users/me`

Update the authenticated user.

Auth: required

Request:

- `Content-Type: application/json`
- Body:
  ```json
  { "name": "Alice", "email": "alice@example.com", "password": "new-secret" }
  ```

Responses:

- `200 OK`
  - Body (example):
    ```json
    {
      "_id": "60f...aBc123",
      "name": "Alice Updated",
      "email": "alice@example.com",
      "__v": 0
    }
    ```
- `400 Bad Request`
  - Body (plain text or error):
    - `name, email, and password are required`
    - or a Mongoose/Mongo validation/cast error
- `401 Unauthorized` (missing token)
- `403 Forbidden` (invalid token)
- `404 Not Found`
  - Body (plain text): `User not found`

### DELETE `/users/me`

Delete the authenticated user.

Auth: required

Responses:

- `200 OK`
  - Body (example):
    ```json
    {
      "_id": "60f...aBc123",
      "name": "Alice",
      "email": "alice@example.com",
      "__v": 0
    }
    ```
- `401 Unauthorized` (missing token)
- `403 Forbidden` (invalid token)
- `404 Not Found`
  - Body (plain text): `User not found`
- `400 Bad Request`
  - Body: Mongoose/Mongo validation/cast error

## Products

### GET `/products/:id`

Fetch a product by its `id`.

Auth: none

Request:

- `:id` (path param): product identifier stored in the `id` field

Responses:

- `200 OK`
  - Body (example):
    ```json
    {
      "_id": "60f...dEf456",
      "id": "p-123",
      "name": "Phone",
      "description": "Smart phone",
      "price": 100,
      "category": "electronics",
      "__v": 0
    }
    ```
- `404 Not Found`
  - Body (plain text): `Product not found`
- `400 Bad Request`
  - Body: Mongoose/Mongo validation/cast error

### POST `/products`

Create a product.

Auth: required

Request:

- `Content-Type: application/json`
- Body:
  ```json
  {
    "id": "p-123",
    "name": "Phone",
    "description": "Smart phone",
    "price": 100,
    "category": "electronics"
  }
  ```

Responses:

- `201 Created`
  - Body (example):
    ```json
    {
      "_id": "60f...dEf456",
      "id": "p-123",
      "name": "Phone",
      "description": "Smart phone",
      "price": 100,
      "category": "electronics",
      "__v": 0
    }
    ```
- `400 Bad Request`
  - Body (plain text):
    - `id, name, description, price, and category are required`
    - or a Mongoose/Mongo validation/cast error
- `401 Unauthorized` (missing token)
- `403 Forbidden` (invalid token)

### PUT `/products/:id`

Update a product (selected by path `:id`).

Auth: required

Request:

- `Content-Type: application/json`
- Body (same fields as `POST`):
  ```json
  {
    "id": "p-123",
    "name": "Updated name",
    "description": "Updated description",
    "price": 120,
    "category": "electronics"
  }
  ```

Notes:

- The update targets the product where `product.id === :id`.
- The stored `id` may be replaced by `body.id`.

Responses:

- `200 OK`
  - Body (example):
    ```json
    {
      "_id": "60f...dEf456",
      "id": "p-123",
      "name": "Updated name",
      "description": "Updated description",
      "price": 120,
      "category": "electronics",
      "__v": 0
    }
    ```
- `400 Bad Request`
  - Body (plain text or error):
    - `id, name, description, price, and category are required`
    - or a Mongoose/Mongo validation/cast error
- `401 Unauthorized` (missing token)
- `403 Forbidden` (invalid token)
- `404 Not Found`
  - Body (plain text): `Product not found`

### DELETE `/products/:id`

Delete a product by `id`.

Auth: required

Responses:

- `200 OK`
  - Body (example):
    ```json
    {
      "_id": "60f...dEf456",
      "id": "p-123",
      "name": "Phone",
      "description": "Smart phone",
      "price": 100,
      "category": "electronics",
      "__v": 0
    }
    ```
- `401 Unauthorized` (missing token)
- `403 Forbidden` (invalid token)
- `404 Not Found`
  - Body (plain text): `Product not found`
- `400 Bad Request`
  - Body: Mongoose/Mongo validation/cast error
