const loginForm = document.querySelector("#login-form");
const loginFeedback = document.querySelector("#login-feedback");

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!loginForm.reportValidity()) return;

    loginFeedback.textContent = "Demo sign-in successful. Opening the student dashboard...";
    window.location.assign("index.html");
});
