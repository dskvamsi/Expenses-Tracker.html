const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");


// ==========================================
// LOGIN FORM
// ==========================================

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username = document
        .getElementById("username")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    loginMessage.textContent = "";


    // ======================================
    // VALIDATION
    // ======================================

    if (!username || !password) {

        showMessage(
            "Username and password are required.",
            "error"
        );

        return;
    }


    // ======================================
    // SEND LOGIN REQUEST
    // ======================================

    try {

                const response = await fetch("/api/auth/login", {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })
            }
        );


        const data = await response.json();


        // ==================================
        // LOGIN FAILED
        // ==================================

        if (!response.ok) {

            showMessage(
                data.message || "Login failed.",
                "error"
            );

            return;
        }


        // ==================================
        // LOGIN SUCCESSFUL
        // ==================================

        showMessage(
            "Login successful. Opening Spendly...",
            "success"
        );


        // Save JWT token
        localStorage.setItem(
            "spendlyToken",
            data.token
        );


        // Save logged-in user information
        localStorage.setItem(
            "spendlyUser",
            JSON.stringify(data.user)
        );


        // Redirect to dashboard
        setTimeout(() => {

            window.location.href = "index.html";

        }, 1000);


    } catch (error) {

        console.error("Login error:", error);

        showMessage(
            "Unable to connect to the server.",
            "error"
        );
    }

});


// ==========================================
// MESSAGE FUNCTION
// ==========================================

function showMessage(message, type) {

    loginMessage.textContent = message;

    if (type === "success") {

        loginMessage.style.color = "#16a34a";

    } else {

        loginMessage.style.color = "#dc2626";
    }
}