const TASKS_KEY = "taskwise_tasks_dashboard";

// ==========================================
// TASK PERSISTENCE
// ==========================================

function loadTasksFromStorage() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasksToStorage() {
  localStorage.setItem(TASKS_KEY, JSON.stringify(sampleTasks));
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

}

// ==========================================
// DASHBOARD — DATE HELPERS
// ==========================================

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
  initDashboard();
});

// Expose to inline onclick handlers
window.handleToggleTask          = handleToggleTask;
window.handleEditTaskOpen        = handleEditTaskOpen;
window.handleDeleteTask          = handleDeleteTask;
window.toggleActionMenu          = toggleActionMenu;
window.closeActionMenu           = closeActionMenu;
window.cyclePriority             = cyclePriority;
window.handleViewTask            = handleViewTask;
window.handleToggleTaskFromView  = handleToggleTaskFromView;
window.handleEditFromView        = handleEditFromView;
window.handleDeleteFromView      = handleDeleteFromView;
window.handleDeleteFromEdit      = handleDeleteFromEdit;