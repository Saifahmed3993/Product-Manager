# Product Manager API

A full-stack **Product Management System** built with ASP.NET Core 8 Web API, featuring JWT authentication, user management, and a modern single-page frontend interface.

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-8.0-512BD4?logo=asp.net)
![Entity Framework](https://img.shields.io/badge/Entity%20Framework%20Core-9.0-512BD4?logo=entity-framework)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-CC2927?logo=microsoft-sql-server)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Docker Deployment](#docker-deployment)
- [License](#license)

---

## Features

### Authentication & Authorization
- **User Registration** – Create new accounts with email and password
- **JWT Login** – Secure token-based authentication
- **User Profile** – View and update profile (full name, phone number)
- **Protected Routes** – Profile endpoints require valid JWT token

### Product Management
- **CRUD Operations** – Create, Read, Update, Delete products
- **Product Model** – Name, Price, Stock
- **RESTful API** – Standard HTTP methods and status codes

### Frontend
- **Single-Page Application** – Dashboard, Products, and Settings views
- **Product Modal** – Add and edit products via modal form
- **Auth Modal** – Login and registration interface
- **Responsive Design** – Clean UI with modern styling

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | ASP.NET Core 8 Web API |
| **ORM** | Entity Framework Core 9 |
| **Database** | SQL Server 2022 |
| **Authentication** | ASP.NET Identity + JWT Bearer |
| **API Docs** | Swagger / OpenAPI |
| **Frontend** | Vanilla HTML, CSS, JavaScript |
| **Containerization** | Docker, Docker Compose |

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [SQL Server](https://www.microsoft.com/sql-server) (LocalDB, Express, or full)
- [Docker](https://www.docker.com/) (optional, for containerized run)

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lab1
```

### 2. Configure Connection String

Edit `appsettings.json` or `appsettings.Development.json` and set your SQL Server connection string:

```json
{
  "ConnectionStrings": {
    "PracticeConnection": "Server=YOUR_SERVER;Database=PracticeDB;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

### 3. Apply Database Migrations

```bash
dotnet ef database update
```

Or run the application – migrations are applied automatically at startup.

### 4. Run the Application

```bash
dotnet run
```

The API will be available at:
- **API**: `https://localhost:7109` (or the port in `launchSettings.json`)
- **Swagger UI**: `https://localhost:7109/swagger`

### 5. Serve the Frontend

The frontend files are in the `frontend/` folder. You can:
- Serve them via any static file server (e.g., Live Server, `npx serve`)
- Or configure the API to serve static files from `frontend/`

---

## Configuration

### JWT Settings

Configure JWT in `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "YourSecretKey_MustBeAtLeast32CharactersLong",
    "Issuer": "https://localhost:7109",
    "Audience": "https://localhost:7109"
  }
}
```

> **Security Note:** Use a strong, unique key in production. Store secrets in environment variables or a secrets manager.

### CORS

The application allows any origin, method, and header in development. Restrict CORS in production for security.

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `GET` | `/api/auth/profile` | Get current user profile (requires auth) |
| `PUT` | `/api/auth/profile` | Update user profile (requires auth) |

### Product Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Get all products |
| `GET` | `/api/products/{id}` | Get product by ID |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/{id}` | Update a product |
| `DELETE` | `/api/products/{id}` | Delete a product |

### Example: Register

```bash
curl -X POST https://localhost:7109/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"YourPassword123!","fullName":"John Doe","phoneNumber":"+1234567890"}'
```

### Example: Login

```bash
curl -X POST https://localhost:7109/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"YourPassword123!"}'
```

### Example: Get Products

```bash
curl -X GET https://localhost:7109/api/products
```

---

## Project Structure

```
lab1/
├── Controllers/
│   ├── AuthController.cs      # Authentication & user management
│   └── ProductsController.cs  # Product CRUD operations
├── Data/
│   └── AppDbContext.cs        # EF Core DbContext
├── Models/
│   ├── ApplicationUser.cs     # Identity user model
│   ├── AuthDTOs.cs            # Auth request/response DTOs
│   └── Product.cs             # Product entity
├── Migrations/                # EF Core migrations
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js             # API client
│   │   └── app.js             # App logic
│   └── index.html
├── Program.cs                 # App configuration & startup
├── appsettings.json          # Configuration
├── Dockerfile                 # Container build
├── docker-compose.yml         # Multi-container setup
└── README.md
```

---

## Docker Deployment

### Build and Run with Docker Compose

```bash
docker-compose up --build
```

This starts:
- **Web API** on port `7109`
- **SQL Server** on port `1433`

### Environment Variables (Docker)

The `docker-compose.yml` sets:
- `ConnectionStrings__PracticeConnection` – Database connection for the API
- `SA_PASSWORD` – SQL Server admin password

### Default SQL Server Credentials (Docker)

- **User:** `sa`
- **Password:** `YourStrong!Pass123`

Change these in production.

---

## License

This project is provided as-is for educational and development purposes.

---

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.
