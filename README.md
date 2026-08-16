#  Spendly Tracker

**Spendly Tracker** is a full-stack expense tracking web application built as a practice project to learn and strengthen full-stack web development concepts.

The application allows users to add, view, edit, delete, search, and filter expenses while storing the data persistently in a MySQL database.

The project demonstrates how a frontend communicates with a backend REST API, how a Node.js application interacts with MySQL, and how a complete full-stack application can be deployed to the cloud.

---

## 🌐 Live Website

🚀 **Spendly Tracker is live on Railway**

https://spendly-tracker-production.up.railway.app

---

## 🎯 Project Purpose

This project was developed for **learning and practice purposes**.

The main goal was to gain hands-on experience with:

- Building a frontend using HTML, CSS, and JavaScript
- Creating a backend using Node.js and Express.js
- Designing and consuming REST APIs
- Performing CRUD operations
- Connecting Node.js with MySQL
- Working with asynchronous JavaScript and Fetch API
- Managing environment variables securely
- Using Git and GitHub for version control
- Deploying a full-stack application
- Hosting MySQL in the cloud
- Connecting a deployed backend to a cloud database
- Debugging frontend, backend, database, and deployment issues

---

## 🚀 Project Overview

Spendly Tracker follows a client-server architecture:

```text
User
  ↓
Frontend
HTML + CSS + JavaScript
  ↓
REST API
  ↓
Node.js + Express.js
  ↓
MySQL Database
```

The frontend sends HTTP requests to the Express backend.

The backend processes those requests, executes SQL queries on MySQL, and returns the results to the frontend.

---

## ✨ Features

- ➕ Add new expenses
- 📋 View all expenses
- ✏️ Edit existing expenses
- 🗑️ Delete individual expenses
- 🧹 Clear all expenses
- 🔍 Search expenses by description
- 🏷️ Filter expenses by category
- 💰 Automatically calculate total expenses
- 📅 Store expense dates
- 🕐 Record expense creation timestamps
- 🇮🇳 Display timestamps in Indian Standard Time
- 💾 Persistent MySQL database storage
- 🔄 REST API integration
- 🌐 Frontend-backend communication
- 🔐 Environment-based database configuration
- ☁️ Cloud deployment using Railway

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Database Driver | MySQL2 |
| API | REST API |
| Configuration | dotenv |
| Development | Nodemon |
| Version Control | Git & GitHub |
| Cloud Deployment | Railway |

---

## 🏗️ Architecture

```text
┌─────────────────────────┐
│          User           │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│        Frontend         │
│   HTML / CSS / JS       │
└────────────┬────────────┘
             │
             │ Fetch API / HTTP
             ▼
┌─────────────────────────┐
│         Backend         │
│   Node.js + Express.js  │
└────────────┬────────────┘
             │
             │ SQL Queries
             ▼
┌─────────────────────────┐
│          MySQL          │
│    Expense Database     │
└─────────────────────────┘
```

---

## 📂 Project Structure

```text
Expenses-Tracker/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── routes/
│   └── router.js
│
├── connection.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

The frontend is served directly by the Express server from the `public` directory.

---

## 🔌 REST API

### Base URL

```text
/api/v1/expenses
```

### Available Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/expenses/` | Check API status |
| `GET` | `/api/v1/expenses/tables` | Retrieve database tables |
| `GET` | `/api/v1/expenses/allrows` | Retrieve all expenses |
| `POST` | `/api/v1/expenses/` | Create a new expense |
| `PUT` | `/api/v1/expenses/:id` | Update an expense |
| `DELETE` | `/api/v1/expenses/:id` | Delete an expense |
| `DELETE` | `/api/v1/expenses/clear` | Delete all expenses |

### Example Request

```http
POST /api/v1/expenses/
Content-Type: application/json
```

```json
{
  "description": "Lunch",
  "category": "Food",
  "expense_date": "2026-08-17",
  "amount": 250
}
```

---

# ⚙️ Getting Started

## Prerequisites

Install the following before running the project locally:

- Node.js
- npm
- MySQL
- Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/dskvamsi/Expenses-Tracker.html.git
```

Then:

```bash
cd Expenses-Tracker.html
```

---

## 2. Configure MySQL

Create a database:

```sql
CREATE DATABASE expense_tracker;
```

Select it:

```sql
USE expense_tracker;
```

Create the `expenses` table:

```sql
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    expense_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker
DB_PORT=3306
```

Replace the values with your local MySQL configuration.

> ⚠️ Never commit your `.env` file or database credentials to GitHub.

---

## 4. Install Dependencies

From the project root, run:

```bash
npm install
```

---

## 5. Start the Application

Run:

```bash
npm start
```

The Express server will start on:

```text
http://localhost:3000
```

Open that address in your browser.

> The frontend is served by Express from the `public` folder, so VS Code Live Server is not required.

---

## ☁️ Cloud Deployment

Spendly Tracker is deployed using **Railway**.

The deployment consists of:

```text
Spendly Tracker
      │
      ▼
Railway Node.js Service
      │
      ▼
Express REST API
      │
      ▼
Railway MySQL Database
```

The production application uses environment variables for database configuration.

The backend supports Railway variables such as:

```text
MYSQLHOST
MYSQLPORT
MYSQLUSER
MYSQLPASSWORD
MYSQLDATABASE
```

Sensitive database credentials are stored as Railway environment variables and are not included in the source code.

---

## 🗄️ Database Structure

The application uses an `expenses` table.

| Field | Description |
| --- | --- |
| `id` | Unique expense ID |
| `description` | Description of the expense |
| `category` | Expense category |
| `expense_date` | Date of the expense |
| `amount` | Expense amount |
| `created_at` | Record creation timestamp |

The `id` field automatically increments whenever a new expense is created.

The `created_at` timestamp is automatically generated when the record is inserted.

---

## 🔄 CRUD Operations

Spendly Tracker implements the four fundamental database operations:

```text
CREATE → Add Expense

READ   → View Expenses

UPDATE → Edit Expense

DELETE → Delete Expense
```

The application also supports deleting all expense records using the **Clear All** feature.

---

## 🔄 Application Flow

```text
User
 │
 ▼
Spendly Tracker UI
 │
 │ Fetch API
 ▼
Express Server
 │
 ▼
Expense Router
 │
 ▼
MySQL
 │
 ▼
Database Response
 │
 ▼
Express API Response
 │
 ▼
Frontend
```

---

## 🔐 Security

Sensitive information is not stored directly in the source code.

Do not upload:

```text
.env
database passwords
API keys
private credentials
```

The `.env` file should always be included in `.gitignore`.

Production database credentials are managed through Railway environment variables.

---

## 📚 What I Learned

Through this project, I gained hands-on experience with:

- HTML5
- CSS3
- JavaScript
- Node.js
- Express.js
- REST APIs
- CRUD operations
- MySQL
- MySQL2
- SQL queries
- Fetch API
- Asynchronous JavaScript
- Environment variables
- Client-server architecture
- Git and GitHub
- Cloud MySQL databases
- Railway deployment
- Debugging full-stack applications
- Connecting frontend, backend, and database services

---

## 🔮 Future Improvements

Future versions of Spendly Tracker could include:

- 🔐 User authentication
- 👤 User-specific expense accounts
- 📊 Expense analytics and charts
- 📅 Monthly and yearly reports
- 🎯 Monthly budget limits
- 📁 CSV/PDF export
- 🌙 Dark mode
- 📱 Improved mobile responsiveness
- 🧪 Automated testing
- ✅ Stronger API validation
- 📈 Category-wise spending analytics

---

## 🧑‍💻 Author

**Vamsi**

Engineering Student

GitHub: @dskvamsi

---

## 📌 Project Status

**Status: ✅ Live & Deployed**

Spendly Tracker is currently deployed and connected to a cloud-hosted MySQL database.

### 🌐 Live Application

https://spendly-tracker-production.up.railway.app

### 💻 GitHub Repository

https://github.com/dskvamsi/Expenses-Tracker.html

---

⭐ If you found this project useful, consider giving the repository a star!
