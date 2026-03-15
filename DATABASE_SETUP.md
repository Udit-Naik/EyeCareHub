# MongoDB Data Management - EyeCareHub

## 📦 Files Created:

1. **export_data.bat** - Export all MongoDB data to JSON files
2. **import_data.bat** - Import data from JSON files to MongoDB
3. **setup_database.bat** - Initial database setup with admin & test users
4. **mongodb_backup/** - Folder containing exported/sample data

---

## 🚀 How to Use:

### Initial Setup (First Time)
```bash
# 1. Make sure MongoDB is running
# 2. Make sure Spring Boot application is running (localhost:8080)
# 3. Run setup script:
setup_database.bat
```

This will create:
- Admin user: `admin@eyecarehub.com` / `admin123`
- Test user: `test@example.com` / `test123`

---

### Export Current Data (Backup)
```bash
export_data.bat
```

This will create files in `mongodb_backup/` folder:
- `users.json` - All users
- `orders.json` - All orders
- `carts.json` - All shopping carts
- `products.json` - Products (if stored in DB)

---

### Import Data (Restore from Backup)
```bash
import_data.bat
```

⚠️ **WARNING:** This will REPLACE existing data!

Data will be imported from `mongodb_backup/` folder.

---

## 📊 Database Structure:

### Database Name: `EyeCareHub`

### Collections:

#### 1. **users**
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "password": "string (BCrypt hashed)",
  "roles": ["ROLE_USER" or "ROLE_ADMIN"],
  "createdAt": "Date"
}
```

#### 2. **orders**
```json
{
  "_id": "ObjectId",
  "userId": "string",
  "items": [
    {
      "productId": "string",
      "name": "string",
      "price": "number",
      "quantity": "number",
      "imageUrl": "string"
    }
  ],
  "totalPrice": "number",
  "status": "PENDING|PROCESSING|SHIPPED|DELIVERED|CANCELLED",
  "paymentType": "COD|Card|PayPal",
  "orderDate": "Date"
}
```

#### 3. **carts**
```json
{
  "_id": "ObjectId",
  "userId": "string",
  "items": [/* same as order items */],
  "totalPrice": "number"
}
```

#### 4. **products** (Optional - currently in frontend data.js)
```json
{
  "_id": "ObjectId",
  "name": "string",
  "category": "string",
  "price": "number",
  "image": "string",
  "stock": "number"
}
```

---

## 🔧 Requirements:

1. **MongoDB** must be installed and running on `localhost:27017`
2. **MongoDB tools** (mongoexport, mongoimport) must be in PATH
3. **Spring Boot application** should be running on `localhost:8080`

---

## 💡 Tips:

### To backup before making changes:
```bash
export_data.bat
```

### To share data with team:
1. Run `export_data.bat`
2. Share the `mongodb_backup/` folder
3. Team members run `import_data.bat`

### To reset database:
```bash
# In MongoDB shell or Compass:
use EyeCareHub
db.dropDatabase()

# Then run:
setup_database.bat
```

---

## 🐛 Troubleshooting:

### "mongoexport is not recognized"
- Install MongoDB Database Tools: https://www.mongodb.com/try/download/database-tools
- Add to PATH: `C:\Program Files\MongoDB\Tools\100\bin`

### "Connection refused"
- Make sure MongoDB service is running
- Check if it's running on default port 27017

### "Database not found"
- Run `setup_database.bat` first
- Or manually create admin user via API

---

## 📝 Example Usage Workflow:

```bash
# Day 1: Setup
1. setup_database.bat          # Create initial users
2. Register more users via website
3. Place some test orders

# Day 2: Backup
4. export_data.bat             # Backup all data

# Day 3: Share with team
5. Share mongodb_backup/ folder with team
6. Team runs import_data.bat   # Import data on their machine

# Day 4: Development
7. Make changes, test features
8. export_data.bat             # Backup again if needed
```

---

## 🔐 Security Notes:

- Passwords are BCrypt hashed (cannot be reversed)
- JWT tokens expire after 24 hours
- Admin role required for user management
- Never commit exported JSON files with real user data to Git!

---

## 📧 Default Credentials:

After running `setup_database.bat`:

**Admin Portal:**
- URL: `http://localhost:8080/admin/`
- Email: `admin@eyecarehub.com`
- Password: `admin123`

**User Portal:**
- URL: `http://localhost:8080/`
- Email: `test@example.com`
- Password: `test123`
