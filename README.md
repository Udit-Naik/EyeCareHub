# 👁️ EyeCareHub - E-Commerce Platform

A full-stack e-commerce web application for eyewear products built with **Spring Boot** and **MongoDB**. Features JWT authentication, role-based access control, shopping cart, order management, and an admin dashboard.

---

## 🚀 Features

### 🛍️ Customer Features
- **User Authentication**: Secure registration and login with JWT tokens
- **Product Browsing**: Browse eyewear products with categories and filtering
- **Shopping Cart**: Add/remove items, update quantities, persistent cart data
- **Checkout**: Multiple payment options (COD, Card, PayPal)
- **Order Tracking**: View order history and status updates
- **User Dashboard**: Manage profile, addresses, and view past orders

### 👨‍💼 Admin Features  
- **Admin Dashboard**: Overview of users, orders, and revenue statistics
- **User Management**: View all registered users with roles
- **Order Management**: View all orders, update order status (Pending → Processing → Shipped → Delivered)
- **Product Management**: View products catalog
- **Role-Based Access**: Secure admin-only routes with Spring Security

### 🔐 Security
- **JWT Authentication**: Stateless authentication with Bearer tokens
- **Password Encryption**: BCrypt hashing for secure password storage
- **Role-Based Authorization**: ROLE_USER and ROLE_ADMIN with @PreAuthorize
- **CORS Configuration**: Controlled cross-origin access
- **Session Persistence**: Token storage in localStorage and cookies (7-day expiry)

---

## 🛠️ Tech Stack

### Backend
- **Java 25** - Programming language
- **Spring Boot 3.4.2** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data MongoDB** - Database access
- **JWT (jjwt 0.12.5)** - Token-based authentication
- **Lombok 1.18.32** - Boilerplate code reduction
- **Maven** - Build tool

### Frontend
- **HTML5/CSS3** - Markup and styling
- **Vanilla JavaScript (ES6+)** - Client-side logic
- **GSAP** - Animations
- **Font Awesome** - Icons

### Database
- **MongoDB 8.0.4** - NoSQL document database
- **Database Name**: `EyeCareHub`
- **Collections**: users, orders, carts, products

---

## 📦 Installation

### Prerequisites
- **Java 25** (JDK)
- **MongoDB** (running on `localhost:27017`)
- **Maven** (3.8+)
- **MongoDB Database Tools** (mongoexport/mongoimport)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sem2project
   ```

2. **Configure MongoDB**
   - Ensure MongoDB is running on default port 27017
   - Database `EyeCareHub` will be created automatically

3. **Build the project**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   # Option 1: Using Maven
   mvn spring-boot:run

   # Option 2: Using batch file (Windows)
   run_app.bat

   # Option 3: If compilation issues occur (Java 25 compatibility)
   mvn spring-boot:run -Dmaven.compiler.skip=true
   ```

5. **Create initial users**
   ```bash
   setup_database.bat
   ```

6. **Access the application**
   - Frontend: http://localhost:8080
   - Admin Panel: http://localhost:8080/admin/
   - API Base URL: http://localhost:8080/api

---

## 🔑 Default Credentials

After running `setup_database.bat`:

**Admin Account:**
- Email: `admin@eyecarehub.com`
- Password: `admin123`
- Access: Admin dashboard + all features

**Test User Account:**
- Email: `test@example.com`
- Password: `test123`
- Access: Customer features only

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/signin` | User login | Public |
| POST | `/signup` | User registration | Public |
| GET | `/me` | Get current user | JWT |
| POST | `/logout` | User logout | JWT |

### Orders (`/api/orders`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/?paymentType={type}` | Place order | JWT |
| GET | `/` | Get user's orders | JWT |
| GET | `/all` | Get all orders (admin) | Admin |
| PUT | `/{id}/status?status={status}` | Update order status | Admin |

### Cart (`/api/cart`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get user's cart | JWT |
| POST | `/add` | Add item to cart | JWT |
| DELETE | `/remove/{productId}` | Remove item | JWT |
| PUT | `/update/{productId}` | Update quantity | JWT |

### Admin (`/api/admin`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users` | Get all users | Admin |
| DELETE | `/users/{id}` | Delete user (disabled) | Admin |

**Order Status Values:** `PENDING`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

---

## 💾 Database Management

### Export Data (Backup)
```bash
export_data.bat
```
Creates JSON files in `mongodb_backup/`:
- `users.json` - All users
- `orders.json` - All orders  
- `carts.json` - Shopping carts
- `products.json` - Products

### Import Data (Restore)
```bash
import_data.bat
```
⚠️ **Warning:** This replaces existing data with backup files!

### Reset Database
```bash
# Drop database in MongoDB shell
use EyeCareHub
db.dropDatabase()

# Then create fresh users
setup_database.bat
```

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed guide.

---

## 📁 Project Structure

```
sem2project/
├── src/
│   ├── main/
│   │   ├── java/com/EyeCareHub/
│   │   │   ├── controller/          # REST API controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── OrderController.java
│   │   │   │   ├── CartController.java
│   │   │   │   └── AdminController.java
│   │   │   ├── service/             # Business logic
│   │   │   │   ├── AuthService.java
│   │   │   │   ├── OrderService.java
│   │   │   │   └── CartServiceImpl.java
│   │   │   ├── repository/          # MongoDB repositories
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── OrderRepository.java
│   │   │   │   └── CartRepository.java
│   │   │   ├── model/               # Domain models
│   │   │   │   ├── User.java
│   │   │   │   ├── Order.java
│   │   │   │   ├── Cart.java
│   │   │   │   └── Role.java
│   │   │   ├── dto/                 # Data transfer objects
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── SignupRequest.java
│   │   │   │   └── CartItemDto.java
│   │   │   ├── security/            # Security configuration
│   │   │   │   ├── JwtAuthFilter.java
│   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   └── SecurityConfig.java
│   │   │   └── exception/           # Exception handling
│   │   │       └── ResourceNotFoundException.java
│   │   └── resources/
│   │       ├── application.properties   # Configuration
│   │       └── static/                  # Frontend files
│   │           ├── index.html
│   │           ├── css/
│   │           ├── js/
│   │           ├── pages/
│   │           └── admin/
│   └── test/                        # Unit tests
├── mongodb_backup/                  # Database backup files
├── pom.xml                          # Maven config
├── run_app.bat                      # Run application
├── export_data.bat                  # Export MongoDB data
├── import_data.bat                  # Import MongoDB data
├── setup_database.bat               # Initial setup
└── DATABASE_SETUP.md                # Database guide
```

---

## 🎨 Frontend Pages

### Public Pages
- `/` - Homepage
- `/pages/login.html` - Login
- `/pages/register.html` - Register  
- `/pages/categories.html` - Product categories
- `/pages/product.html` - Product details

### User Pages (Requires Login)
- `/pages/dashboard.html` - User dashboard
- `/pages/cart.html` - Shopping cart
- `/pages/checkout.html` - Checkout

### Admin Pages (Requires Admin Role)
- `/admin/index.html` - Admin dashboard
- `/admin/users.html` - User management
- `/admin/orders.html` - Order management
- `/admin/products.html` - Product catalog

---

## 🔧 Configuration

### Application Properties
Located at: `src/main/resources/application.properties`

```properties
# Server
server.port=8080

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/EyeCareHub
spring.data.mongodb.database=EyeCareHub

# JWT
app.jwt.secret=your-secret-key
app.jwt.expiration=604800000
```

### CORS Settings
Currently allows:
- `http://localhost:8080`
- `http://localhost:5500`
- `http://localhost:3000`

---

## 🧪 Testing

### Test Endpoints
```bash
# Run test script
test_endpoints.bat
```

### Manual Testing
```bash
# Register user
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123","roles":["user"]}'

# Login
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"test@test.com","password":"test123"}'

# Get current user (replace TOKEN)
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

---

## 🐛 Known Issues

### Java 25 Compatibility
- **Issue**: Maven/Gradle fail to compile new code with "Unsupported class file major version 69"
- **Workaround**: Use pre-compiled classes with `mvn spring-boot:run -Dmaven.compiler.skip=true`
- **Solution**: Consider downgrading to Java 17 or Java 21 for better tooling support

### User Deletion
- **Issue**: DELETE endpoint in AdminController not compiled due to Java 25 issues
- **Workaround**: Use MongoDB Compass or mongoimport/mongoexport for data management
- **Status**: Temporarily disabled in admin panel UI

---

## 📚 Dependencies

### Backend (pom.xml)
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-mongodb</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.5</version>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.32</version>
    </dependency>
</dependencies>
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

This project is created for educational purposes as a semester project.

---

## 📞 Support

For issues and questions:
- Check [DATABASE_SETUP.md](DATABASE_SETUP.md) for database setup
- Review API endpoint documentation above
- Test with provided batch scripts

---

## 🎯 Future Enhancements

- [ ] Product CRUD operations in admin panel  
- [ ] Order cancellation feature
- [ ] Email notifications for order status
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Product reviews and ratings
- [ ] Search functionality
- [ ] Wishlist feature
- [ ] Product image upload
- [ ] Inventory management
- [ ] Sales analytics dashboard

---

## ⚡ Quick Start

```bash
# 1. Start MongoDB
net start MongoDB

# 2. Run application
run_app.bat

# 3. Setup database (first time only)
setup_database.bat

# 4. Open browser
start http://localhost:8080

# 5. Login as admin
# Email: admin@eyecarehub.com
# Password: admin123
```

---

**Built with ❤️ for Semester 2 Project**
