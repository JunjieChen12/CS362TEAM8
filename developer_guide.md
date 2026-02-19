Taskwise Developer Guidelines 

Taskwise is a Flask-based responsive web application.

1. How to obtain the source code
   The source code for Taskwise is hosted on GitHub. You can obtain a local copy by cloning the public repository.

   Repository URL: https://github.com/JunjieChen12/CS362TEAM8.git
   

2. Directory Layout
   /: Root directory contains project-wide administrative files.
     reports/: Weekly progress updates.
     living document/: milestone submissions.
     README.md: Project overview.
     taskwise/: The core application directory.
       app.py: Main Flask server.
       requirements.txt: Python dependency list.
       html/: interface 
       static/: Frontend assets
     .gitignore: Specifies files to be ignored by Git

   
3. How to build the software
   Create venv: python -m venv venv
   Activate it
   Install dependencies: pip install -r requirements.txt


4. How to test the software
   Currently, the system supports manual functional testing.


5. How to add new tests
   To add a test, create a file in the root directory named test_app.py


6. How to build a release of the software
   Manual Tasks Before Release:
     Update Version Numbers
     Documentation Sync
   
   Post-Build Sanity Checks:
     Environment Check
     Database Reset

     
