 # 💰 Expense Tracker

A full-stack **Expense Tracker application built as a practice project to learn and strengthen full-stack web development concepts**.

The project focuses on understanding how a frontend communicates with a backend REST API, how backend applications interact with a MySQL database, and how CRUD operations are implemented in a real application.

---

## 🎯 Project Purpose

This project was developed **for learning and practice purposes**.

The main goal was to gain hands-on experience with:

* Building a frontend using HTML, CSS, and JavaScript
* Creating a backend using Node.js and Express.js
* Designing and consuming REST APIs
* Performing CRUD operations
* Connecting a backend application to MySQL
* Working with asynchronous JavaScript
* Managing environment variables
* Using Git and GitHub for version control
* Understanding frontend-backend-database communication

This project is part of my journey toward becoming a stronger full-stack developer.

---

## 🚀 Project Overview

The application follows a simple client-server architecture:

```text
Frontend → REST API → Backend → MySQL
```

Users can create, view, update, delete, search, and filter expense records through the web interface.

The backend processes the requests and communicates with the MySQL database to store and retrieve the data.

---

## ✨ Features

* ➕ Add expenses
* 📋 View expenses
* ✏️ Edit expenses
* 🗑️ Delete expenses
* 🔍 Search expenses
* 🏷️ Filter expenses by category
* 💰 Calculate total expenses
* 📅 Store expense dates
* 💾 Persistent MySQL storage
* 🔄 REST API integration
* 🌐 Frontend-backend communication
* 🔐 Environment-based database configuration

---

## 🛠️ Tech Stack

| Layer           | Technology              |
| --------------- | ----------------------- |
| Frontend        | HTML5, CSS3, JavaScript |
| Backend         | Node.js, Express.js     |
| Database        | MySQL                   |
| Database Driver | MySQL2                  |
| API             | REST                    |
| Configuration   | dotenv                  |
| Development     | Nodemon                 |
| Version Control | Git & GitHub            |

---

## 🏗️ Architecture

```text
┌─────────────────────────┐
│         User            │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│       Frontend          │
│   HTML / CSS / JS       │
└────────────┬────────────┘
             │
             │ HTTP / REST API
             ▼
┌─────────────────────────┐
│        Backend          │
│    Node.js + Express    │
└────────────┬────────────┘
             │
             │ SQL Queries
             ▼
┌─────────────────────────┐
│         MySQL           │
│    Expense Database     │
└─────────────────────────┘
```

---

## 📂 Project Structure

```text
full-stack-project/
│
├── Backend/
│   ├── src/
│   │   ├── server.js
│   │   │
│   │   └── database/
│   │       ├── connection.js
│   │       │
│   │       └── routes/
│   │           └── services/
│   │               └── router.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
├── Frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── README.md
```

---

## 🔌 REST API

Base URL:

```text
/api/v1/expenses
```

### Available Endpoints

| Method   | Endpoint                   | Description              |
| -------- | -------------------------- | ------------------------ |
| `GET`    | `/api/v1/expenses/`        | Check API status         |
| `GET`    | `/api/v1/expenses/tables`  | Retrieve database tables |
| `GET`    | `/api/v1/expenses/allrows` | Retrieve all expenses    |
| `POST`   | `/api/v1/expenses/`        | Create an expense        |
| `PUT`    | `/api/v1/expenses/:id`     | Update an expense        |
| `DELETE` | `/api/v1/expenses/:id`     | Delete an expense        |

### Example Request

```http
POST /api/v1/expenses/
Content-Type: application/json
```

```json
{
  "description": "Lunch",
  "category": "Food",
  "expense_date": "2026-08-10",
  "amount": 250
}
```

---

# ⚙️ Getting Started

## Prerequisites

Install the following before running the project:

* Node.js
* npm
* MySQL
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/dskvamsi/full-stack-project.git
```

```bash
cd full-stack-project
```

---

## 2. Configure MySQL

Create a database:

```sql
CREATE DATABASE expense_tracker;
```

Create the expenses table:

```sql
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    expense_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 3. Configure Environment Variables

Navigate to the backend:

```bash
cd Backend
```

Create a `.env` file:

```env
PORT=3000

DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=expense_tracker
DB_PORT=3306
```

Replace the values with your local MySQL configuration.

> **Important:** Never commit `.env` or database credentials to GitHub.

---

## 4. Install Dependencies

Inside the `Backend` directory:

```bash
npm install
```

---

## 5. Start the Backend

Development mode:

```bash
npm run dev
```

Normal mode:

```bash
npm start
```

The backend runs on:

```text
http://localhost:3000
```

---

## 6. Run the Frontend

Open:

```text
Frontend/index.html
```

in your browser.

Using a local development server such as **VS Code Live Server** is recommended during development.

---

## 🔄 Application Flow

```text
User
 │
 ▼
Frontend
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
Frontend
```

---

## 🗄️ Database

The project uses **MySQL** to store expense records.

Each expense contains:

| Field          | Description                |
| -------------- | -------------------------- |
| `id`           | Unique expense ID          |
| `description`  | Description of the expense |
| `category`     | Expense category           |
| `expense_date` | Date of the expense        |
| `amount`       | Expense amount             |
| `created_at`   | Record creation timestamp  |

---

## 📸 Screenshots

Screenshots can be added here to demonstrate the application's interface.

Example:

```markdown
![Expense Tracker](screenshots/dashboard.png)
```

---

## 📚 What I Learned

Through this practice project, I gained hands-on experience with:

* HTML, CSS, and JavaScript
* Node.js
* Express.js
* REST APIs
* CRUD operations
* MySQL
* SQL queries
* Database connectivity
* Fetch API
* Asynchronous JavaScript
* Environment variables
* Git and GitHub
* Client-server architecture

---

## 🔮 Possible Improvements

Since this is a learning project, there are several areas that can be explored in future versions:

* User authentication
* User-specific expense data
* Expense analytics and charts
* Monthly and yearly reports
* Budget management
* CSV/PDF export
* Responsive mobile design
* Dark mode
* Automated testing
* API validation
* Cloud deployment

---

## 🔐 Security

Sensitive information should not be committed to the repository.

Do not upload:

```text
.env
database passwords
API keys
private credentials
```

Use `.gitignore` to protect local configuration files.

---

## 🧑‍💻 Author

**Vamsi**

Engineering Student

GitHub: [@dskvamsi](https://github.com/dskvamsi)

---

## 📌 Project Status

**Status:** Completed for practice and learning purposes.

This project is primarily intended to demonstrate my learning and practical understanding of full-stack web development concepts.

---

## ⭐ Repository

GitHub Repository:

**https://github.com/dskvamsi/full-stack-project**

If you find the project useful or want to explore the implementation, feel free to check out the repository.

---

<p align="center">
  Built as a learning project with HTML, CSS, JavaScript, Node.js, Express.js and MySQL.
</p>
