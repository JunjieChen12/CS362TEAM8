# 1. Software Architecture

## Architecture Pattern: Client-Server
We have selected the **Client-Server** architecture pattern. In this model, the system is divided into two distinct components: the **Client** (Service Requester) and the **Server** (Service Provider).

### Components & Functionality
* **The Client (Browser):**
  * **Functionality:** Acts as the interface for the user. It is responsible for presenting data, accepting user inputs (e.g., clicking "Add Task"), and sending requests to the server.
  * **Data Handling:** It does not store persistent data; it only displays data temporarily received from the server.

* **The Server (Flask Application):**
  * **Functionality:** Listens for requests from clients, executes application logic, and manages data persistence.
  * **Key Sub-Component:** The **Prioritization Engine**, which resides entirely on the server to process task ranking before data is sent to the client.

### Interfaces
* **Request/Response Protocol:** The Client and Server communicate over **HTTP**.
  * **Request:** The Client sends HTTP methods (`GET` to view tasks, `POST` to add tasks).
  * **Response:** The Server responds with HTTP status codes and the requested resources (HTML templates).

### Data Storage
The Server manages a **SQLite database** (`taskwise.db`). The Client never accesses this file directly; it must ask the Server to read/write on its behalf.
* **Schema:** Single `task` table containing `id`, `name`, `deadline`, `duration`, and `is_completed`.

---

## Architectural Decisions & Alternatives

### Decision 1: Network Architecture
* **Our Choice:** **Client-Server Pattern**
  * **Description:** A centralized server that hosts the database and logic, serving resources to clients upon request.
* **Alternative:** **Peer-to-Peer (P2P) Pattern**
  * **Description:** A decentralized network where every user’s computer acts as both a client and a server, sharing data directly with others without a central hub.
* **Pros of Alternative:** High fault tolerance. Since there is no central server, if one node fails, the network survives. It also reduces infrastructure costs for the provider.
* **Cons of Alternative:** Extremely high complexity in **Data Consistency**. Ensuring that every peer has the exact same version of the task list requires complex synchronization algorithms.
* **Why we chose Client-Server:** We need a centralized database to ensure data integrity. The Client-Server model guarantees that the user sees the same tasks regardless of which device or browser tab they open, which is critical for a reliable task manager.

### Decision 2: System Structure
* **Our Choice:** **Layered Pattern**
  * **Description:** The entire application is structured into horizontal logical layers (Presentation, Application, and Data). Data must flow sequentially through these layers—requests enter at the top (Presentation), pass through logic (Application), reach the bottom (Data), and bubble back up.
* **Alternative:** **Event-Driven Architecture**
  * **Description:** An architecture where the whole system is composed of independent components that do not talk to each other directly. Instead, they publish messages ("Events") to a central "Bus," and other components react to them asynchronously.
* **Pros of Alternative:** Highly decoupled and scalable. If you add a new feature, it simply listens to the bus without changing the existing code.
* **Cons of Alternative:** High architectural complexity for the whole system. It makes the application **non-deterministic** (hard to predict the order of operations) and difficult to test, as you cannot easily trace a request from start to finish.
* **Why we chose Layered:** We require a predictable, synchronous flow for our application. When a user clicks "Save Task," the system must sequentially validate the input, write to the database, and confirm success. The Layered architecture guarantees this linear "Request-Response" cycle.

# 2. Software Design

This section defines the implementation details of the components identified in the architecture.


### 1. The Client Component
* **Units of Abstraction:** HTML Templates (`templates/index.html`), CSS (`static/styles.css`), and JavaScript (`static/index.js`).
* **Responsibilities:**
  * **Rendering:** Visualizes the sorted list of tasks received from the server.
  * **Input Capture:** Provides HTML Forms for users to input task details (Name, Deadline).
  * **Validation:** Performs basic client-side checks (e.g., ensuring "Task Name" is not empty) to reduce unnecessary server load.

### 2. The Server Component
* **Units of Abstraction:** The `Flask` Application Object and `SQLAlchemy` Database Model.
* **Responsibilities:**
  * **Route Handler (`app.py`):** The entry point that parses HTTP requests and decides which function to run.
  * **Data Manager (`Task` Class):** Translates Python objects into SQL commands.

### 3. The Prioritization Component (The "AI")
* **File:** `recommendation.py`
* **Type:** Rule-Based Heuristic Engine.
* **Responsibilities:**
  * Encapsulates the sorting logic to keep the main application code clean ("Separation of Concerns").
  * **Function:** `recommend_tasks(task_list)`
* **Algorithm Design:**
  * The component calculates a **Priority Index (PI)** for each task using a weighted formula:
  * $$PI = (W_1 \times \text{HoursUntilDeadline}) + (W_2 \times \text{EstimatedDuration})$$
  * Tasks are returned sorted by this index in **ascending order** (Lower Score = Higher Priority).
  * *Note:* $W_1$ and $W_2$ are tunable constants (weights) that determine how much the system values "urgency" vs "effort."

# 3. Coding Guidelines

We will enforce strict coding standards to ensure readability and reduce merge conflicts across our team.

### 1. Python (Backend & AI)
* **Guideline:** **PEP 8 (The Style Guide for Python Code)**
* **Link:** [PEP 8 Documentation](https://peps.python.org/pep-0008/)
* **Why we chose it:** PEP 8 is the official style guide for the Python language. It ensures consistent indentation (4 spaces), variable naming (`snake_case`), and import structure. Since we are using Flask, following PEP 8 ensures our code looks standard to any external Python developer.
* **Enforcement:** We will review the code ourselves and request a PR for someone on the team to review.

### 2. JavaScript (Frontend Logic)
* **Guideline:** **W3Schools JavaScript Coding Conventions**
* **Link:** [W3Schools JS Conventions](https://www.w3schools.com/js/js_conventions.asp)
* **Why we chose it:** This guide provides a clear, simplified set of rules focused on code readability and maintenance.
* **Enforcement:** Following the guidelines and submitting PR's or reviews before further changes.

### 3. HTML & CSS (UI)
* **Guideline:** **Code Guide by Mark Otto** (Creator of Bootstrap)
* **Link:** [Code Guide](https://codeguide.co/)
* **Why we chose it:** Since our project relies heavily on the **Bootstrap 5** framework, following the guidelines written by its creator ensures that our custom HTML/CSS integrates cleanly with the library without causing layout breakages.
* **Enforcement:** Enforcement will be handled via PR on GitHub.

# 4. Process Description

## i. Risk Assessment

| Risk | Likelihood | Impact | Evidence & Mitigation Plan |
| :--- | :--- | :--- | :--- |
| **1. Algorithm Subjectivity** | Medium | Medium | **Evidence:** We switched from Machine Learning to a Heuristic formula (`Score = Deadline + Duration`). It would take too long for the AI to learn.<br>**Mitigation:** We added tunable weights (`W1`, `W2`) in `recommendation.py`. If the default sort is unpopular, we will add a simple "Sort by Date" toggle to override the AI.<br>**Change:** Changed from "ML Model Accuracy" to "Heuristic Tuning." |
| **2. Merge Conflicts** | High | High | **Evidence:** We are a team of 4 working on a centralized Flask `app.py`.<br>**Mitigation:** We split code into modules (`recommendation.py`, `models.py`) to reduce overlap. Everyone works on a branch and submits a PR for review before merging. |
| **3. Frontend/Backend Connection Failure** | Medium | High | **Evidence:** If Frontend sends "Title" but Backend expects "Name," the app will break.<br>**Mitigation:** We wrote down a list of exact variable names (like `task_id`, `deadline`) that everyone must use. We will manually test every button to ensure data persistence. |
| **4. Software Conflicts** | High | High | **Evidence:** Team uses different OS (Windows vs. Mac). Code works on one laptop but not another.<br>**Mitigation:** We use `requirements.txt` to lock library versions. If errors persist, we will help the member reset their `venv` to match the working setup. |
| **5. Users Entering Bad Data** | High | Medium | **Evidence:** If a user types "Tomorrow" into a date field, the logic crashes.<br>**Mitigation:** We are adding `<input type="date">` validation in HTML and writing Python backend checks to handle errors gracefully. |

## ii. Project Schedule

| Week | Tasks | Dependencies | Effort |
| :--- | :--- | :--- | :--- |
| **Week 5** | 1. Implement `DELETE` and `COMPLETE` routes (Weiqian, Junjie).<br>2. Write `recommendation.py` sorting logic (Meiqi, Junjie). | Architecture Skeleton must be stable. | 30 hrs (Team) |
| **Week 6** | 1. Style Task Cards with Bootstrap (Thao).<br>2. Connect "Add Task" Modal to Backend (Thao, Junjie).<br>3. Connect "Sort" button to API (Meiqi). | Backend Core routes must be working. | 30 hrs (Team) |
| **Week 7** | 1. Merge Frontend and Backend branches.<br>2. Conduct full manual "Bug Bash."<br>3. Fix critical bugs found in testing. | Frontend and Backend components complete. | 30 hrs (Team) |
| **Week 8** | 1. Write User Guide.<br>2. Finalize Code Comments.<br>3. Record Demo Video. | Working version. | 20 hrs (Team) |
| **Week 9** | 1. Final Polish & Submission.<br>2. Presentation Preparation. | Documentation complete. | 15 hrs (Team) |

## iii. Team Structure

* **Junjie Chen (Fullstack Developer):**
  * Responsible for making backend and frontend integration.
* **Meiqi Ma (Backend Developer):**
  * Responsible for designing the "AI" Logic (`recommendation.py`).
* **Thao Nguyen (Frontend Developer):**
  * Responsible for the User Interface (HTML/CSS/JS).
* **Weiqian Xu (Backend Developer):**
  * Responsible for implementing API Routes (`app.py`).

## iv. Test Plan & Bugs

### Testing Strategy
* **Unit Testing (Automated):**
  * **Scope:** Sorting Algorithm and Database constraints.
  * **Strategy:** Write a test script `test_logic.py` using Python `unittest`. We will feed dummy tasks into `recommend_tasks()` to verify the sorting order is correct.
* **System/Integration Testing (Manual):**
  * **Scope:** The full "User Flow" (Create $\to$ Sort $\to$ Complete).
  * **Strategy:** Perform weekly "Cross-Checks." The Frontend tests Backend routes, and the Backend tests the UI to avoid bias.
* **Usability Testing:**
  * **Scope:** User Experience (UX).
  * **Strategy:** Recruit 2 students outside the group to perform a specific task (e.g., "Add a homework assignment due Friday") without instructions to see if the interface is intuitive.

### Bug Tracking
* **Tool:** GitHub Issues.
* **Process:** Any defect found is logged as an Issue with the tag `bug`.
* **Assignment:** A team member assigns the issue to the relevant developer.
* **Resolution:** Issues are closed when a specific Pull Request fixing them is merged.

## v. Documentation Plan

### 1. Developer README.md
* **Audience:** Future developers and TAs.
* **Content:** Instructions on setting up the `venv` (Virtual Environment), installing `requirements.txt`, initializing the database, and running the server.

### 2. User Guide (Wiki)
* **Audience:** End users.
* **Content:** A "How-To" page with screenshots explaining how to Add a Task, how to read the "Priority Score," and how to mark tasks as complete.