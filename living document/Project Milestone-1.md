# Taskwise - Personal Task Manager with AI recommendations

**Team Members:**
* **Junjie Chen** - [Fullstack]
* **Meiqi Ma** - [Backend]
* **Thao Nguyen** - [Frontend]
* **Weiqian Xu** - [Backend]

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




  
1. Test-Automation Infrastructure
	•	Infrastructure Chosen: Python unittest framework.
	•	Justification: We chose unittest because it is built natively into the Python standard library, meaning it requires no additional external installations. It integrates seamlessly with our Flask application context and uses an xUnit-style architecture (setUp and tearDown methods) that makes it easy to isolate our SQLite database tests.
	•	How to add a new test: 1. Navigate to the tests/ directory in our repository. 2. Open the test file (test_app.py). 3. Create a class that inherits from unittest.TestCase. 4. Define a new method starting with the word test_ (e.g., def test_delete_task(self):). 5. Run the suite locally using the command: python -m unittest discover tests.
2. Continuous Integration (CI) Service
	•	Service Chosen: GitHub Actions.
	◦	GitHub Actions is deeply integrated directly into our code hosting platform. This eliminates the need for external webhooks or third-party accounts. It allows us to block pull requests automatically if tests fail, ensuring that our main branch remains stable as all four team members contribute code.
	
3. CI Service Comparison
GitHub Actions (Our Choice)
	•	Setup Difficulty: Low. It requires only a single YAML configuration file stored directly within our repository.
	•	Platform Integration: Native. It is built directly into the GitHub Pull Request UI, meaning we don't have to leave our codebase to see test results.
	•	Cost: Free. It has a generous free tier for public and student repositories.
	•	Pros: Zero context-switching; native PR blocking; easy setup for Python environment testing.
	•	Cons: YAML syntax errors can be frustrating and difficult to debug.

Jenkins
	•	Setup Difficulty: High. It requires hosting, configuring, and maintaining a dedicated external server.
	•	Platform Integration: Plugin-based. It requires extensive plugin management and webhooks to talk to GitHub.
	•	Cost: Free software, but we would have to pay out-of-pocket for the server hosting.
	•	Pros: Infinite customizability; it is the industry standard for massive enterprise applications.
	•	Cons: Far too heavy, complex, and maintenance-intensive for a 9-week student project.
Travis CI
	•	Setup Difficulty: Medium. Requires linking a third-party account and setting up external webhooks.
	•	Platform Integration: External. Test results and logs are hosted on a completely separate Travis CI dashboard.
	•	Cost: Limited. The free tier has become highly restrictive for new open-source projects.
	•	Pros: Historically the standard for open-source; simple configuration syntax.
	•	Cons: Uncertainty around free-tier minute limits and the hassle of managing another external account.
4. CI Build Configuration
	•	Triggers: The automated build runs on two specific development actions:
	◦	Any Push directly to the main branch.
	◦	Any Pull Request opened against the main branch.
	•	Tests Executed: Every time a build is triggered, the CI pipeline boots up an Ubuntu server, installs Python/Flask, and runs our full unittest suite. This currently executes tests verifying:
	◦	The successful load of the Dashboard UI (HTTP 200).
	◦	Task Creation (POST /add) and database persistence.
	◦	Task Completion (GET /toggle/<id>) logic and state changes.

