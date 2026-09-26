const menuToggle = document.querySelector(".menu-toggle");
const sideNav = document.querySelector("#side-nav");
const searchForm = document.querySelector(".global-search");
const searchInput = document.querySelector("#global-search");
const searchResults = document.querySelector("#search-results");
const notificationToggle = document.querySelector("#notification-toggle");
const notificationPanel = document.querySelector("#notification-panel");
const notificationList = document.querySelector("#notification-list");
const themeToggle = document.querySelector("#theme-toggle");
const roleSelect = document.querySelector("#role-select");
const toast = document.querySelector("#toast");
let toastTimer;

const searchItems = [
    { title: "Student dashboard", detail: "Overview and today's classes", target: "overview" },
    { title: "Attendance", detail: "Monthly history and subject records", target: "attendance" },
    { title: "Courses and timetable", detail: "Subjects, faculty and class schedule", target: "courses" },
    { title: "Assignments", detail: "Deadlines and submission status", target: "assignments" },
    { title: "Marks and results", detail: "Internal marks, grades and CGPA", target: "results" },
    { title: "Study materials", detail: "Course notes and resources", target: "resources" },
    { title: "Fees", detail: "Balance and payment history", target: "fees" },
    { title: "Academic calendar", detail: "Exams, holidays and events", target: "calendar" },
    { title: "Campus and support", detail: "Messages, facilities and help desk", target: "campus" },
    { title: "Student profile", detail: "Enrollment and account information", target: "profile" },
    { title: "Database Systems internal", detail: "Upcoming examination · September 30", target: "calendar" },
    { title: "Semester exam schedule released", detail: "Examination announcement", target: "calendar" },
    { title: "Web Programming assignment", detail: "Due September 27", target: "assignments" },
];

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    sideNav.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    sideNav.classList.toggle("is-open", !isOpen);
});

sideNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
        notificationPanel.hidden = true;
        notificationToggle.setAttribute("aria-expanded", "false");
        searchResults.hidden = true;
    }
});

function renderSearchResults(query) {
    const normalizedQuery = query.trim().toLowerCase();
    searchResults.replaceChildren();
    if (!normalizedQuery) {
        searchResults.hidden = true;
        return;
    }

    const matches = searchItems.filter((item) => `${item.title} ${item.detail}`.toLowerCase().includes(normalizedQuery));
    if (matches.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.className = "search-empty";
        emptyMessage.textContent = "No matching sections found.";
        searchResults.append(emptyMessage);
    } else {
        matches.slice(0, 6).forEach((item) => {
            const result = document.createElement("button");
            result.className = "search-result";
            result.type = "button";
            result.setAttribute("role", "option");
            result.dataset.target = item.target;
            const title = document.createElement("strong");
            const detail = document.createElement("small");
            title.textContent = item.title;
            detail.textContent = item.detail;
            result.append(title, detail);
            searchResults.append(result);
        });
    }
    searchResults.hidden = false;
}

searchInput.addEventListener("input", () => renderSearchResults(searchInput.value));
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderSearchResults(searchInput.value);
});
searchInput.addEventListener("focus", () => searchForm.classList.add("is-open"));
searchResults.addEventListener("click", (event) => {
    const result = event.target.closest("[data-target]");
    if (!result) return;
    document.getElementById(result.dataset.target).scrollIntoView({ behavior: "smooth" });
    searchResults.hidden = true;
    searchInput.value = "";
    searchInput.blur();
});

document.addEventListener("click", (event) => {
    if (!searchForm.contains(event.target)) {
        searchResults.hidden = true;
        searchForm.classList.remove("is-open");
    }
    if (!notificationPanel.contains(event.target) && !notificationToggle.contains(event.target)) {
        notificationPanel.hidden = true;
        notificationToggle.setAttribute("aria-expanded", "false");
    }
});

notificationToggle.addEventListener("click", () => {
    const isOpen = notificationToggle.getAttribute("aria-expanded") === "true";
    notificationToggle.setAttribute("aria-expanded", String(!isOpen));
    notificationPanel.hidden = isOpen;
});

document.querySelector("#mark-read").addEventListener("click", () => {
    notificationList.classList.add("is-read");
    document.querySelector(".notification-count").hidden = true;
    notificationToggle.setAttribute("aria-label", "Notifications, all read");
    showToast("Notifications marked as read.");
});

function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const darkMode = theme === "dark";
    themeToggle.setAttribute("aria-label", darkMode ? "Switch to light theme" : "Switch to dark theme");
    try {
        localStorage.setItem("college-erp-theme", theme);
    } catch {
        // Theme still works for this page view when browser storage is unavailable.
    }
}

try {
    const savedTheme = localStorage.getItem("college-erp-theme");
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
} catch {
    // The default light theme remains available when browser storage is unavailable.
}
themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
});

roleSelect.addEventListener("change", () => {
    document.querySelector("#faculty-view").hidden = roleSelect.value !== "faculty";
    document.querySelector("#admin-view").hidden = roleSelect.value !== "admin";
    showToast(`${roleSelect.options[roleSelect.selectedIndex].text} preview selected. Demo data only.`);
});

const assignmentRows = [...document.querySelectorAll("[data-assignment]")];
const assignmentFilters = [...document.querySelectorAll("[data-assignment-filter]")];

function updateAssignmentCounts() {
    const pendingCount = assignmentRows.filter((row) => row.dataset.status === "pending").length;
    const completedCount = assignmentRows.length - pendingCount;
    document.querySelector('[data-assignment-filter="all"] span').textContent = assignmentRows.length;
    document.querySelector('[data-assignment-filter="pending"] span').textContent = pendingCount;
    document.querySelector('[data-assignment-filter="completed"] span').textContent = completedCount;
    document.querySelector(".side-count").textContent = pendingCount;
    document.querySelector(".metric-assignments > strong").innerHTML = `${pendingCount}<span class="metric-unit">tasks</span>`;
}

function filterAssignments(filter) {
    assignmentRows.forEach((row) => {
        row.hidden = filter !== "all" && row.dataset.status !== filter;
    });
}

assignmentFilters.forEach((button) => {
    button.addEventListener("click", () => {
        assignmentFilters.forEach((filterButton) => {
            const selected = filterButton === button;
            filterButton.classList.toggle("is-selected", selected);
            filterButton.setAttribute("aria-pressed", String(selected));
        });
        filterAssignments(button.dataset.assignmentFilter);
    });
});

document.querySelectorAll(".submit-assignment").forEach((button) => {
    button.addEventListener("click", () => {
        const row = button.closest("[data-assignment]");
        row.dataset.status = "completed";
        const status = row.querySelector(".table-status");
        status.className = "table-status status-good";
        status.textContent = "Submitted";
        button.textContent = "Submitted";
        button.disabled = true;
        updateAssignmentCounts();
        const activeFilter = document.querySelector(".filter-tab.is-selected").dataset.assignmentFilter;
        filterAssignments(activeFilter);
        showToast("Assignment marked as submitted in this demo.");
    });
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#message-feedback").textContent = "Message queued locally. Faculty messaging is not connected.";
    event.currentTarget.reset();
});

document.querySelector("#support-form").addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#support-feedback").textContent = "Support request recorded locally for this demo.";
    event.currentTarget.reset();
});

const profileDialog = document.querySelector("#profile-dialog");
const paymentDialog = document.querySelector("#payment-dialog");
document.querySelector("#profile-open").addEventListener("click", () => profileDialog.showModal());
document.querySelector("#profile-edit").addEventListener("click", () => profileDialog.showModal());
document.querySelector("#payment-details").addEventListener("click", () => paymentDialog.showModal());
document.querySelector(".dialog-dismiss").addEventListener("click", () => paymentDialog.close());

document.querySelectorAll(".app-dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
});

document.querySelector("#profile-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name").trim();
    const email = formData.get("email").trim();
    document.querySelector("#welcome-title").textContent = `Good morning, ${name.split(" ")[0]}`;
    document.querySelector(".user-chip").setAttribute("aria-label", `Edit ${name} profile`);
    document.querySelector(".user-chip > span").textContent = name;
    document.querySelectorAll(".student-identity h3").forEach((heading) => { heading.textContent = name; });
    document.querySelector(".detail-item dd a[href^='mailto']").textContent = email;
    document.querySelector(".detail-item dd a[href^='mailto']").href = `mailto:${email}`;
    document.querySelector("#profile-feedback").textContent = "Profile updated for this page view.";
    profileDialog.close();
    showToast("Profile updated for this demo.");
});

document.querySelector("#print-page").addEventListener("click", () => window.print());
