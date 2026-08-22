const registerForm = document.getElementById("registerForm");
const registerMessage = document.getElementById("registerMessage");

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document
        .getElementById("username")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    const confirmPassword = document
        .getElementById("confirmPassword")
        .value;

    registerMessage.textContent = "";

    if (username.length < 3) {
        showMessage(
            "Username must be at least 3 characters.",
            "error"
        );
        return;
    }

    if (password.length < 6) {
        showMessage(
            "Password must be at least 6 characters.",
            "error"
        );
        return;
    }

    if (password !== confirmPassword) {
        showMessage(
            "Passwords do not match.",
            "error"
        );
        return;
    }

    try {
       const response = await fetch("/api/auth/register", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(
                data.message || "Unable to create account.",
                "error"
            );
            return;
        }

        showMessage(
            "Account created successfully. Redirecting to login...",
            "success"
        );

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        console.error("Registration error:", error);

        showMessage(
            "Unable to connect to the server.",
            "error"
        );
    }
});


function showMessage(message, type) {
    registerMessage.textContent = message;

    if (type === "success") {
        registerMessage.style.color = "#16a34a";
    } else {
        registerMessage.style.color = "#dc2626";
    }
}