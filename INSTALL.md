# Taskwise User Manual
 
> **AI-Powered Personal Task Manager** — Version 1.0

## URL: http://127.0.0.1:5000/
---
 
## 1. Introduction
 
Taskwise is an AI-powered personal task manager designed to reduce decision fatigue. It doesn't just list your tasks — it analyzes your history and constraints to tell you exactly what to "Focus Now."
 
**Current Release Scope:**
- Core frontend interface is fully implemented.
- Full CRUD functionality for Tasks: Create, Read, Update, and Delete.
 
---
 
## 2. Installation & Setup
 
### Prerequisites
- Python 3.9+
- Flask
- A modern web browser (Chrome, Firefox, Edge, or Safari)
 
### Installation Steps
 
1. Clone the repository from GitHub:
   ```bash
   git clone <your-repo-url>
   ```
 
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
 
3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
 
---
 
## 3. How to Run
 
From the project root directory, run:
 
```bash
python app.py
```
 
Once running, open your browser and navigate to the local address shown in the terminal (typically `http://127.0.0.1:5000`).
 
---
 
## 4. How to Create a Task
 
1. Click the **New Task** button on the home page.
2. Enter a task name, set the estimated duration, and pick a deadline.
3. Click **Create Task** to save. The task will appear on the home page.
 
---
 
## 5. How to Edit a Task
 
1. Find the task you want to change in the task list.
2. Click the **⋮ (three dots)** menu icon on the task.
3. Change the deadline or duration as needed.
4. Click **Save Changes** to apply your edits.
 
---
 
## 6. Bug Reports & Known Issues
 
### How to Report a Bug
 
1. Navigate to the **Issues** tab in the GitHub repository.
2. Click **New Issue** and select the **Bug Report** template.
3. Fill in the following fields:
   - **Title:** A short, descriptive summary of the bug.
   - **Steps to Reproduce:** A numbered list of exact steps to trigger the issue.
   - **Expected Behavior:** What should have happened.
   - **Actual Behavior:** What actually happened.
   - **Screenshots:** Attach any relevant screenshots or screen recordings.
   - **Environment:** Your OS, browser, and Python version.
