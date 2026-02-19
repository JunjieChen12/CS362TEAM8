from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy

# Initialize App
app = Flask(__name__, template_folder='html')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///taskwise.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# DATABASE MODEL 
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    duration = db.Column(db.Integer, nullable=True)
    deadline = db.Column(db.String(50), nullable=True)
    is_completed = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Task {self.id} - {self.name}>'

# ROUTES
@app.route('/')
def index():

    active_tasks = Task.query.filter_by(is_completed=False).all()
    completed_tasks = Task.query.filter_by(is_completed=True).all()
    return render_template('index.html', active_tasks=active_tasks, completed_tasks=completed_tasks)

# Add Task
@app.route('/add', methods=['POST'])
def add_task():
    task_name = request.form.get('name')
    task_deadline = request.form.get('deadline')
    task_duration = request.form.get('duration')

    new_task = Task(name=task_name, deadline=task_deadline, duration=task_duration)

    try:
        db.session.add(new_task)
        db.session.commit()
        return redirect('/')
    except:
        return 'There was an issue adding your task'

# Check Task
@app.route('/toggle/<int:task_id>')
def toggle_task(task_id):
    task = Task.query.get_or_404(task_id)
    task.is_completed = not task.is_completed 
    try:
        db.session.commit()
        return redirect('/')
    except:
        return 'There was an issue updating your task'

# Edit Task
@app.route('/edit/<int:task_id>', methods=['POST'])
def edit_task(task_id):
    task = Task.query.get_or_404(task_id)
    task.name = request.form.get('name')
    task.deadline = request.form.get('deadline')
    task.duration = request.form.get('duration')

    try:
        db.session.commit()
        return redirect('/')
    except:
        return 'There was an issue updating your task'

# Delete Task  
@app.route('/delete/<int:task_id>', methods=['POST'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    try:
        db.session.delete(task)
        db.session.commit()
        return redirect('/')
    except:
        return 'There was an issue deleting your task'
    

if __name__ == '__main__':
    # Automatically create the database file if it doesn't exist
    with app.app_context():
        db.create_all()
    app.run(debug=True)

