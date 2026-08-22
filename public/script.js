const API_URL = "/api/v1/expenses";

let expenses = [];
let editId = null;


// ==========================================
// AUTHENTICATION
// ==========================================

const token = localStorage.getItem("spendlyToken");


// If no token exists, go to login page
if (!token) {
    window.location.href = "login.html";
}


// Common authenticated headers
function getAuthHeaders(includeJson = false) {

    const headers = {
        "Authorization": `Bearer ${token}`
    };

    if (includeJson) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}


// Handle invalid / expired login
function handleUnauthorized(response) {

    if (response.status === 401) {

        localStorage.removeItem("spendlyToken");
        localStorage.removeItem("spendlyUser");

        alert("Your login has expired. Please sign in again.");

        window.location.href = "login.html";

        return true;
    }

    return false;
}


// ==========================================
// LOAD EXPENSES
// ==========================================

window.onload = function () {
    loadExpenses();
};


async function loadExpenses() {

    try {

        const response = await fetch(
            `${API_URL}/allrows`,
            {
                headers: getAuthHeaders()
            }
        );


        if (handleUnauthorized(response)) {
            return;
        }


        if (!response.ok) {
            throw new Error("Failed to fetch expenses");
        }


        expenses = await response.json();


        // Latest entered expenses first
        expenses.sort((a, b) =>
            new Date(b.created_at) -
            new Date(a.created_at)
        );


        renderExpenses();


    } catch (err) {

        console.error(
            "Load Expenses Error:",
            err
        );

        alert(
            "Unable to connect to the backend."
        );
    }
}


// ==========================================
// ADD / UPDATE EXPENSE
// ==========================================

async function addExpense() {

    const description =
        document
            .getElementById("desc")
            .value
            .trim();


    const category =
        document
            .getElementById("category")
            .value;


    const expense_date =
        document
            .getElementById("date")
            .value;


    const amount =
        Number(
            document
                .getElementById("amount")
                .value
        );


    // Validate input
    if (
        !description ||
        !category ||
        !expense_date ||
        amount <= 0
    ) {

        alert(
            "Please fill all fields."
        );

        return;
    }


    const expense = {
        description,
        category,
        expense_date,
        amount
    };


    const isEditing =
        editId !== null;


    try {

        let response;


        // ==================================
        // ADD EXPENSE
        // ==================================

        if (!isEditing) {

            response = await fetch(
                API_URL,
                {
                    method: "POST",

                    headers:
                        getAuthHeaders(true),

                    body:
                        JSON.stringify(expense)
                }
            );

        }


        // ==================================
        // UPDATE EXPENSE
        // ==================================

        else {

            response = await fetch(
                `${API_URL}/${editId}`,
                {
                    method: "PUT",

                    headers:
                        getAuthHeaders(true),

                    body:
                        JSON.stringify(expense)
                }
            );

        }


        if (handleUnauthorized(response)) {
            return;
        }


        const result =
            await response
                .json()
                .catch(() => null);


        if (!response.ok) {

            console.error(
                "Server Error:",
                result
            );


            alert(
                result?.message ||
                result?.error ||
                "Unable to save expense."
            );

            return;
        }


        if (isEditing) {

            editId = null;

            document
                .querySelector(".add-btn")
                .innerHTML =
                "<span>＋</span> Add Expense";
        }


        clearInputs();

        await loadExpenses();


        alert(
            isEditing
                ? "Expense updated successfully!"
                : "Expense added successfully!"
        );


    } catch (err) {

        console.error(
            "Add / Update Error:",
            err
        );


        alert(
            "Unable to connect to the backend."
        );
    }
}


// ==========================================
// RENDER EXPENSES
// ==========================================

function renderExpenses() {

    const tbody =
        document.getElementById(
            "expenseBody"
        );


    tbody.innerHTML = "";


    const search =
        document
            .getElementById("search")
            .value
            .toLowerCase();


    const filter =
        document
            .getElementById(
                "filterCategory"
            )
            .value;


    let total = 0;
    let sno = 1;


    expenses.forEach(expense => {

        const matchesSearch =
            expense
                .description
                .toLowerCase()
                .includes(search);


        const matchesCategory =
            filter === "All" ||
            expense.category === filter;


        if (
            !(
                matchesSearch &&
                matchesCategory
            )
        ) {
            return;
        }


        total += Number(expense.amount);


        const row =
            document.createElement("tr");


        // ==================================
        // FORMAT CREATED DATE & TIME
        // ==================================

        const createdAt =
            expense.created_at
                ? new Date(expense.created_at)
                : null;


        const formattedDateTime =
            createdAt &&
            !isNaN(createdAt)

                ? createdAt.toLocaleString(
                    "en-IN",
                    {
                        timeZone: "Asia/Kolkata",

                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",

                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",

                        hour12: true
                    }
                )

                : "-";


        row.innerHTML = `

            <td>${sno++}</td>

            <td>${expense.description}</td>

            <td>${expense.category}</td>

            <td>${formattedDateTime}</td>

            <td>
                ₹ ${Number(
                    expense.amount
                ).toFixed(2)}
            </td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editExpense(${expense.id})">
                    ✏️ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})">
                    🗑 Delete
                </button>

            </td>
        `;


        tbody.appendChild(row);

    });


    document
        .getElementById("total")
        .textContent =
        total.toFixed(2);
}


// ==========================================
// EDIT EXPENSE
// ==========================================

function editExpense(id) {

    const expense =
        expenses.find(
            e => e.id == id
        );


    if (!expense) {
        return;
    }


    document
        .getElementById("desc")
        .value =
        expense.description;


    document
        .getElementById("category")
        .value =
        expense.category;


    // Load saved expense date
    document
        .getElementById("date")
        .value =
        expense.expense_date
            ? String(
                expense.expense_date
            ).split("T")[0]
            : "";


    document
        .getElementById("amount")
        .value =
        expense.amount;


    editId = id;


    document
        .querySelector(".add-btn")
        .innerHTML =
        "<span>✏️</span> Update Expense";
}


// ==========================================
// DELETE EXPENSE
// ==========================================

async function deleteExpense(id) {

    if (
        !confirm(
            "Delete this expense?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE",

                    headers:
                        getAuthHeaders()
                }
            );


        if (handleUnauthorized(response)) {
            return;
        }


        const result =
            await response
                .json()
                .catch(() => null);


        if (!response.ok) {

            console.error(
                "Server Error:",
                result
            );


            alert(
                result?.message ||
                result?.error ||
                "Delete failed."
            );

            return;
        }


        await loadExpenses();


        alert(
            result?.message ||
            "Expense deleted successfully!"
        );


    } catch (err) {

        console.error(
            "Delete Error:",
            err
        );


        alert(
            "Unable to delete expense."
        );
    }
}


// ==========================================
// CLEAR INPUTS
// ==========================================

function clearInputs() {

    document
        .getElementById("desc")
        .value = "";


    document
        .getElementById("category")
        .value = "";


    document
        .getElementById("date")
        .value = "";


    document
        .getElementById("amount")
        .value = "";
}


// ==========================================
// CLEAR ALL EXPENSES
// ==========================================

async function clearAll() {

    if (expenses.length === 0) {

        alert(
            "There are no expenses to clear."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete all expenses?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/clear`,
                {
                    method: "DELETE",

                    headers:
                        getAuthHeaders()
                }
            );


        if (handleUnauthorized(response)) {
            return;
        }


        const result =
            await response
                .json()
                .catch(() => null);


        if (!response.ok) {

            console.error(
                "Server Error:",
                result
            );


            alert(
                result?.message ||
                result?.error ||
                "Unable to clear all expenses."
            );

            return;
        }


        await loadExpenses();


        alert(
            result?.message ||
            "All expenses deleted successfully!"
        );


    } catch (err) {

        console.error(
            "Clear All Error:",
            err
        );


        alert(
            "Unable to connect to the backend."
        );
    }
}


// ==========================================
// SEARCH
// ==========================================

document
    .getElementById("search")
    .addEventListener(
        "input",
        renderExpenses
    );


// ==========================================
// CATEGORY FILTER
// ==========================================

document
    .getElementById(
        "filterCategory"
    )
    .addEventListener(
        "change",
        renderExpenses
    );


// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

document
    .getElementById("desc")
    .addEventListener(
        "keydown",
        e => {

            if (e.key === "Enter") {

                document
                    .getElementById(
                        "category"
                    )
                    .focus();
            }
        }
    );


document
    .getElementById("category")
    .addEventListener(
        "keydown",
        e => {

            if (e.key === "Enter") {

                document
                    .getElementById(
                        "date"
                    )
                    .focus();
            }
        }
    );


document
    .getElementById("date")
    .addEventListener(
        "keydown",
        e => {

            if (e.key === "Enter") {

                document
                    .getElementById(
                        "amount"
                    )
                    .focus();
            }
        }
    );


document
    .getElementById("amount")
    .addEventListener(
        "keydown",
        e => {

            if (e.key === "Enter") {

                addExpense();

            }
        }
    );

    // ==========================================
// LOGOUT
// ==========================================

function logout() {

    // Remove JWT token
    localStorage.removeItem("spendlyToken");

    // Remove saved user information
    localStorage.removeItem("spendlyUser");

    // Return to login page
    window.location.href = "login.html";
}