# Posts API Documentation
The posts API provides endpoints for users to register, login and create posts.

## Register
**Request Format:** /register with POST parameters of `name`, `email` and `password`

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Given a name, email and password, reply with a plain text message regarding whether the registration was successful. Name and email must be unique (case insensitive).

**Example Request:** /register with POST parameters of `name=yilin`, `email=yilinz24@uw.edu` and `password=123456`

**Example Response:**
```
  "You have successfully registered!"
```

**Error Handling:**
- If email address is invalid, returns a 401 (invalid request) errors in plain text:
```
  "Invalid email address!"
```
- If name already exists, returns a 402 (invalid request) errors in plain text:
```
  "Name already exists!"
```
- If email already exists, returns a 403 (invalid request) errors in plain text:
```
  "Email already exists!"
```
- If any other error occurs, returns a 500 errors in plain text:
```
  "Unknown server error!"
```

## Login a user
**Request Format:** /login endpoint with POST parameters of `email` and `password`

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given a valid name and password, reply with a JSON response.

**Example Request:** /add with POST parameters of `email=yilinz24@uw.edu` and `password=123456`

**Example Response:**

```json
{
  "status": "success"
}
```

**Error Handling:**
- If user has already logged in, returns a 400 (invalid request) errors in plain text:
```
  "You have already logged in!"
```
- If email is invalid, returns a 401 (invalid request) errors in plain text:
```
  "Invalid email address!"
```
- If any other error occurs, returns a 500 errors in plain text:
```
  "Unknown server error!"
```

## Create a Post
**Request Format:** /post endpoint with POST parameters of `name`, `title`, `description` and `photo`

**Request Type:** POST

**Returned Data Format**: Plain Text

**Description:** Given a valid name and title, description and photo of a post, reply with a plain text message.

**Example Request:** /post with POST parameters of `name=yilin`, `title=today's eat`, `description=best chicken alfredo pasta ever`  and `photo=[photo]`

**Example Response:**

```
"You have successfully created a post!"
```

**Error Handling:**
- If name is invalid, returns a 401 (invalid request) errors in plain text:
```
  "Invalid name!"
```
- If any other error occurs, returns a 500 errors in plain text:
```
  "Unknown server error!"
```
