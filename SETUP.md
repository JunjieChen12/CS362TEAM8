# Taskwise – Setup Guide

Taskwise is a Flask-based responsive web application designed to help users manage tasks efficiently.
This document provides instructions for developers or system administrators to install, build, and run the software.

---

## 1. Obtain the Source Code

The source code for Taskwise is hosted on GitHub.

**Repository URL:**
https://github.com/JunjieChen12/CS362TEAM8.git

Clone the repository to obtain a local copy:

```
git clone https://github.com/JunjieChen12/CS362TEAM8.git
cd CS362TEAM8
```

---

## 2. Directory Layout

The root directory contains the following important files and folders:

* **reports/** – Weekly progress updates
* **living document/** – Milestone document submissions
* **README.md** – Project overview and description
* **taskwise/** – Core application directory
* **app.py** – Main Flask server entry point
* **requirements.txt** – Python dependency list
* **html/** – Application interface templates
* **static/** – Frontend assets (CSS, JS, images)
* **.gitignore** – Specifies files ignored by Git

---

## 3. Build the Software

Create a virtual environment:

```
python -m venv venv
```

(optional) Activate the virtual environment.

Mac / Linux:

```
source venv/bin/activate
```

Windows:

```
venv\Scripts\activate
```

Install the required dependencies:

```
pip install -r requirements.txt
```

---

## 4. Run the Application

Start the Flask server:

```
python app.py
```

The application will run locally at:

**http://localhost:5000**

Open this URL in a web browser to access Taskwise.

---

## 5. Testing the Software

Currently, the system supports **manual functional testing**.

To test the application:

* Run the server locally
* Open the application in a browser
* Verify that task creation, editing, and deletion functions operate correctly

---

## 6. Adding New Tests

To add automated tests, create a test file in the project root directory.

Example:

```
test_app.py
```

Testing frameworks such as **pytest** or **unittest** may be used.

---

## 7. Building a Release

Before releasing a new version of the software, complete the following steps:

* Update version numbers if necessary
* Synchronize documentation
* Verify dependencies listed in `requirements.txt`

### Post-Build Checks

* Confirm the development environment is configured correctly
* Verify database state if applicable
* Run the application and confirm core functionality works
