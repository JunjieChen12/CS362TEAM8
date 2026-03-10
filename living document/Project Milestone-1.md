# Taskwise - Personal Task Manager with AI recommendations

**Team Members:**
* **Junjie Chen** - [Fullstack Developer]
* **Meiqi Ma** - [Backend/AI Logic]
* **Thao Nguyen** - [Frontend Developer]
* **Weiqian Xu** - [Backend/Database]

---

## 1. Team Info

### Project Artifacts
* **GitHub Repository:** https://github.com/JunjieChen12/CS362TEAM8

### Communication Plan
* **Primary Channel:** Discord
* **Communication Rules:**
    * Daily checks of the primary channel.
    * Response time expectation: Within 24 hours.
* **Meetings:**
    * Weekly meetings either in person or on discord. Time [TBD]/ upon availability

---

## 2. Product Description

### Abstract
Taskwise is a mobile productivity application designed to solve decision fatigue by intelligently automating task prioritization. Unlike standard to-do lists that merely store tasks, Taskwise uses a machine learning algorithm to analyze task urgency, user-defined time constraints, and historical completion data to recommend the optimal task to tackle next. This ensures users focus on execution rather than planning, maximizing productivity during their available time windows.

### Goal
Our goal is to reduce the friction between "listing a task" and "doing a task." We aim to help students and professionals who struggle with time management by providing a system that answers the question, "What should I do right now?" based on data rather than intuition.

### Current Practice
Currently, most people use static to-do lists (like Apple Notes, Todoist, or physical paper) or rigid calendar blocking.
* **The Limit:** Static lists require manual sorting and don't account for user energy or actual task duration (vs. estimated duration). Calendar blocking is too rigid; if one task runs over, the whole schedule breaks.

### Novelty
Our approach differs by introducing a dynamic **Recommendation Engine**. Instead of just listing tasks A, B, and C, our app analyzes:
1.  **Historical Behavior:** "The user usually takes 45 minutes for math homework, not the estimated 20."
2.  **Context:** "The user only has 30 minutes free right now."
We are not reinventing the task list; we are adding an intelligence layer on top of it to automate the decision-making process.

### Effects
If successful, users will spend less time organizing their day and more time completing work. It will reduce the anxiety of a cluttered backlog and provide realistic feedback on how long tasks actually take, improving the user's future time-management skills.

### Technical Approach
We will develop Taskwise as a **Responsive Web Application** optimized for mobile browsers. This allows us to leverage our team's existing web development experience while utilizing Python's powerful AI capabilities.
* **Frontend (User Interface):**
    * **HTML5, CSS3, JavaScript:** We will create a mobile-responsive interface. This ensures the app is accessible on any device (phone, laptop, tablet) without needing platform-specific code.
    * **Framework:** Bootstrap or Tailwind CSS for rapid styling.
* **Backend (Server & Logic):**
    * **Python (Flask):** We will use Flask to handle API requests and server-side logic. Flask was chosen for its lightweight nature and seamless integration with Python AI libraries.
* **Database (Storage):**
    * **SQLite:** We will use SQLite for local data persistence. It requires zero configuration and integrates natively with Python, making it ideal for rapid prototyping and local testing.
* **AI/ML Strategy:**
    * **Scikit-Learn:** We will implement a Decision Tree or Random Forest classifier in Python. The model will take task attributes (deadline, duration) as inputs and output a "priority score," training itself on the user's completion history stored in SQLite.

### Risks
* **The "Cold Start" Risk:** The AI needs historical data to make good recommendations. At the start, the app might feel like a generic to-do list because it hasn't learned the user's behavior yet.
* **Mitigation:** We will implement a "manual override" feature that allows the user to correct the AI. We will also include a detailed "onboarding" questionnaire to seed the database with initial user preferences so the AI works reasonably well from Day 1.

---

## 3. Major Features (MVP)
These features constitute our Minimum Viable Product:

1.  **Smart Task Entry:** Users can create tasks with attributes (Name, Deadline, Estimated Duration, Category/Tag).
2.  **The "Focus Now" Button:** A central feature that triggers the algorithm to display the single most important task the user should do *right now* based on their current time window.
3.  **Task Timer & Data Collection:** A built-in timer to track actual time spent vs. estimated time. This data is saved to train the recommendation model.
4.  **Task Repository (CRUD):** A standard view to see all active, completed, and pending tasks, allowing for manual editing and deletion.

---

## 4. Stretch Goals
If we complete the MVP ahead of schedule, we plan to implement:

1.  **Calendar Integration:** Syncing with Google Calendar to automatically identify "Free Time" blocks rather than asking the user to input available time.
2.  **Mood/Energy Based Recommendations:** Adding a prompt asking "How are you feeling?" (High Energy vs. Low Energy) to recommend heavy tasks vs. light administrative tasks.

---

## 5. Test-Automation Infrastructure

- **Infrastructure Chosen:** Python unittest framework.

- **Justification:**  
We chose unittest because it is built natively into the Python standard library, meaning it requires no additional external installations. It integrates seamlessly with our Flask application context and uses an xUnit-style architecture (setUp and tearDown methods) that makes it easy to isolate our SQLite database tests.

- **How to add a new test:**

1. Navigate to the `tests/` directory in our repository.  
2. Open the test file (`test_app.py`).  
3. Create a class that inherits from `unittest.TestCase`.  
4. Define a new method starting with the word `test_`.  
5. Run the suite locally using: `python -m unittest discover tests`.

---
	
## 6. Continuous Integration (CI) Service

- **Service Chosen:** GitHub Actions

GitHub Actions is deeply integrated directly into our code hosting platform. This eliminates the need for external webhooks or third-party accounts. Because it is built directly into GitHub, our team can easily view workflow results and test outputs directly within the repository interface.

GitHub Actions also allows us to automatically block pull requests if tests fail. This ensures that our **main branch remains stable** as all four team members contribute code throughout the development process.

---

## 7. CI Service Comparison

### GitHub Actions (Our Choice)

- **Setup Difficulty:** Low. It requires only a single YAML configuration file stored directly within our repository.
- **Platform Integration:** Native. It is built directly into the GitHub Pull Request interface, meaning we do not have to leave our codebase to view CI results.
- **Cost:** Free. It has a generous free tier for public and student repositories.

**Pros**
- Zero context-switching
- Native pull request blocking
- Easy setup for Python environment testing

**Cons**
- YAML syntax errors can sometimes be frustrating and difficult to debug.

---

### Jenkins

- **Setup Difficulty:** High. It requires hosting, configuring, and maintaining a dedicated external server.
- **Platform Integration:** Plugin-based. Jenkins requires extensive plugin management and webhooks to communicate with GitHub.
- **Cost:** The software itself is free, but we would need to pay out-of-pocket for server hosting.

**Pros**
- Extremely customizable
- Industry standard for large enterprise applications

**Cons**
- Too complex and maintenance-intensive for a short 9-week student project.

---

### Travis CI

- **Setup Difficulty:** Medium. It requires linking a third-party account and configuring external webhooks.
- **Platform Integration:** External. Test results and logs are hosted on a separate Travis CI dashboard.
- **Cost:** Limited. The free tier has become highly restrictive for new open-source projects.

**Pros**
- Historically popular in the open-source community
- Simple configuration syntax

**Cons**
- Increasing restrictions on free-tier usage
- Requires managing an additional external account and dashboard

---

## 8. CI Build Configuration

- **Triggers:**  
  The automated CI build runs under two specific development actions:

  - Any **push** made directly to the `main` branch.
  - Any **pull request** opened against the `main` branch.

- **Tests Executed:**  
  Each time a build is triggered, the CI pipeline launches a fresh Ubuntu environment, installs the required Python dependencies (including Flask), and runs the full **unittest** test suite.

  The automated tests currently verify:

  - **Dashboard Load Test:** Ensures the main dashboard page loads successfully and returns an HTTP 200 response.
  - **Task Creation Test:** Verifies that submitting a task through the `POST /add` endpoint correctly stores the task in the SQLite database.
  - **Task Completion Test:** Confirms that accessing the `GET /toggle/<id>` endpoint correctly updates the completion state of a task in the database.

---

## 9. Software Architecture

### Architecture Pattern: Client-Server
We have selected the **Client-Server** architecture pattern. In this model, the system is divided into two distinct components: the **Client** (Service Requester) and the **Server** (Service Provider).

#### Components & Functionality
* **The Client (Browser):**
  * **Functionality:** Acts as the interface for the user. It is responsible for presenting data, accepting user inputs (e.g., clicking "Add Task"), and sending requests to the server.
  * **Data Handling:** It does not store persistent data; it only displays data temporarily received from the server.

* **The Server (Flask Application):**
  * **Functionality:** Listens for requests from clients, executes application logic, and manages data persistence.
  * **Key Sub-Component:** The **Prioritization Engine**, which resides entirely on the server to process task ranking before data is sent to the client.

#### Interfaces
* **Request/Response Protocol:** The Client and Server communicate over **HTTP**.
  * **Request:** The Client sends HTTP methods (`GET` to view tasks, `POST` to add tasks).
  * **Response:** The Server responds with HTTP status codes and the requested resources (HTML templates).

#### Data Storage
The Server manages a **SQLite database** (`taskwise.db`). The Client never accesses this file directly; it must ask the Server to read/write on its behalf.
* **Schema:** Single `task` table containing `id`, `name`, `deadline`, `duration`, and `is_completed`.

---

### Architectural Decisions & Alternatives

#### Decision 1: Network Architecture
* **Our Choice:** **Client-Server Pattern**
  * **Description:** A centralized server that hosts the database and logic, serving resources to clients upon request.
* **Alternative:** **Peer-to-Peer (P2P) Pattern**
  * **Description:** A decentralized network where every user’s computer acts as both a client and a server, sharing data directly with others without a central hub.
* **Pros of Alternative:** High fault tolerance. Since there is no central server, if one node fails, the network survives. It also reduces infrastructure costs for the provider.
* **Cons of Alternative:** Extremely high complexity in **Data Consistency**. Ensuring that every peer has the exact same version of the task list requires complex synchronization algorithms.
* **Why we chose Client-Server:** We need a centralized database to ensure data integrity. The Client-Server model guarantees that the user sees the same tasks regardless of which device or browser tab they open, which is critical for a reliable task manager.

#### Decision 2: System Structure
* **Our Choice:** **Layered Pattern**
  * **Description:** The entire application is structured into horizontal logical layers (Presentation, Application, and Data). Data must flow sequentially through these layers—requests enter at the top (Presentation), pass through logic (Application), reach the bottom (Data), and bubble back up.
* **Alternative:** **Event-Driven Architecture**
  * **Description:** An architecture where the whole system is composed of independent components that do not talk to each other directly. Instead, they publish messages ("Events") to a central "Bus," and other components react to them asynchronously.
* **Pros of Alternative:** Highly decoupled and scalable. If you add a new feature, it simply listens to the bus without changing the existing code.
* **Cons of Alternative:** High architectural complexity for the whole system. It makes the application **non-deterministic** (hard to predict the order of operations) and difficult to test, as you cannot easily trace a request from start to finish.
* **Why we chose Layered:** We require a predictable, synchronous flow for our application. When a user clicks "Save Task," the system must sequentially validate the input, write to the database, and confirm success. The Layered architecture guarantees this linear "Request-Response" cycle.

## 10. Software Design

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

## 11. Coding Guidelines

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

## 12. Revised Use-Cases and Requirements

This section revises our original use cases and requirements based on feedback received during the previous milestone. We clarified user interactions, added missing task flows (such as editing tasks and executing tasks with a timer), and refined the system requirements to better align with the final architecture and design of the application.

---

### Use Case 1 (Junjie Chen – Fullstack): Create a New Task

**Actors**
- User

**Trigger**
- User clicks the **“Add Task”** floating action button.

**Preconditions**
- The application is running.
- The SQLite database is accessible.

**Postconditions (Success)**
- A new task record is inserted into the SQLite database.
- The UI updates to show the task in the **Pending Tasks** list.

**Success Scenario**

1. User clicks the **“+”** button.
2. System displays the **New Task modal form**.
3. User enters *"Finish Math HW"*, sets duration to **45 minutes**, and sets the deadline to **Tomorrow**.
4. User clicks **Save**.
5. System validates the input (checking required fields and valid duration values).
6. System saves the task to the database with a unique ID.
7. System closes the modal and refreshes the task list.

**Extensions / Variations**

- **3a.** User leaves the deadline blank → System defaults the value to **"No Deadline."**

**Exceptions**

- **5a.** Validation fails (e.g., negative duration) → System highlights the error field in red and displays the message  
  **"Duration must be positive."** The database is not modified.

---

### Use Case 2 (Meiqi Ma – Backend/AI): Generate “Focus Now” Recommendation

**Actors**
- User
- Recommendation Algorithm (System)

**Trigger**
- User clicks the **“Focus Now”** button on the dashboard.

**Preconditions**
- The user has at least **two pending tasks** stored in the database.

**Postconditions (Success)**
- The system displays a **Recommended Task modal** showing the highest priority task.

**List of Steps (Success Scenario):**
1. User clicks “Focus Now”.  
2. System queries the database for all incomplete tasks.  
3. System calculates a priority score for each task  
   - `Score = Weight / TimeRemaining + HistoryFactor`  
4. System sorts the tasks by score.  
5. System presents the top-ranked task to the user.

**Extensions / Variations:**  
- 2a. If no tasks exist → System displays *“You’re all caught up! Add a task to start.”*

**Exceptions:**  
- 3a. Database read error → System displays *“Could not retrieve tasks. Please restart the app.”*

---

### Use Case 3 (Thao Nguyen – Frontend): Execute Task with Timer

**Actors:**  
- User

**Triggers:**  
- User clicks the **“Start”** button on a task card.

**Preconditions:**  
- The task exists.  
- The task is not currently running.

**Postconditions (Success):**  
- Timer counts down to zero.  
- Task status updates to **Completed**.  
- Actual duration is saved.

**List of Steps (Success Scenario):**
1. User clicks “Start” on “Read Chapter 4”.  
2. System enters **Focus Mode** and starts a countdown timer.  
3. User finishes work and clicks “Complete”.  
4. System stops the timer.  
5. System updates task status to **COMPLETED**.  
6. System records elapsed time (e.g., 30 mins) into the history table for future AI training.

**Extensions / Variations:**  
- 3a. User clicks “Pause” → Timer halts until “Resume” is clicked.

**Exceptions:**  
- 4a. Browser tab closes → System saves timestamp in `localStorage` to resume timer on reopening.

---

### Use Case 4 (Weiqian Xu – Backend/DB): Edit Task Details

**Actors:**  
- User

**Triggers:**  
- User clicks the **Edit (pencil)** icon on a task.

**Preconditions:**  
- The task exists in the database.

**Postconditions (Success):**  
- Task attributes are updated in the database.

**List of Steps (Success Scenario):**
1. User clicks “Edit” on a task.  
2. System pre-fills the form with current task data.  
3. User changes deadline from “Tuesday” to “Friday”.  
4. User clicks “Update”.  
5. System sends a PUT request to the API.  
6. System updates the database record.  
7. System re-renders the list with the updated deadline.

**Extensions / Variations:**  
- 4a. User clicks “Cancel” → No database changes occur.

**Exceptions:**  
- 6a. Task ID not found → System returns **404 Error** and removes the task from the UI.

---

### Functional Requirements

- The system shall allow users to **create new tasks** with a name, deadline, and estimated duration.
- The system shall **store task data** in a SQLite database.
- The system shall **generate prioritized task recommendations** using a heuristic prioritization algorithm.
- The system shall allow users to **start, pause, resume, and complete tasks** with a built-in timer.
- The system shall allow users to **edit existing tasks**.

---

### Non-Functional Requirements

**Performance**

- The system should respond to user interactions within **500 milliseconds** under normal conditions.

**Reliability**

- The system must maintain consistent task data and prevent data loss during unexpected failures.

**Usability**

- The application should provide an intuitive and accessible interface suitable for users with varying levels of technical experience.

---

### External Requirements

- The system shall be robust against **invalid user input** and **database failures**.
- The application shall be deployed as a **web-based service with a local URL**.
- The system shall be **buildable from source** with clear documentation.
- The project scope must remain achievable within the **team’s resources and course timeline**.

---

## 13. Process Description

### i. Risk Assessment

| Risk | Likelihood | Impact | Evidence & Mitigation Plan |
| :--- | :--- | :--- | :--- |
| **1. Algorithm Subjectivity** | Medium | Medium | **Evidence:** We switched from Machine Learning to a Heuristic formula (`Score = Deadline + Duration`). It would take too long for the AI to learn.<br>**Mitigation:** We added tunable weights (`W1`, `W2`) in `recommendation.py`. If the default sort is unpopular, we will add a simple "Sort by Date" toggle to override the AI.<br>**Change:** Changed from "ML Model Accuracy" to "Heuristic Tuning." |
| **2. Merge Conflicts** | High | High | **Evidence:** We are a team of 4 working on a centralized Flask `app.py`.<br>**Mitigation:** We split code into modules (`recommendation.py`, `models.py`) to reduce overlap. Everyone works on a branch and submits a PR for review before merging. |
| **3. Frontend/Backend Connection Failure** | Medium | High | **Evidence:** If Frontend sends "Title" but Backend expects "Name," the app will break.<br>**Mitigation:** We wrote down a list of exact variable names (like `task_id`, `deadline`) that everyone must use. We will manually test every button to ensure data persistence. |
| **4. Software Conflicts** | High | High | **Evidence:** Team uses different OS (Windows vs. Mac). Code works on one laptop but not another.<br>**Mitigation:** We use `requirements.txt` to lock library versions. If errors persist, we will help the member reset their `venv` to match the working setup. |
| **5. Users Entering Bad Data** | High | Medium | **Evidence:** If a user types "Tomorrow" into a date field, the logic crashes.<br>**Mitigation:** We are adding `<input type="date">` validation in HTML and writing Python backend checks to handle errors gracefully. |

### ii. Project Schedule

| Week | Tasks | Dependencies | Effort |
| :--- | :--- | :--- | :--- |
| **Week 5** | 1. Implement `DELETE` and `COMPLETE` routes (Weiqian, Junjie).<br>2. Write `recommendation.py` sorting logic (Meiqi, Junjie). | Architecture Skeleton must be stable. | 30 hrs (Team) |
| **Week 6** | 1. Style Task Cards with Bootstrap (Thao).<br>2. Connect "Add Task" Modal to Backend (Thao, Junjie).<br>3. Connect "Sort" button to API (Meiqi). | Backend Core routes must be working. | 30 hrs (Team) |
| **Week 7** | 1. Merge Frontend and Backend branches.<br>2. Conduct full manual "Bug Bash."<br>3. Fix critical bugs found in testing. | Frontend and Backend components complete. | 30 hrs (Team) |
| **Week 8** | 1. Write User Guide.<br>2. Finalize Code Comments.<br>3. Record Demo Video. | Working version. | 20 hrs (Team) |
| **Week 9** | 1. Final Polish & Submission.<br>2. Presentation Preparation. | Documentation complete. | 15 hrs (Team) |

### iii. Team Structure

* **Junjie Chen (Fullstack Developer):**
  * Responsible for making backend and frontend integration.
* **Meiqi Ma (Backend Developer):**
  * Responsible for designing the "AI" Logic (`recommendation.py`).
* **Thao Nguyen (Frontend Developer):**
  * Responsible for the User Interface (HTML/CSS/JS).
* **Weiqian Xu (Backend Developer):**
  * Responsible for implementing API Routes (`app.py`).

### iv. Test Plan & Bugs

#### Testing Strategy
* **Unit Testing (Automated):**
  * **Scope:** Sorting Algorithm and Database constraints.
  * **Strategy:** Write a test script `test_logic.py` using Python `unittest`. We will feed dummy tasks into `recommend_tasks()` to verify the sorting order is correct.
* **System/Integration Testing (Manual):**
  * **Scope:** The full "User Flow" (Create $\to$ Sort $\to$ Complete).
  * **Strategy:** Perform weekly "Cross-Checks." The Frontend tests Backend routes, and the Backend tests the UI to avoid bias.
* **Usability Testing:**
  * **Scope:** User Experience (UX).
  * **Strategy:** Recruit 2 students outside the group to perform a specific task (e.g., "Add a homework assignment due Friday") without instructions to see if the interface is intuitive.

#### Bug Tracking
* **Tool:** GitHub Issues.
* **Process:** Any defect found is logged as an Issue with the tag `bug`.
* **Assignment:** A team member assigns the issue to the relevant developer.
* **Resolution:** Issues are closed when a specific Pull Request fixing them is merged.

### v. Documentation Plan

#### 1. Developer README.md
* **Audience:** Future developers and TAs.
* **Content:** Instructions on setting up the `venv` (Virtual Environment), installing `requirements.txt`, initializing the database, and running the server.

#### 2. User Guide (Wiki)
* **Audience:** End users.
* **Content:** A "How-To" page with screenshots explaining how to Add a Task, how to read the "Priority Score," and how to mark tasks as complete.

## 14. Reflections

### Junjie Chen (Fullstack Developer)

One of the biggest lessons I learned from this project was the importance of integration testing. Even when the frontend and backend each seemed correct on their own, bugs still appeared when routes, forms, and database actions were connected together. Testing complete workflows, such as creating, editing, and completing tasks, showed me that verification must happen at the system level and not only at the individual component level.

Another lesson I learned was the value of automated testing during development. Using Flask’s test client and an in-memory SQLite database made it possible to repeatedly test important routes without affecting the real application data. This helped us verify behavior faster and gave us more confidence when making changes. It also showed me how automated tests support maintenance by making regression bugs easier to catch.

A third lesson was about debugging and maintainability. When tests failed, they gave us a much clearer starting point for debugging than manual trial-and-error alone. I learned that well-structured tests are not only useful for grading or final validation, but also for helping developers understand where the system breaks and why. If I were doing this project again, I would write more tests earlier instead of waiting until later stages of development.

---

### Meiqi Ma (Backend / AI Logic)

One important lesson I learned was that logic must be testable to be trustworthy. The recommendation feature may look simple from the outside, but the real challenge is verifying that its behavior is correct under different task conditions. This project taught me that backend logic should be designed in a way that makes it easy to test with multiple inputs and expected outputs.

Another lesson was the importance of verification and validation. Verification means checking that the feature was implemented correctly, while validation means checking that it actually does what users need. For the recommendation logic, this meant not only making sure the code ran without errors, but also making sure the returned task ordering made sense. This helped me understand the difference between code that works technically and code that works correctly from the user’s perspective.

A third lesson was learning how simpler designs often improve software quality. We considered more advanced recommendation approaches, but a heuristic-based solution was easier to test, debug, and maintain within the scope of the course. I learned that choosing a solution that can be verified reliably is often better than choosing one that is more complex but harder to validate.

---

### Thao Nguyen (Frontend Developer)

One major lesson I learned from this project was that testing user-facing behavior still depends heavily on backend correctness. Even though the interface is what users see, many visible problems actually come from route failures, incorrect data handling, or inconsistent state changes in the backend. This project helped me understand how frontend behavior and backend verification are closely connected.

Another lesson involved use-case-based testing. Instead of only checking isolated pieces of the UI, it was more valuable to think in terms of user actions such as adding a task, editing it, or marking it complete. Looking at the project through use cases made the testing process more realistic and aligned better with how the software would actually be used.

A third lesson I learned was the importance of clear communication in team testing. When multiple developers are working on different parts of the same system, testing becomes harder if the team does not agree on field names, routes, and expected outputs. I learned that good communication reduces defects and makes debugging much faster. If I were doing this again, I would push for even earlier agreement on API behavior and testing responsibilities.

---

### Weiqian Xu (Backend / Database)

One of the most important lessons I learned was the value of testing database-related behavior in isolation. By using an in-memory SQLite database during tests, we could verify create, update, delete, and query behavior without risking real data. This made our tests faster, safer, and easier to repeat. It also showed me how test environments can improve software reliability.

Another lesson was about regression prevention. Once routes such as `/add`, `/edit`, `/delete`, and `/toggle` were working, tests helped us make sure that later changes did not accidentally break them. This connected directly to the course focus on maintenance, because maintaining software is not only about adding features but also about preserving correct behavior over time.

A third lesson was learning the importance of developer documentation and reproducibility. A test suite is only useful if another developer can understand how to run it and what it is verifying. Through this project, I learned that release notes, test instructions, and issue tracking are all part of software quality. If I could improve one thing, I would document our test setup and expected results more thoroughly as we developed the system rather than mainly at the end.

---



