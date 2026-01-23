#main entry point of the application

from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize App with your specific folder settings
app = Flask(__name__, template_folder='html')

# Database, creates taskwise.db in instance folder
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///taskwise.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the Database
db = SQLAlchemy(app)

# DATABASE MODEL 
# This class defines the columns in your database table
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    # Estimated minutes
    duration = db.Column(db.Integer, nullable=True)
     # Keep as string to be simple and easy to read
    deadline = db.Column(db.String(50), nullable=True)
    is_completed = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Task {self.id} - {self.name}>'

# ROUTES
@app.route('/')
def index():
    # Query all tasks from the database to display them
    tasks = Task.query.all()
    return render_template('index.html', tasks=tasks)

# Route to Add a New Task
@app.route('/add', methods=['POST'])
def add_task():
    # Get data from the form
    task_name = request.form.get('name')
    task_deadline = request.form.get('deadline')
    task_duration = request.form.get('duration')

    # Create a new Task object
    new_task = Task(name=task_name, deadline=task_deadline, duration=task_duration)

    # Save to Database
    try:
        db.session.add(new_task)
        db.session.commit()
        # Go back to the homepage
        return redirect('/')
    except:
        return 'There was an issue adding your task'

if __name__ == '__main__':
    app.run(debug=True)