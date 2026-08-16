const API_URL = "http://localhost:3000/api/v1/expenses";

let expenses = [];
let editId = null;

// -------------------------
// Load Expenses
// -------------------------
window.onload = function () {
    loadExpenses();
};

async function loadExpenses() {
    try {
        const response = await fetch(`${API_URL}/allrows`);

        if (!response.ok) {
            throw new Error("Failed to fetch expenses");
        }

        expenses = await response.json();

        // Latest expenses first
        expenses.sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
        );

        renderExpenses();

    } catch (err) {
        console.error(err);
        alert("Unable to connect to the backend.");
    }
}

// -------------------------
// Add / Update Expense
// -------------------------
async function addExpense() {

    const description =
        document.getElementById("desc").value.trim();

    const category =
        document.getElementById("category").value;

    const expense_date =
        document.getElementById("date").value;

    const amount =
        Number(document.getElementById("amount").value);


    if (!description || !category || !expense_date || amount <= 0) {
        alert("Please fill all fields.");
        return;
    }


    const expense = {
        description,
        category,
        expense_date,
        amount
    };


    const isEditing = editId !== null;


    try {

        let response;


        // -------------------------
        // ADD
        // -------------------------
        if (!isEditing) {

            response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(expense)
            });

        }


        // -------------------------
        // UPDATE
        // -------------------------
        else {

            response = await fetch(`${API_URL}/${editId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(expense)
            });

        }


        const result =
            await response.json().catch(() => null);


        if (!response.ok) {

            console.error("Server Error:", result);

            alert(
                result?.message ||
                result?.error ||
                "Unable to save expense."
            );

            return;
        }


        // Reset edit mode
        if (isEditing) {

            editId = null;

            document.querySelector(".add-btn").textContent =
                "Add Expense";
        }


        clearInputs();

        await loadExpenses();


        alert(
            isEditing
                ? "Expense updated successfully!"
                : "Expense added successfully!"
        );


    } catch (err) {

        console.error(err);

        alert("Unable to connect to the backend.");

    }
}


// -------------------------
// Render Expenses
// -------------------------
function renderExpenses() {

    const tbody =
        document.getElementById("expenseBody");

    tbody.innerHTML = "";


    const search =
        document
            .getElementById("search")
            .value
            .toLowerCase();


    const filter =
        document
            .getElementById("filterCategory")
            .value;


    let total = 0;
    let sno = 1;


    expenses.forEach(expense => {

        const matchesSearch =
            expense.description
                .toLowerCase()
                .includes(search);


        const matchesCategory =
            filter === "All" ||
            expense.category === filter;


        if (!(matchesSearch && matchesCategory)) {
            return;
        }


        total += Number(expense.amount);


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${sno++}</td>

            <td>${expense.description}</td>

            <td>${expense.category}</td>

            <td>
                ${new Date(expense.created_at).toLocaleString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    }
                )}
            </td>

            <td>
                ₹ ${Number(expense.amount).toFixed(2)}
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


    document.getElementById("total").textContent =
        total.toFixed(2);
}


// -------------------------
// Edit
// -------------------------
function editExpense(id) {

    const expense =
        expenses.find(e => e.id == id);


    if (!expense) {
        return;
    }


    document.getElementById("desc").value =
        expense.description;


    document.getElementById("category").value =
        expense.category;


    document.getElementById("date").value =
        expense.expense_date.split("T")[0];


    document.getElementById("amount").value =
        expense.amount;


    editId = id;


    document.querySelector(".add-btn").textContent =
        "Update Expense";
}


// -------------------------
// Delete
// -------------------------
async function deleteExpense(id) {

    if (!confirm("Delete this expense?")) {
        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });


        const result =
            await response.json().catch(() => null);


        if (!response.ok) {

            console.error("Server Error:", result);

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

        console.error(err);

        alert("Unable to delete expense.");

    }
}


// -------------------------
// Clear Inputs
// -------------------------
function clearInputs() {

    document.getElementById("desc").value = "";

    document.getElementById("category").value = "";

    document.getElementById("date").value = "";

    document.getElementById("amount").value = "";
}


// -------------------------
// Clear All
// -------------------------
async function clearAll() {

    // Check whether expenses exist
    if (expenses.length === 0) {
        alert("There are no expenses to clear.");
        return;
    }


    // Confirmation before deleting everything
    const confirmed = confirm(
        "Are you sure you want to delete all expenses?"
    );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(`${API_URL}/clear`, {
                method: "DELETE"
            });


        const result =
            await response.json().catch(() => null);


        if (!response.ok) {

            console.error("Server Error:", result);

            alert(
                result?.message ||
                result?.error ||
                "Unable to clear all expenses."
            );

            return;
        }


        // Reload data from database
        await loadExpenses();


        alert(
            result?.message ||
            "All expenses deleted successfully!"
        );


    } catch (err) {

        console.error("Clear All Error:", err);

        alert("Unable to connect to the backend.");

    }
}


// -------------------------
// Search
// -------------------------
document.getElementById("search").addEventListener(
    "input",
    renderExpenses
);


// -------------------------
// Category Filter
// -------------------------
document.getElementById("filterCategory").addEventListener(
    "change",
    renderExpenses
);


// -------------------------
// Keyboard Shortcuts
// -------------------------
document.getElementById("desc").addEventListener(
    "keydown",
    e => {

        if (e.key === "Enter") {
            document.getElementById("category").focus();
        }

    }
);


document.getElementById("category").addEventListener(
    "keydown",
    e => {

        if (e.key === "Enter") {
            document.getElementById("date").focus();
        }

    }
);


document.getElementById("date").addEventListener(
    "keydown",
    e => {

        if (e.key === "Enter") {
            document.getElementById("amount").focus();
        }

    }
);


document.getElementById("amount").addEventListener(
    "keydown",
    e => {

        if (e.key === "Enter") {
            addExpense();
        }

    }
);