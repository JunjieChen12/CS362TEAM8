const API_BASE_URL  = "http://localhost:5000/api";
const USERS_KEY    = "taskwise_users";
const LS_USER_KEY  = "taskwise_user";
const LS_TOKEN_KEY = "taskwise_token";

// ==========================================
// AUTH HELPERS
// ==========================================

function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

function setSession(user) {
  localStorage.setItem(LS_USER_KEY, JSON.stringify({ id: user.id, name: user.name, email: user.email }));
  localStorage.setItem(LS_TOKEN_KEY, "mock_token_" + Date.now());
}
function getSessionUser() {
  try {
    const raw = localStorage.getItem(LS_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function isLoggedIn() { return !!localStorage.getItem(LS_TOKEN_KEY); }

// Page guard — call on every page
function enforcePageGuards() {
  const page = window.location.pathname.split("/").pop();
  if ((page === "login.html" || page === "register.html") && isLoggedIn()) {
    window.location.href = "dashboard.html";
  }
  if ((page === "dashboard.html" || page === "profile.html") && !isLoggedIn()) {
    window.location.href = "login.html";
  }
  if (page === "" || page === "index.html") {
    if (isLoggedIn()) window.location.href = "dashboard.html";
  }
}

// ==========================================
// REGISTER FORM
// ==========================================

function initRegister() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name            = document.getElementById("registerName").value.trim();
    const email           = document.getElementById("registerEmail").value.trim().toLowerCase();
    const password        = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!name || !email || !password || !confirmPassword) {
      showAuthAlert("registerAlert", "registerAlertMessage", "Please fill in all fields.", "danger");
      return;
    }
    if (password.length < 8) {
      showAuthAlert("registerAlert", "registerAlertMessage", "Password must be at least 8 characters.", "danger");
      return;
    }
    if (password !== confirmPassword) {
      showAuthAlert("registerAlert", "registerAlertMessage", "Passwords do not match.", "danger");
      return;
    }

    const users    = getUsers();
    const existing = users.find(u => u.email === email);
    if (existing) {
      showAuthAlert("registerAlert", "registerAlertMessage", "Email already registered. Please log in.", "danger");
      setTimeout(() => window.location.href = "login.html", 1500);
      return;
    }

    const newUser = { id: Date.now(), name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    saveUsers(users);
    setSession(newUser);
    window.location.href = "dashboard.html";
  });
}

// ==========================================
// LOGIN FORM
// ==========================================

function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email    = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const users    = getUsers();

    if (users.length === 0) {
      showAuthAlert("loginAlert", "loginAlertMessage", "No accounts found. Please register first.", "danger");
      setTimeout(() => window.location.href = "register.html", 1500);
      return;
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      showAuthAlert("loginAlert", "loginAlertMessage", "Account not found. Please register.", "danger");
      return;
    }
    if (user.password !== password) {
      showAuthAlert("loginAlert", "loginAlertMessage", "Incorrect password. Try again.", "danger");
      return;
    }

    setSession(user);
    window.location.href = "dashboard.html";
  });
}

function showAuthAlert(alertId, msgId, message, type) {
  const alertEl = document.getElementById(alertId);
  const msgEl   = document.getElementById(msgId);
  if (!alertEl || !msgEl) return;
  alertEl.className = `alert alert-${type}`;
  msgEl.textContent = message;
}

// ==========================================
// PASSWORD TOGGLE (used in login + register)
// ==========================================

function togglePassword(inputId) {
  const input   = document.getElementById(inputId);
  const iconId  = inputId + "Icon";
  const icon    = document.getElementById(iconId);
  if (!input) return;

  if (input.type === "password") {
    input.type  = "text";
    if (icon) { icon.classList.remove("bi-eye"); icon.classList.add("bi-eye-slash"); }
  } else {
    input.type  = "password";
    if (icon) { icon.classList.remove("bi-eye-slash"); icon.classList.add("bi-eye"); }
  }
}

function googleLogin() { alert("Google login: coming soon!"); }

// ==========================================
// TASK PERSISTENCE (per user in localStorage)
// ==========================================

function getTasksKey() {
  const user = getSessionUser();
  return user ? `taskwise_tasks_${user.id}` : "taskwise_tasks_guest";
}

function loadTasksFromStorage() {
  try {
    const raw = localStorage.getItem(getTasksKey());
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveTasksToStorage() {
  localStorage.setItem(getTasksKey(), JSON.stringify(sampleTasks));
}

// ==========================================
// DASHBOARD — data & state
// ==========================================

let newTaskModal, editTaskModal, viewTaskModal;
let currentViewTaskId = null;
let sampleTasks = [];

// ==========================================
// DASHBOARD — INIT
// ==========================================

function initDashboard() {
  const newTaskModalEl  = document.getElementById("newTaskModal");
  const editTaskModalEl = document.getElementById("editTaskModal");
  const viewTaskModalEl = document.getElementById("viewTaskModal");
  if (newTaskModalEl)  newTaskModal  = new bootstrap.Modal(newTaskModalEl);
  if (editTaskModalEl) editTaskModal = new bootstrap.Modal(editTaskModalEl);
  if (viewTaskModalEl) viewTaskModal = new bootstrap.Modal(viewTaskModalEl);

  // Fix Bootstrap scroll lock — restore body scroll after any modal closes
  document.querySelectorAll(".modal").forEach(el => {
    el.addEventListener("hidden.bs.modal", () => {
      document.body.style.overflow   = "";
      document.body.style.paddingRight = "";
      document.body.classList.remove("modal-open");
    });
  });

  renderGreetingTime();
  renderUserName();
  updateCurrentDate();
  setMinDate();
  attachDashboardListeners();
  loadTasks();
}

function attachDashboardListeners() {
  const newTaskBtn = document.getElementById("newTaskBtn");
  if (newTaskBtn) newTaskBtn.addEventListener("click", openNewTaskModal);

  const newTaskForm = document.getElementById("newTaskForm");
  if (newTaskForm) newTaskForm.addEventListener("submit", handleNewTaskSubmit);

  const editTaskForm = document.getElementById("editTaskForm");
  if (editTaskForm) editTaskForm.addEventListener("submit", handleEditTaskSubmit);

  document.querySelectorAll('input[name="viewFilter"]').forEach(r => r.addEventListener("change", filterTasks));

  const startFocusBtn = document.getElementById("startFocusBtn");
  if (startFocusBtn) startFocusBtn.addEventListener("click", () => alert("Focus Mode: timer coming soon!"));

  const notificationBtn = document.getElementById("notificationBtn");
  if (notificationBtn) notificationBtn.addEventListener("click", () => alert("No new notifications."));

  const profileBtn = document.getElementById("profileBtn");
  if (profileBtn) profileBtn.addEventListener("click", () => window.location.href = "profile.html");
}

// ==========================================
// DASHBOARD — DATE / GREETING
// ==========================================

function renderGreetingTime() {
  const el   = document.getElementById("greetingTime");
  if (!el) return;
  const hour = new Date().getHours();
  el.textContent = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
}

function renderUserName() {
  const user  = getSessionUser();
  const el    = document.getElementById("userName");
  if (!el) return;
  const name  = user?.name || user?.username || [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  el.textContent = name || "User";
}

function updateCurrentDate() {
  const el = document.getElementById("currentDate");
  if (!el) return;
  el.textContent = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  ["taskDeadline", "editTaskDeadline"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.setAttribute("min", today);
  });
}

// ==========================================
// DASHBOARD — TASK CRUD
// ==========================================

function loadTasks() {
  sampleTasks = loadTasksFromStorage();
  renderTasks(sampleTasks);
  updateFocusBanner(sampleTasks);
  initActionDropdown(); // ensure single dropdown exists in body
}

function createTask(data) {
  const newTask = { id: Date.now(), ...data, is_completed: false };
  sampleTasks.push(newTask);
  saveTasksToStorage();
  loadTasks();
}

function updateTask(taskId, data) {
  const i = sampleTasks.findIndex(t => t.id === taskId);
  if (i !== -1) sampleTasks[i] = { ...sampleTasks[i], ...data };
  saveTasksToStorage();
  loadTasks();
}

function deleteTask(taskId) {
  sampleTasks = sampleTasks.filter(t => t.id !== taskId);
  saveTasksToStorage();
  loadTasks();
}

function toggleTaskCompletion(taskId, isCompleted) {
  const task = sampleTasks.find(t => t.id === taskId);
  if (task) task.is_completed = isCompleted;
  saveTasksToStorage();
  loadTasks();
}

// ==========================================
// DASHBOARD — RENDERING
// ==========================================

function renderTasks(tasks) {
  const taskList   = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");
  if (!taskList || !emptyState) return;

  const activeTasks = tasks.filter(t => !t.is_completed);

  if (activeTasks.length === 0) {
    taskList.innerHTML = "";
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";
  taskList.innerHTML = activeTasks.map(createTaskCard).join("");
}

function createTaskCard(task) {
  const isCompleted = task.is_completed;
  return `
    <div class="task-card ${isCompleted ? "completed" : ""}" data-task-id="${task.id}">
      <div class="task-checkbox" onclick="handleToggleTask(${task.id})">
        ${isCompleted ? '<i class="bi bi-check-lg"></i>' : ""}
      </div>
      <div class="task-content">
        <h3 class="task-title">${task.name}</h3>
        <div class="task-meta">
          <span class="meta-item"><i class="bi bi-clock"></i>${formatDuration(task.duration)}</span>
          <span class="meta-item"><i class="bi bi-calendar"></i>${formatDeadline(task.deadline)}</span>
          <span class="priority-badge priority-${task.priority}">${task.priority}</span>
          ${task.category ? `<span class="meta-item"><i class="bi bi-tag"></i>${task.category}</span>` : ""}
        </div>
      </div>
      <div class="task-actions">
        <button class="action-menu-btn" onclick="toggleActionMenu(event, ${task.id})" title="Task actions">
          <i class="bi bi-three-dots-vertical"></i>
        </button>
      </div>
    </div>`;
}

// Remove old buildDropdownsInBody — no longer needed
function buildDropdownsInBody() {}


function updateFocusBanner(tasks) {
  const banner = document.querySelector(".focus-banner");
  if (!banner) return;
  const incomplete = tasks.filter(t => !t.is_completed);

  if (incomplete.length === 0) { banner.style.display = "none"; return; }
  banner.style.display = "block";

  const t = incomplete[0];
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("focusTaskTitle",    t.name);
  set("focusTaskDuration", formatDuration(t.duration));
  set("focusTaskDeadline", formatDeadline(t.deadline));
  set("focusTaskPriority", t.priority.charAt(0).toUpperCase() + t.priority.slice(1));
}

// ==========================================
// DASHBOARD — MODAL HANDLERS
// ==========================================

function openNewTaskModal() {
  const form = document.getElementById("newTaskForm");
  if (form) form.reset();
  if (newTaskModal) newTaskModal.show();
}

function handleViewTask(taskId) {
  const task = sampleTasks.find(t => t.id === taskId);
  if (!task) return;
  currentViewTaskId = taskId;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("viewTaskName",        task.name);
  set("viewTaskDescription", task.description || "No description provided.");
  set("viewTaskDuration",    formatDuration(task.duration));
  set("viewTaskDeadline",    task.deadline ? new Date(task.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—");
  set("viewTaskPriority",    task.priority.charAt(0).toUpperCase() + task.priority.slice(1));
  set("viewTaskCategory",    task.category ? task.category.charAt(0).toUpperCase() + task.category.slice(1) : "None");
  set("viewCompleteLabel",   task.is_completed ? "Mark Incomplete" : "Mark Complete");

  const banner = document.getElementById("viewStatusBanner");
  if (banner) banner.style.display = task.is_completed ? "flex" : "none";

  const completeBtn = document.getElementById("viewCompleteBtn");
  if (completeBtn) {
    completeBtn.className = task.is_completed
      ? "btn btn-outline-secondary flex-fill"
      : "btn btn-primary flex-fill";
    completeBtn.querySelector("i").className = task.is_completed
      ? "bi bi-arrow-counterclockwise me-1"
      : "bi bi-check-circle me-1";
  }

  if (viewTaskModal) viewTaskModal.show();
}

function handleToggleTaskFromView() {
  if (currentViewTaskId === null) return;
  handleToggleTask(currentViewTaskId);
  // Refresh the view modal content after toggle
  if (viewTaskModal) {
    viewTaskModal.hide();
    setTimeout(() => handleViewTask(currentViewTaskId), 350);
  }
}

function handleEditFromView() {
  if (currentViewTaskId === null) return;
  if (viewTaskModal) viewTaskModal.hide();
  setTimeout(() => handleEditTaskOpen(currentViewTaskId), 350);
}

function handleDeleteFromView() {
  if (currentViewTaskId === null) return;
  if (viewTaskModal) viewTaskModal.hide();
  setTimeout(() => handleDeleteTask(currentViewTaskId), 350);
}

function handleDeleteFromEdit() {
  const id = parseInt(document.getElementById("editTaskId")?.value || "0", 10);
  if (!id) return;
  if (editTaskModal) editTaskModal.hide();
  setTimeout(() => handleDeleteTask(id), 350);
}

function handleNewTaskSubmit(e) {
  e.preventDefault();
  createTask({
    name:        document.getElementById("taskName")?.value || "",
    description: document.getElementById("taskDescription")?.value || "",
    duration:    parseInt(document.getElementById("taskDuration")?.value || "0", 10),
    deadline:    document.getElementById("taskDeadline")?.value || "",
    priority:    document.getElementById("taskPriority")?.value || "low",
    category:    document.getElementById("taskCategory")?.value || "",
  });
  if (newTaskModal) newTaskModal.hide();
}

function handleEditTaskOpen(taskId) {
  const task = sampleTasks.find(t => t.id === taskId);
  if (!task) return;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  set("editTaskId",          task.id);
  set("editTaskName",        task.name);
  set("editTaskDescription", task.description || "");
  set("editTaskDuration",    task.duration);
  set("editTaskDeadline",    task.deadline);
  set("editTaskPriority",    task.priority);
  set("editTaskCategory",    task.category || "");

  const completedEl = document.getElementById("editTaskCompleted");
  if (completedEl) completedEl.checked = task.is_completed;

  if (editTaskModal) editTaskModal.show();
}

function handleEditTaskSubmit(e) {
  e.preventDefault();
  const id = parseInt(document.getElementById("editTaskId")?.value || "0", 10);
  if (!id) return;
  const completedEl = document.getElementById("editTaskCompleted");
  updateTask(id, {
    name:         document.getElementById("editTaskName")?.value || "",
    description:  document.getElementById("editTaskDescription")?.value || "",
    duration:     parseInt(document.getElementById("editTaskDuration")?.value || "0", 10),
    deadline:     document.getElementById("editTaskDeadline")?.value || "",
    priority:     document.getElementById("editTaskPriority")?.value || "low",
    category:     document.getElementById("editTaskCategory")?.value || "",
    is_completed: completedEl ? completedEl.checked : false,
  });
  if (editTaskModal) editTaskModal.hide();
}

// ==========================================
// DASHBOARD — ACTIONS & FILTER
// ==========================================

function handleToggleTask(taskId) {
  const card = document.querySelector(`[data-task-id="${taskId}"]`);
  if (!card) return;
  toggleTaskCompletion(taskId, !card.classList.contains("completed"));
}

function handleDeleteTask(taskId) {
  if (!confirm("Are you sure you want to delete this task?")) return;
  const card = document.querySelector(`[data-task-id="${taskId}"]`);
  if (card) card.style.animation = "slideInUp 0.3s ease-out reverse";
  setTimeout(() => deleteTask(taskId), 300);
}

function filterTasks() {
  const selected = document.querySelector('input[name="viewFilter"]:checked');
  const filter   = selected ? selected.id : "filterAll";
  let filtered   = [...sampleTasks];
  const now      = new Date();

  if (filter === "filterToday") {
    filtered = filtered.filter(t => new Date(t.deadline).toDateString() === now.toDateString());
  } else if (filter === "filterWeek") {
    const week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    filtered = filtered.filter(t => { const d = new Date(t.deadline); return d >= now && d <= week; });
  }
  renderTasks(filtered);
}

// ==========================================
// FORMATTING HELPERS
// ==========================================

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h} hour${h > 1 ? "s" : ""}`;
}

function formatDeadline(dateString) {
  const deadline = new Date(dateString);
  const diffDays = Math.ceil((deadline - new Date()) / 86400000);
  if (diffDays < 0)  return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7)  return `${diffDays} days`;
  return deadline.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ==========================================
// PROFILE PAGE
// ==========================================

function initProfile() {
  const user = getSessionUser();
  if (!user) { window.location.href = "login.html"; return; }

  loadUserProfile(user);
  setupProfileTabs();
  setupProfileForms();
}

function loadUserProfile(user) {
  const nameParts = (user.name || "").split(" ");
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  set("firstName",    nameParts[0] || "");
  set("lastName",     nameParts.slice(1).join(" ") || "");
  set("profileEmail", user.email || "");

  const img = document.getElementById("profileImage");
  if (img) img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=150&background=5a8c7b&color=fff`;

  // Compute real stats from stored tasks
  const tasks     = loadTasksFromStorage();
  const completed = tasks.filter(t => t.is_completed);
  const active    = tasks.filter(t => !t.is_completed);
  const rate      = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;

  // Calculate days since account creation (stored on user object)
  const created   = user.createdAt ? new Date(user.createdAt) : new Date();
  const daysActive = Math.max(1, Math.ceil((Date.now() - new Date(created)) / 86400000));

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setText("statCompleted",  completed.length);
  setText("statActive",     active.length);
  setText("statRate",       tasks.length > 0 ? `${rate}%` : "—");
  setText("statDays",       daysActive);
}

function setupProfileTabs() {
  document.querySelectorAll(".list-group-item[data-tab]").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelectorAll(".list-group-item[data-tab]").forEach(l => l.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      const tab = document.getElementById(this.getAttribute("data-tab") + "Tab");
      if (tab) tab.classList.add("active");
    });
  });
}

function setupProfileForms() {
  const profileForm = document.getElementById("profileForm");
  if (profileForm) profileForm.addEventListener("submit", handleProfileUpdate);

  const accountForm = document.getElementById("accountForm");
  if (accountForm) accountForm.addEventListener("submit", handlePasswordChange);
}

function handleProfileUpdate(e) {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value;
  const lastName  = document.getElementById("lastName").value;
  const name      = `${firstName} ${lastName}`.trim();

  const user = getSessionUser();
  if (user) { user.name = name; localStorage.setItem(LS_USER_KEY, JSON.stringify(user)); }

  // Also update the stored users array
  const users = getUsers();
  const idx   = users.findIndex(u => u.id === user?.id);
  if (idx !== -1) { users[idx].name = name; saveUsers(users); }

  showToast("Profile updated successfully!", "success");
}

function handlePasswordChange(e) {
  e.preventDefault();
  const current  = document.getElementById("currentPassword").value;
  const next     = document.getElementById("newPassword").value;
  const confirm  = document.getElementById("confirmNewPassword").value;

  if (!current || !next || !confirm) { showToast("Please fill in all password fields.", "danger"); return; }
  if (next.length < 8) { showToast("New password must be at least 8 characters.", "danger"); return; }
  if (next !== confirm) { showToast("New passwords do not match.", "danger"); return; }

  const user  = getSessionUser();
  const users = getUsers();
  const found = users.find(u => u.id === user?.id);
  if (!found || found.password !== current) { showToast("Current password is incorrect.", "danger"); return; }

  found.password = next;
  saveUsers(users);
  document.getElementById("accountForm").reset();
  showToast("Password updated successfully!", "success");
}

function deleteAccount() {
  if (!confirm("Are you absolutely sure you want to delete your account?\n\nThis cannot be undone.")) return;
  if (prompt('Type "DELETE" to confirm:') !== "DELETE") { showToast("Account deletion cancelled.", "info"); return; }

  const user  = getSessionUser();
  const users = getUsers().filter(u => u.id !== user?.id);
  saveUsers(users);
  localStorage.clear();
  alert("Your account has been deleted.");
  window.location.href = "index.html";
}

function handleLogout(event) {
  event.preventDefault();
  if (confirm("Are you sure you want to logout?")) {
    localStorage.clear();
    window.location.href = "index.html";
  }
}

// ==========================================
// ACTION MENU — single shared dropdown
// ==========================================

let activeMenuTaskId = null;
let activeMenuBtn    = null;

function initActionDropdown() {
  // Create one dropdown and append to body once
  if (document.getElementById("taskActionDropdown")) return;
  const d = document.createElement("div");
  d.id = "taskActionDropdown";
  d.innerHTML = `
    <button class="action-item complete" id="menuComplete">
      <i class="bi bi-check-circle"></i><span>Mark Complete</span>
    </button>
    <button class="action-item view" id="menuView">
      <i class="bi bi-eye"></i> View Details
    </button>
    <button class="action-item edit" id="menuEdit">
      <i class="bi bi-pencil"></i> Edit Task
    </button>
    <div class="action-divider"></div>
    <button class="action-item priority" id="menuPriority">
      <i class="bi bi-flag"></i> Change Priority
    </button>
    <div class="action-divider"></div>
    <button class="action-item delete" id="menuDelete">
      <i class="bi bi-trash"></i> Delete Task
    </button>`;
  document.body.appendChild(d);

  document.getElementById("menuComplete").addEventListener("click", () => {
    closeActionMenu();
    handleToggleTask(activeMenuTaskId);
  });
  document.getElementById("menuView").addEventListener("click", () => {
    closeActionMenu();
    handleViewTask(activeMenuTaskId);
  });
  document.getElementById("menuEdit").addEventListener("click", () => {
    closeActionMenu();
    handleEditTaskOpen(activeMenuTaskId);
  });
  document.getElementById("menuPriority").addEventListener("click", () => {
    closeActionMenu();
    cyclePriority(activeMenuTaskId);
  });
  document.getElementById("menuDelete").addEventListener("click", () => {
    closeActionMenu();
    handleDeleteTask(activeMenuTaskId);
  });

  // Close on outside click
  document.addEventListener("click", function(e) {
    if (!e.target.closest("#taskActionDropdown") && !e.target.closest(".action-menu-btn")) {
      closeActionMenu();
    }
  });

  // Close on scroll
  window.addEventListener("scroll", closeActionMenu, { passive: true });
}

function toggleActionMenu(event, taskId) {
  event.stopPropagation();
  const dropdown = document.getElementById("taskActionDropdown");
  if (!dropdown) return;

  // FIX: event.currentTarget is null with inline onclick — use closest() instead
  const btn = event.target.closest(".action-menu-btn");
  if (!btn) return;

  // If same button clicked again — toggle close
  if (activeMenuTaskId === taskId && dropdown.classList.contains("open")) {
    closeActionMenu();
    return;
  }

  activeMenuTaskId = taskId;

  // Update complete/incomplete label
  const task = sampleTasks.find(t => t.id === taskId);
  const completeBtn = document.getElementById("menuComplete");
  if (completeBtn && task) {
    completeBtn.querySelector("i").className = task.is_completed
      ? "bi bi-arrow-counterclockwise" : "bi bi-check-circle";
    completeBtn.querySelector("span").textContent = task.is_completed
      ? "Mark Incomplete" : "Mark Complete";
  }

  // Swap active button highlight
  if (activeMenuBtn) activeMenuBtn.classList.remove("is-active");
  activeMenuBtn = btn;
  btn.classList.add("is-active");

  // Temporarily show to measure real height, then position
  const rect  = btn.getBoundingClientRect();
  const dropW = 195;

  dropdown.style.visibility = "hidden";
  dropdown.style.top  = "0px";
  dropdown.style.left = "0px";
  dropdown.classList.add("open");

  const dropH      = dropdown.offsetHeight;
  const left       = Math.max(8, Math.min(rect.right - dropW, window.innerWidth - dropW - 8));
  const fitsBelow  = (window.innerHeight - rect.bottom) >= dropH + 10;

  dropdown.style.left       = `${left}px`;
  dropdown.style.top        = fitsBelow ? `${rect.bottom + 6}px` : `${rect.top - dropH - 6}px`;
  dropdown.style.visibility = "";
}

function closeActionMenu() {
  const dropdown = document.getElementById("taskActionDropdown");
  if (dropdown) dropdown.classList.remove("open");
  if (activeMenuBtn) { activeMenuBtn.classList.remove("is-active"); activeMenuBtn = null; }
  activeMenuTaskId = null;
}

function cyclePriority(taskId) {
  const task  = sampleTasks.find(t => t.id === taskId);
  if (!task) return;
  const order = ["low", "medium", "high"];
  const next  = order[(order.indexOf(task.priority) + 1) % order.length];
  updateTask(taskId, { priority: next });
}


function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container position-fixed top-0 end-0 p-3";
    container.style.zIndex = "9999";
    document.body.appendChild(container);
  }

  const toastEl = document.createElement("div");
  toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
  toastEl.setAttribute("role", "alert");
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${message}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>`;

  container.appendChild(toastEl);
  const bsToast = new bootstrap.Toast(toastEl, { autohide: true, delay: 3000 });
  bsToast.show();
  toastEl.addEventListener("hidden.bs.toast", () => toastEl.remove());
}

// ==========================================
// BOOT — runs on every page
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  enforcePageGuards();

  const page = window.location.pathname.split("/").pop();

  if (page === "login.html")    initLogin();
  if (page === "register.html") initRegister();
  if (page === "dashboard.html") initDashboard();
  if (page === "profile.html")   initProfile();
});

// Expose to inline onclick handlers
window.handleToggleTask          = handleToggleTask;
window.handleEditTaskOpen        = handleEditTaskOpen;
window.handleDeleteTask          = handleDeleteTask;
window.togglePassword            = togglePassword;
window.googleLogin               = googleLogin;
window.deleteAccount             = deleteAccount;
window.handleLogout              = handleLogout;
window.toggleActionMenu          = toggleActionMenu;
window.closeActionMenu           = closeActionMenu;
window.cyclePriority             = cyclePriority;
window.handleViewTask            = handleViewTask;
window.handleToggleTaskFromView  = handleToggleTaskFromView;
window.handleEditFromView        = handleEditFromView;
window.handleDeleteFromView      = handleDeleteFromView;
window.handleDeleteFromEdit      = handleDeleteFromEdit;