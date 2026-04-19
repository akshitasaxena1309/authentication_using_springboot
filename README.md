# 🔐 Authentication Using Spring Boot

A full-stack authentication system built with **Spring Boot**, **Spring Security**, **JWT**, and **OTP-based login**. Includes both REST APIs and web pages for login, signup, and OTP verification.

---

## 🚀 Tech Stack

| Technology           | Purpose                        |
| -------------------- | ------------------------------ |
| Java 17+             | Core language                  |
| Spring Boot          | Backend framework              |
| Spring Security      | Authentication & Authorization |
| JWT (JSON Web Token) | Stateless token-based auth     |
| MongoDB              | Database                       |
| OTP via Email        | Two-factor authentication      |
| Thymeleaf            | Server-side HTML templates     |
| Maven                | Build tool                     |
| Render               | Cloud deployment               |

---

## ✨ Features

- ✅ User Registration
- ✅ User Login with JWT token
- ✅ OTP-based Email Login
- ✅ OTP Verification
- ✅ Protected routes using JWT
- ✅ Password encryption with BCrypt
- ✅ Web pages for Login, Signup, OTP Login
- ✅ Stateless session management
- ✅ Environment-based configuration (.env)

---

## 📁 Project Structure

```
authentication/
├── src/
│   └── main/
│       ├── java/com/akshita/authentication/
│       │   ├── config/
│       │   │   └── SecurityConfig.java     # REST API endpoints
│       │   ├── controller/
│       │   │   ├── AuthController.java     # REST API endpoints
│       │   │   └── WebController.java      # Web page routes
│       │   ├── service/
│       │   │   └── AuthService.java
│       │   │   └── EmailService.java
│       │   │   └── OtpService.java
│       │   ├── model/
│       │   │   └── User.java               # User entity
│       │   ├── exception/
│       │   │   └── GlobalExceptionHandler.java
│       │   ├── repository/
│       │   │   └── UserReppository.java
│       │   ├── dto/
│       │   │   ├── RegisterRequest.java
│       │   │   ├── LoginRequest.java
│       │   │   ├── SendOtpRequest.java
│       │   │   ├── VerifyOtpRequest.java
│       │   │   └── ApiResponse.java
│       │   └── security/
│       │       ├── JwtFilter.java
│       │       └── JwtUtil.java
│       └── resources/
│           ├── static/
│           │   ├── css/
│           │   │    └── style.css
│           │   └── js/
│           │        └── auth.js
│           ├── templates/                  # Thymeleaf HTML pages
│           │   ├── login.html
│           │   ├── signup.html
│           │   ├── verify-otp.html
│           │   └── home.html
│           └── application.properties
├── .env                  # Local only - NOT pushed to GitHub
├── .gitignore
├── pom.xml
└── README.md
```

---

## ⚙️ Prerequisites

- [Java 17+](https://www.oracle.com/java/technologies/downloads/)
- [Maven 3.6+](https://maven.apache.org/download.cgi)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud DB)
- [Postman](https://www.postman.com/) (for API testing)

---

## 🛠️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/akshitasaxena1309/authentication_using_springboot.git
cd authentication_using_springboot
```

### 2. Create `.env` File

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://localhost:27017/authdb
JWT_SECRET=your_secret_key_here
JWT_EXPIRATION=86400000
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_email_app_password
```

### 3. Configure `application.properties`

```properties
# MongoDB
spring.data.mongodb.uri=${MONGO_URI}

# JWT
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}

# Email (for OTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Server
server.port=${PORT:8080}
```

### 4. Run the Application

```bash
./mvnw spring-boot:run
```

App starts at: `http://localhost:8080`

---

## 📡 API Endpoints

### 🔗 REST API Endpoints

| Method | Endpoint      | Description           | Auth Required |
| ------ | ------------- | --------------------- | ------------- |
| `POST` | `/register`   | Register new user     | ❌ No         |
| `POST` | `/login`      | Login & get JWT token | ❌ No         |
| `POST` | `/send-otp`   | Send OTP to email     | ❌ No         |
| `POST` | `/verify-otp` | Verify OTP & get JWT  | ❌ No         |
| `GET`  | `/hello`      | Test protected route  | ✅ Yes        |

### 🌐 Web Page Routes

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| `GET`  | `/login-page`      | Login HTML page      |
| `GET`  | `/signup-page`     | Signup HTML page     |
| `GET`  | `/otp-login-page`  | OTP Login HTML page  |
| `GET`  | `/verify-otp-page` | Verify OTP HTML page |
| `GET`  | `/home`            | Home HTML page       |

---

## 📝 API Usage

### Register User

**POST** `/register`

```json
{
  "username": "akshita",
  "email": "akshita@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "...",
    "username": "akshita",
    "email": "akshita@example.com"
  }
}
```

---

### Login

**POST** `/login`

```json
{
  "email": "akshita@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User Login successfully",
  "data": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

### Send OTP

**POST** `/send-otp`

```json
{
  "email": "akshita@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": null
}
```

---

### Verify OTP

**POST** `/verify-otp`

```json
{
  "email": "akshita@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP verified successfully",
  "data": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

### Test Protected Route

**GET** `/hello`

**Headers:**

```
Authorization: Bearer <your_jwt_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": "hello world"
}
```

## 🔒 Security Notes

- Passwords encrypted with **BCrypt**
- JWT tokens expire after **24 hours**
- OTP expires after a set time window
- `.env` is **never pushed** to GitHub
- All secrets managed via **environment variables**

---

## 👩‍💻 Author

**Akshita Saxena**

- GitHub: [@akshitasaxena1309](https://github.com/akshitasaxena1309)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
