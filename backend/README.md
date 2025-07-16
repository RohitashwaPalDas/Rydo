# User Registration API

## Endpoint

`POST /user/register`

---

## Description

This endpoint allows a new user to register by providing their email, first name, last name, and password.  
The server validates the input data and creates a new user in the database if the data is valid and the user does not already exist.

---

## Request Body

The request body must be in JSON format and include the following fields:

- `email`: A valid email address (string, **required**)
- `fullname`: An object containing:
  - `firstname`: The user's first name (string, **required**, minimum length: 3)
  - `lastname`: The user's last name (string, *optional*; if provided, minimum length: 3)
- `password`: A password for the user account (string, **required**, minimum length: 6)

---

## Example Request

```json
{
  "email": "example@example.com",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "password": "strongpassword"
}
```

---

## Responses

### ✅ Success Response

- **Status Code**: `201 Created`
- **Content**:

```json
{
  "success": true,
  "message": "Registered successfully",
  "token": "your_jwt_token_here"
}
```

---

### ❌ Error Responses

#### 1. Validation Error

- **Status Code**: `400 Bad Request`
- **Content**:

```json
{
  "success": false,
  "message": "Some error occurred",
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

This response indicates validation errors in the request body.

---

#### 2. User Already Exists

- **Status Code**: `400 Bad Request`
- **Content**:

```json
{
  "success": false,
  "message": "User already exist"
}
```

---

# User Login API

## Endpoint

`POST /user/login`

---

## Description

This endpoint allows a registered user to log in by providing their email and password.  
If the credentials are correct, a JWT token is returned.

---

## Request Body

The request body must be in JSON format and include the following fields:

- `email`: The user's registered email (string, **required**)
- `password`: The user's password (string, **required**)

---

## Example Request

```json
{
  "email": "example@example.com",
  "password": "strongpassword"
}
```

---

## Responses

### ✅ Success Response

- **Status Code**: `200 OK`
- **Content**:

```json
{
  "success": true,
  "message": "logged in Successfully",
  "token": "your_jwt_token_here"
}
```

---

### ❌ Error Responses

#### 1. User Not Found

- **Status Code**: `400 Bad Request`
- **Content**:

```json
{
  "success": false,
  "message": "User can't find with this email"
}
```

#### 2. Incorrect Password

- **Status Code**: `400 Bad Request`
- **Content**:

```json
{
  "success": false,
  "message": "Incorrect Password"
}
```

#### 3. Server Error

- **Status Code**: `400 Bad Request`
- **Content**:

```json
{
  "success": false,
  "message": "Error message from server"
}
```

---

# Get Current User API

## Endpoint

`GET /user/get-user`

---

## Description

This endpoint returns the current authenticated user's details.  
Authentication is required via a valid JWT token.

---

## Headers

- `Authorization`: Bearer `<token>`  
  or  
- Cookie: `token=<jwt_token>`

---

## Success Response

- **Status Code**: `200 OK`
- **Content**:

```json
{
  "_id": "user_id_here",
  "email": "example@example.com",
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  }
}
```

---

## Error Response

- **Status Code**: `401 Unauthorized`
- **Content**:

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

# User Logout API

## Endpoint

`POST /user/logout`

---

## Description

Logs out the authenticated user by clearing the JWT token from cookies and adding it to the blacklist so it can't be reused.

---

## Headers

- `Authorization`: Bearer `<token>`  
  or  
- Cookie: `token=<jwt_token>`

---

## Success Response

- **Status Code**: `200 OK`
- **Content**:

```json
{
  "success": true,
  "message": "Logged out"
}
```

---

## Error Response

- **Status Code**: `400 Bad Request`
- **Content**:

```json
{
  "success": false,
  "message": "Error message from server"
}
```

---

## Notes

- Tokens are blacklisted in the database and will expire automatically after 24 hours.
- You must be authenticated to call this endpoint.

---

# Driver API Documentation

## Base Route: `/driver`

---

## 1. Register Driver

### Endpoint

`POST /driver/register`

### Description

Registers a new driver with required personal and vehicle information.

### Request Body

```json
{
  "email": "driver@example.com",
  "fullname": {
    "firstname": "Alex",
    "lastname": "Rider"
  },
  "password": "securepass123",
  "vehicle": {
    "color": "Red",
    "plate": "WB1234XZ",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### Validations

- `email`: must be a valid email
- `fullname.firstname`: minimum 3 characters
- `password`: minimum 6 characters (server enforces minimum 8)
- `vehicle.color`: minimum 3 characters
- `vehicle.plate`: minimum 3 characters
- `vehicle.capacity`: integer, at least 1
- `vehicle.vehicleType`: must be one of `car`, `motorcycle`, `auto`

### Success Response

- **Status**: `201 Created`

```json
{
  "success": true,
  "message": "registered Successfully",
  "token": "your_jwt_token"
}
```

### Error Responses

- Missing fields or validation error:

```json
{
  "success": false,
  "message": "Some error occurred",
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

- Driver already exists:

```json
{
  "success": false,
  "message": "Driver already exist"
}
```

---

## 2. Login Driver

### Endpoint

`POST /driver/login`

### Description

Logs in a registered driver using email and password.

### Request Body

```json
{
  "email": "driver@example.com",
  "password": "securepass123"
}
```

### Success Response

- **Status**: `200 OK`

```json
{
  "success": true,
  "message": "logged in Successfully",
  "token": "your_jwt_token"
}
```

### Error Responses

- Email not found:

```json
{
  "success": false,
  "message": "Driver can't find with this email"
}
```

- Incorrect password:

```json
{
  "success": false,
  "message": "Incorrect Password"
}
```

---

## 3. Get Current Driver

### Endpoint

`GET /driver/get-driver`

### Description

Returns the authenticated driver’s data.  
Requires a valid JWT token.

### Headers

- `Authorization`: Bearer `<token>`
- or use the `token` cookie.

### Success Response

```json
{
  "_id": "driver_id_here",
  "email": "driver@example.com",
  "fullname": {
    "firstname": "Alex",
    "lastname": "Rider"
  },
  "vehicle": {
    "color": "Red",
    "plate": "WB1234XZ",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

---

## 4. Logout Driver

### Endpoint

`POST /driver/logout`

### Description

Logs out the driver by clearing the token and adding it to a blacklist.  
The token will expire from the blacklist after 24 hours.

### Headers

- `Authorization`: Bearer `<token>`
- or use the `token` cookie.

### Success Response

```json
{
  "success": true,
  "message": "Logged out"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message from server"
}
```

---

## Notes

- The token is blacklisted using a TTL (expires in 24 hours).
- Ensure to send token via headers or cookies for `/get-driver` and `/logout`.


## Author

Rohitashwa Pal Das  
