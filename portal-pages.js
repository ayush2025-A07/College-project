const menuToggle = document.querySelector(".menu-toggle");
const sideNav = document.querySelector("#side-nav");
const themeToggle = document.querySelector("#theme-toggle");

if (menuToggle && sideNav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
        sideNav.classList.toggle("is-open", !isOpen);
    });

    sideNav.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            sideNav.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation");
        }
    });
}

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    if (themeToggle) {
        themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
    try {
        localStorage.setItem("college-erp-theme", theme);
    } catch {
        // Keep the selected theme for this page view if storage is disabled.
    }
}

try {
    const savedTheme = localStorage.getItem("college-erp-theme");
    if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
    }
} catch {
    // Light theme is the default when storage is disabled.
}

themeToggle?.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle && sideNav) {
        sideNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
    }
});

document.querySelectorAll("[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const feedback = document.querySelector(form.dataset.feedback);
        if (feedback) {
            feedback.textContent = form.dataset.success || "Saved for this demo.";
        }
        form.reset();
    });
});

document.querySelectorAll("[data-demo-action]").forEach((button) => {
    button.addEventListener("click", () => {
        const feedback = document.querySelector(button.dataset.feedback);
        if (feedback) {
            feedback.textContent = button.dataset.success || "This action is a front-end demo.";
        }
    });
});
