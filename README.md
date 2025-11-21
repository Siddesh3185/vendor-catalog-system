# 🏢 Vendor Catalog System

> *Manage vendors, their products, and contact persons. Useful for procurement teams or B2B platforms. Shows multi-model CRUD with parent/child relationships.*

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Setup Instructions](#-setup-instructions)
- [API Documentation](#-api-documentation)
- [Roadmap](#-roadmap)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Project Overview

A comprehensive *Vendor Catalog System* designed for procurement teams and B2B platforms. This system enables efficient management of vendors, their products, and contact persons with full CRUD operations and parent/child relationships.

### 🎪 Key Highlights
- ✅ *Multi-model CRUD operations*
- ✅ *Hierarchical data relationships*
- ✅ *RESTful API architecture*
- ✅ *Responsive web interface*
- ✅ *MySQL database with relationships*
- ✅ *Vendor → Products → Contacts hierarchy*

---

## ✨ Features

### 🔧 Core Features
| Feature | Description | Status |
|---------|-------------|--------|
| *Vendor Management* | Complete vendor profile CRUD operations | ✅ Implemented |
| *Product Catalog* | Organized product listings per vendor | ✅ Implemented |
| *Contact Management* | Multiple contact persons per vendor | ✅ Implemented |
| *Search & Filter* | Advanced filtering capabilities | 🚧 In Progress |
| *Data Export* | Export vendor/product data | 📅 Planned |

### 🛡 Security Features
- 🔒 Input validation and sanitization
- 🛡 SQL injection prevention
- 🔑 XSS protection
- 📝 CSRF protection

---

## 🛠 Tech Stack

### *Frontend*
- 🎨 *HTML5* - Semantic markup
- 🎭 *CSS3* - Modern styling with Flexbox/Grid
- ⚡ *JavaScript* - Client-side interactions
- 📱 *Responsive Design* - Mobile-first approach

### *Backend*
- 🟢 *Node.js* - Runtime environment
- 🚂 *Express.js* - Web application framework
- 🗄 *MySQL* - Relational database
- 🔌 *MySQL2* - MySQL client for Node.js

### *Development Tools*
- 🔧 *Nodemon* - Development server
- 📦 *npm* - Package management
- 🌐 *Postman* - API testing
- 📊 *Workbench* - Database management

---

## 🏗 Directory Structure


vendor-catalog-system/
│
├── 📁 backend/
│   ├── 📁 config/
│   │   └── database.js
│   ├── 📁 controllers/
│   │   ├── vendorController.js
│   │   ├── productController.js
│   │   └── contactController.js
│   ├── 📁 models/
│   │   ├── Vendor.js
│   │   ├── Product.js
│   │   └── Contact.js
│   ├── 📁 routes/
│   │   ├── vendorRoutes.js
│   │   ├── productRoutes.js
│   │   └── contactRoutes.js
│   ├── 📁 middleware/
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── 📁 utils/
│   │   └── helpers.js
│   └── server.js
│
├── 📁 frontend/
│   ├── 📁 public/
│   │   ├── 📁 css/
│   │   │   ├── style.css
│   │   │   ├── vendor.css
│   │   │   └── responsive.css
│   │   ├── 📁 js/
│   │   │   ├── main.js
│   │   │   ├── vendor.js
│   │   │   └── product.js
│   │   └── 📁 images/
│   ├── 📁 views/
│   │   ├── index.html
│   │   ├── vendors.html
│   │   ├── vendor-detail.html
│   │   ├── products.html
│   │   └── contacts.html
│   └── package.json
│
├── 📁 database/
│   ├── schema.sql
│   └── sample-data.sql
│
├── 📁 docs/
│   ├── API_Documentation.md
│   └── User_Guide.md
│
├── .env.example
├── package.json
└── README.md


---

## 🚀 Setup Instructions

### 📋 Prerequisites
- *Node.js* (v14 or higher) 🟢
- *MySQL* (v8.0 or higher) 🗄
- *npm* or *yarn* 📦

### 🛠 Installation Steps

#### Step 1: Clone Repository
bash
git clone <repository-url>
cd vendor-catalog-system


#### Step 2: Backend Setup
bash
cd backend
npm install


#### Step 3: Database Configuration
bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE vendor_catalog;

# Import schema
USE vendor_catalog;
SOURCE database/schema.sql;

# Optional: Import sample data
SOURCE database/sample-data.sql;


#### Step 4: Environment Setup
bash
# Copy environment file
cp .env.example .env

# Configure your environment variables
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=vendor_catalog
PORT=3000


#### Step 5: Frontend Setup
bash
cd frontend
npm install


#### Step 6: Start Application
bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev


#### Step 7: Access Application
🌐 Open your browser and navigate to:

http://localhost:3000


---

## 📡 API Documentation

### 🏢 Vendor Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/vendors | 📋 List all vendors |
| GET | /api/vendors/:id | 👁 Get vendor details |
| POST | /api/vendors | ➕ Create new vendor |
| PUT | /api/vendors/:id | ✏ Update vendor |
| DELETE | /api/vendors/:id | 🗑 Delete vendor |

### 📦 Product Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/vendors/:vendorId/products | 📋 Get vendor's products |
| POST | /api/vendors/:vendorId/products | ➕ Add product to vendor |
| PUT | /api/products/:id | ✏ Update product |
| DELETE | /api/products/:id | 🗑 Delete product |

### 👥 Contact Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/vendors/:vendorId/contacts | 📋 Get vendor's contacts |
| POST | /api/vendors/:vendorId/contacts | ➕ Add contact to vendor |
| PUT | /api/contacts/:id | ✏ Update contact |
| DELETE | /api/contacts/:id | 🗑 Delete contact |

---

## 🗺 Roadmap

### 🎯 Phase 1: Foundation & Setup (Week 1-2)
- [x] ✅ Project architecture design
- [x] ✅ Database schema design
- [x] ✅ Basic Node.js server setup
- [x] ✅ HTML/CSS framework implementation

### 🎯 Phase 2: Core Backend (Week 3-4)
- [ ] 🔄 Vendor CRUD API endpoints
- [ ] 🔄 Product management APIs  
- [ ] 🔄 Contact person APIs
- [ ] 📅 Database relationship implementation

### 🎯 Phase 3: Frontend Development (Week 5-6)
- [ ] 📅 Vendor management interface
- [ ] 📅 Product catalog views
- [ ] 📅 Contact management forms
- [ ] 📅 Responsive design implementation

### 🎯 Phase 4: Advanced Features (Week 7-8)
- [ ] 📅 Search and filtering functionality
- [ ] 📅 Data export capabilities
- [ ] 📅 Bulk operations
- [ ] 📅 Advanced form validation

### 🎯 Phase 5: Testing & Deployment (Week 9-10)
- [ ] 📅 Unit and integration testing
- [ ] 📅 Security audit
- [ ] 📅 Performance optimization
- [ ] 📅 Deployment configuration

---

## 🗃 Database Schema

### 🏢 Vendors Table
sql
CREATE TABLE vendors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    category VARCHAR(100),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


### 📦 Products Table
sql
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    price DECIMAL(10,2),
    unit VARCHAR(50),
    stock_quantity INT,
    sku VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);


### 👥 Contacts Table
sql
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    department VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);


---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 🔄 Contribution Workflow
1. 🍴 *Fork* the repository
2. 🌿 *Create* your feature branch (git checkout -b feature/AmazingFeature)
3. 💾 *Commit* your changes (git commit -m 'Add some AmazingFeature')
4. 📤 *Push* to the branch (git push origin feature/AmazingFeature)
5. 🔃 *Open* a Pull Request

### 📝 Contribution Guidelines
- ✅ Write clear commit messages
- ✅ Update documentation as needed
- ✅ Add tests for new features
- ✅ Ensure code follows project style guidelines

---

## 📄 License

This project is licensed under the *MIT License* - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### 📞 Get Help
- 📧 *Email*: your-support-email@example.com
- 🐛 *Issues*: Create an issue in the repository
- 💬 *Discussions*: Use GitHub discussions for questions

### 🏗 Maintainers
| Name | Role | Contact |
|------|------|---------|
| *Your Name* | Project Maintainer | your-email@example.com |

---

## 🎉 Acknowledgments

- Icons provided by [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet)
- README template inspired by best practices

---

<div align="center">

### ⭐ Don't forget to star this repository if you find it helpful!

*Built with ❤ for procurement teams and B2B platforms*

</div>

---

