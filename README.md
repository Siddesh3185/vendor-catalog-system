# 🏢 Vendor Catalog System

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

A comprehensive Vendor Management System for procurement teams and B2B platforms

[Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

## 📖 Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## 🎯 About The Project

![Project Screenshot](https://via.placeholder.com/800x400.png?text=Vendor+Catalog+System+Screenshot)

The *Vendor Catalog System* is a robust web application designed to streamline vendor management for procurement teams and B2B platforms. It provides comprehensive CRUD operations for vendors, their products, and contact persons with hierarchical relationships.

### ✨ Key Features

- *🏢 Vendor Management* - Complete vendor profile management with CRUD operations
- *📦 Product Catalog* - Organized product listings categorized by vendors
- *👥 Contact Management* - Multiple contact persons management per vendor
- *🔍 Advanced Search* - Powerful search and filtering capabilities
- *📊 Dashboard Analytics* - Vendor and product performance insights
- *📱 Responsive Design* - Mobile-friendly interface for all devices

### 🛠 Built With

This project is built using the following technologies:

#### Frontend
- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

#### Backend
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
- ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=flat-square&logo=mysql&logoColor=white)

#### Development Tools
- ![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
- ![NPM](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white)
- ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

- *Node.js* (version 14.0 or higher)
- *MySQL* (version 8.0 or higher)
- *npm* (comes with Node.js)

### ⚙ Installation

#### Step 1: Clone the Repository
bash
git clone https://github.com/your-username/vendor-catalog-system.git
cd vendor-catalog-system


#### Step 2: Install Backend Dependencies
bash
cd backend
npm install


#### Step 3: Database Setup
1. Start your MySQL server
2. Create a new database:
sql
CREATE DATABASE vendor_catalog;


3. Import the database schema:
bash
mysql -u your_username -p vendor_catalog < database/schema.sql


#### Step 4: Environment Configuration
1. Copy the environment file:
bash
cp .env.example .env


2. Update the .env file with your configurations:
env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=vendor_catalog
PORT=3000
JWT_SECRET=your_jwt_secret_key


#### Step 5: Install Frontend Dependencies
bash
cd ../frontend
npm install


#### Step 6: Start the Application

*Backend Server:*
bash
cd backend
npm start


*Frontend Server (in a new terminal):*
bash
cd frontend
npm run dev


#### Step 7: Access the Application
Open your web browser and navigate to:

http://localhost:3000


## 🗃 Database Schema

### 📊 Database Tables Overview

| Table Name | Description | Records |
|------------|-------------|---------|
| vendors | Stores vendor information | ~500 |
| products | Stores product details | ~5,000 |
| contacts | Stores contact persons | ~1,500 |
| categories | Product categories | ~50 |
| orders | Purchase orders | ~2,000 |

### 🏢 Vendors Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| vendor_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique vendor identifier |
| name | VARCHAR(255) | NOT NULL | Vendor company name |
| email | VARCHAR(255) | UNIQUE | Vendor email address |
| phone | VARCHAR(20) | | Contact number |
| address | TEXT | | Physical address |
| city | VARCHAR(100) | | City |
| state | VARCHAR(100) | | State/Province |
| country | VARCHAR(100) | | Country |
| zip_code | VARCHAR(20) | | Postal code |
| category | VARCHAR(100) | | Vendor category |
| status | ENUM('active','inactive') | DEFAULT 'active' | Vendor status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

*Sample Data:*
sql
INSERT INTO vendors (name, email, phone, address, category) VALUES
('Tech Solutions Inc.', 'contact@techsolutions.com', '+1-555-0101', '123 Tech Park', 'IT Services'),
('Global Supplies Ltd.', 'info@globalsupplies.com', '+1-555-0102', '456 Business Ave', 'Manufacturing');


### 📦 Products Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| product_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique product identifier |
| vendor_id | INT | FOREIGN KEY | References vendors(vendor_id) |
| name | VARCHAR(255) | NOT NULL | Product name |
| description | TEXT | | Product description |
| category | VARCHAR(100) | | Product category |
| price | DECIMAL(10,2) | NOT NULL | Unit price |
| currency | VARCHAR(3) | DEFAULT 'USD' | Currency code |
| unit | VARCHAR(50) | | Measurement unit (pcs, kg, etc.) |
| stock_quantity | INT | DEFAULT 0 | Available stock |
| min_order_quantity | INT | DEFAULT 1 | Minimum order quantity |
| sku | VARCHAR(100) | UNIQUE | Stock keeping unit |
| image_url | VARCHAR(500) | | Product image URL |
| is_active | BOOLEAN | DEFAULT TRUE | Product status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

*Sample Data:*
sql
INSERT INTO products (vendor_id, name, description, category, price, stock_quantity, sku) VALUES
(1, 'Laptop Pro', 'High-performance business laptop', 'Electronics', 1200.00, 50, 'LP-001'),
(1, 'Wireless Mouse', 'Ergonomic wireless mouse', 'Accessories', 25.99, 200, 'WM-001');


### 👥 Contacts Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| contact_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique contact identifier |
| vendor_id | INT | FOREIGN KEY | References vendors(vendor_id) |
| first_name | VARCHAR(100) | NOT NULL | Contact first name |
| last_name | VARCHAR(100) | NOT NULL | Contact last name |
| email | VARCHAR(255) | | Email address |
| phone | VARCHAR(20) | | Phone number |
| department | VARCHAR(100) | | Department name |
| position | VARCHAR(100) | | Job position |
| is_primary | BOOLEAN | DEFAULT FALSE | Primary contact flag |
| notes | TEXT | | Additional notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

*Sample Data:*
sql
INSERT INTO contacts (vendor_id, first_name, last_name, email, department, position, is_primary) VALUES
(1, 'John', 'Smith', 'john.smith@techsolutions.com', 'Sales', 'Account Manager', TRUE),
(1, 'Sarah', 'Johnson', 'sarah.j@techsolutions.com', 'Support', 'Technical Support', FALSE);


### 📑 Categories Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| category_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique category identifier |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Category name |
| description | TEXT | | Category description |
| parent_id | INT | FOREIGN KEY | Parent category (for hierarchy) |
| is_active | BOOLEAN | DEFAULT TRUE | Category status |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

### 📋 Orders Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| order_id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique order identifier |
| vendor_id | INT | FOREIGN KEY | References vendors(vendor_id) |
| order_date | DATE | NOT NULL | Order placement date |
| delivery_date | DATE | | Expected delivery date |
| total_amount | DECIMAL(10,2) | NOT NULL | Order total amount |
| status | ENUM('pending','confirmed','shipped','delivered','cancelled') | DEFAULT 'pending' | Order status |
| notes | TEXT | | Order notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

### 🔗 Table Relationships

mermaid
erDiagram
    VENDORS ||--o{ PRODUCTS : has
    VENDORS ||--o{ CONTACTS : has
    VENDORS ||--o{ ORDERS : receives
    CATEGORIES ||--o{ PRODUCTS : categorizes
    VENDORS {
        int vendor_id PK
        varchar name
        varchar email
        varchar phone
        text address
        varchar category
        enum status
    }
    PRODUCTS {
        int product_id PK
        int vendor_id FK
        varchar name
        text description
        decimal price
        int stock_quantity
        varchar sku
    }
    CONTACTS {
        int contact_id PK
        int vendor_id FK
        varchar first_name
        varchar last_name
        varchar email
        varchar department
        boolean is_primary
    }


## 📡 API Documentation

### 🔑 Authentication Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| POST | /api/auth/login | User login | email, password |
| POST | /api/auth/register | User registration | name, email, password |
| POST | /api/auth/logout | User logout | - |

### 🏢 Vendor Endpoints

| Method | Endpoint | Description | Parameters | Response |
|--------|----------|-------------|------------|----------|
| GET | /api/vendors | Get all vendors | page, limit, search | Vendor list |
| POST | /api/vendors | Create new vendor | Vendor object | New vendor |
| GET | /api/vendors/:id | Get vendor by ID | id | Vendor details |
| PUT | /api/vendors/:id | Update vendor | id, Vendor object | Updated vendor |
| DELETE | /api/vendors/:id | Delete vendor | id | Success message |
| GET | /api/vendors/:id/products | Get vendor's products | id | Product list |
| GET | /api/vendors/:id/contacts | Get vendor's contacts | id | Contact list |

### 📦 Product Endpoints

| Method | Endpoint | Description | Parameters | Response |
|--------|----------|-------------|------------|----------|
| GET | /api/products | Get all products | page, limit, category | Product list |
| POST | /api/vendors/:id/products | Add product | id, Product object | New product |
| GET | /api/products/:id | Get product by ID | id | Product details |
| PUT | /api/products/:id | Update product | id, Product object | Updated product |
| DELETE | /api/products/:id | Delete product | id | Success message |
| GET | /api/products/search | Search products | query, filters | Search results |

### 👥 Contact Endpoints

| Method | Endpoint | Description | Parameters | Response |
|--------|----------|-------------|------------|----------|
| GET | /api/contacts | Get all contacts | page, limit | Contact list |
| POST | /api/vendors/:id/contacts | Add contact | id, Contact object | New contact |
| GET | /api/contacts/:id | Get contact by ID | id | Contact details |
| PUT | /api/contacts/:id | Update contact | id, Contact object | Updated contact |
| DELETE | /api/contacts/:id | Delete contact | id | Success message |

### 📊 Sample API Requests

*Get All Vendors:*
bash
curl -X GET "http://localhost:3000/api/vendors?page=1&limit=10" \
  -H "Content-Type: application/json"


*Create New Vendor:*
bash
curl -X POST "http://localhost:3000/api/vendors" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Vendor Inc.",
    "email": "info@newvendor.com",
    "phone": "+1-555-0199",
    "address": "789 Business Street",
    "category": "Technology"
  }'


*Get Vendor's Products:*
bash
curl -X GET "http://localhost:3000/api/vendors/1/products" \
  -H "Content-Type: application/json"


## 💻 Usage

### 🔧 Admin Features
1. *Vendor Management*
   - Add new vendors with complete details
   - Update vendor information
   - Deactivate/activate vendors
   - View vendor performance metrics

2. *Product Catalog*
   - Manage products for each vendor
   - Set pricing and inventory levels
   - Categorize products for easy search
   - Bulk product operations

3. *Contact Management*
   - Add multiple contact persons per vendor
   - Set primary contacts
   - Manage department-wise contacts

### 🔍 Search & Filter
- Search vendors by name, category, or location
- Filter products by price range, category, or availability
- Advanced search with multiple criteria

## 🗺 Roadmap

### ✅ Completed Features
- [x] Basic vendor CRUD operations
- [x] Product management system
- [x] Contact person management
- [x] Database schema design
- [x] RESTful API development

### 🚧 In Progress
- [ ] Advanced search functionality
- [ ] Bulk operations
- [ ] Data export features
- [ ] Dashboard analytics

### 📅 Planned Features
- [ ] User authentication & authorization
- [ ] Email notifications
- [ ] Mobile application
- [ ] API rate limiting
- [ ] Third-party integrations

See the [open issues](https://github.com/your-username/vendor-catalog-system/issues) for a full list of proposed features and known issues.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are *greatly appreciated*.

### 📝 How to Contribute

1. *Fork the Project*
2. *Create your Feature Branch* 
   bash
   git checkout -b feature/AmazingFeature
   
3. *Commit your Changes*
   bash
   git commit -m 'Add some AmazingFeature'
   
4. *Push to the Branch*
   bash
   git push origin feature/AmazingFeature
   
5. *Open a Pull Request*

### 🏆 Contribution Guidelines

- Follow the existing code style
- Write clear, descriptive commit messages
- Update documentation as needed
- Add tests for new features
- Ensure all tests pass before submitting

## 📄 License

Distributed under the MIT License. See LICENSE for more information.

## 📞 Contact

*Your Name* - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

*Project Link*: [https://github.com/your-username/vendor-catalog-system](https://github.com/your-username/vendor-catalog-system)

## 🙏 Acknowledgements

We would like to express our gratitude to:

- [Node.js Community](https://nodejs.org/en/)
- [Express.js Team](https://expressjs.com/)
- [MySQL Developers](https://www.mysql.com/)
- [Contributors to this project](#)

### 📚 Resources
- [Node.js Documentation](https://nodejs.org/docs/latest/api/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

<div align="center">

### ⭐ Don't forget to give this project a star if you find it helpful!

*Made with ❤ for the open-source community*

![Visitor Count](https://visitor-badge.laobi.icu/badge?page_id=your-username.vendor-catalog-system)

</div>

## 🗂 Project Structure


vendor-catalog-system/
├── 📁 backend/
│   ├── 📁 config/
│   ├── 📁 controllers/
│   ├── 📁 models/
│   ├── 📁 routes/
│   ├── 📁 middleware/
│   └── server.js
├── 📁 frontend/
│   ├── 📁 public/
│   ├── 📁 views/
│   └── package.json
├── 📁 database/
│   ├── schema.sql
│   ├── sample-data.sql
│   └── migrations/
├── 📚 docs/
│   ├── API_DOCUMENTATION.md
│   └── USER_GUIDE.md
└── README.md


---
