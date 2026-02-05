# Project Milestone 2 – Project Requirements Elicitation

---

## Use Cases

### Use Case 1 (Junjie Chen – Fullstack): Create a New Task

**Actors:**  
- User

**Triggers:**  
- User clicks the **“Add Task”** floating action button.

**Preconditions:**  
- The application is running.  
- The database is accessible.

**Postconditions (Success):**  
- A new task record is inserted into the SQLite database.  
- The UI updates to show the task in the **Pending** list.

**List of Steps (Success Scenario):**
1. User clicks the “+” button.  
2. System displays the “New Task” modal form.  
3. User enters “Finish Math HW”, sets duration to “45 mins”, and deadline to “Tomorrow”.  
4. User clicks “Save”.  
5. System validates the input (checking for non-empty fields).  
6. System saves the task to the database with a unique ID.  
7. System closes the modal and refreshes the task list.

**Extensions / Variations:**  
- 3a. User leaves the deadline blank → System defaults to **“No Deadline.”**

**Exceptions:**  
- 5a. Validation fails (e.g., negative duration) → System highlights the error field in red and displays *“Duration must be positive.”* Database is not modified.

---

### Use Case 2 (Meiqi Ma – Backend/AI): Generate “Focus Now” Recommendation

**Actors:**  
- User  
- Recommendation Algorithm (System)

**Triggers:**  
- User clicks the **“Focus Now”** button on the dashboard.

**Preconditions:**  
- The user has at least two pending tasks in the database.

**Postconditions (Success):**  
- The system displays a single **Recommended Task** modal based on the highest calculated priority score.

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

## Non-Functional Requirements

- **Performance:** System responds to user interactions within **500 ms** under normal conditions.  
- **Reliability:** System prevents data loss and maintains consistent task state during errors.  
- **Usability:** Application is intuitive and accessible to users with varying abilities.

---

## External Requirements

- The system shall be robust against invalid input and database failures.  
- The application shall be deployed as a **web-based service** with a public URL.  
- The system shall be buildable from source with clear documentation.  
- The project scope shall match the team’s resources and course timeline.

---

## Team Process Descriptions

### Software Toolset
- GitHub (version control, collaboration, issue tracking)  
- HTML5, CSS3, JavaScript (Bootstrap / Tailwind)  
- Python (Flask) for backend APIs  
- SQLite for data persistence  
- Scikit-learn (Decision Tree or Random Forest) for task prioritization

---

### Team Roles
- **Junjie Chen:** Frontend–backend integration and APIs  
- **Meiqi Ma:** Task recommendation algorithm (AI)  
- **Thao Nguyen:** UI, responsiveness, and timer functionality  
- **Weiqian Xu:** Database schema and CRUD APIs  

*Roles are assigned based on technical strengths and support modular development.*

---

### Timeline
- **Week 3:** CRUD API + static frontend wireframes  
- **Week 4:** Full frontend–backend integration  
- **Week 5:** Deterministic “Focus Now” algorithm  
- **Week 6:** ML-based recommendation deployment  
- **Week 7:** Timer implementation and data logging  
- **Week 8:** Mobile UI optimization and testing  
- **Week 9:** User manual, API documentation, project overview

---

### Major Risks
- **Cold Start Risk:** AI lacks historical data initially  
- **Data Privacy Risk:** Storage of personal task data  
- **Technical Risk:** Integrating AI into a user-friendly UI

