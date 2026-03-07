from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
from recommendations import calculate_priority
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
    notes = db.Column(db.Text, nullable=True)
    is_completed = db.Column(db.Boolean, default=False)
    #algorithm calculation
    created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Task {self.id} - {self.name}>'


# ROUTES
@app.route('/')
def index():
    raw_active = Task.query.filter_by(is_completed=False).all()
    completed_tasks = Task.query.filter_by(is_completed=True).all()
    
    # Sort the active tasks using the algorithm
    active_tasks = sorted(raw_active, key=lambda t: calculate_priority(t), reverse=True)
    
    # Top Recommendation
    if active_tasks:
        focus_task = active_tasks[0]
        focus_deadline_formatted = None
        if focus_task.deadline:
            d = datetime.strptime(focus_task.deadline, '%Y-%m-%d')
            focus_deadline_formatted = d.strftime('%b %d, %Y')
    else:
        focus_task = None
        focus_deadline_formatted = None
    
    today = datetime.now().strftime('%A, %b %d')
    min_datetime = datetime.now().strftime('%Y-%m-%dT%H:%M')

    return render_template('index.html', 
                           active_tasks=active_tasks, 
                           completed_tasks=completed_tasks, 
                           focus_task=focus_task, 
                           focus_deadline_formatted=focus_deadline_formatted,
                           current_date=today,
                           min_datetime=min_datetime)

# Add Task
@app.route('/add', methods=['POST'])
def add_task():
    task_name = request.form.get('name')
    task_deadline = request.form.get('deadline')
    task_duration = request.form.get('duration')
    task_notes = request.form.get('notes')
    
    # duration validation
    if task_deadline:
        try:
            selected_date = datetime.strptime(task_deadline, '%Y-%m-%dT%H:%M').date()
            if selected_date < date.today():
                return "Error: You cannot set a deadline in the past.", 400
        except ValueError:
            selected_date = datetime.strptime(task_deadline,'%Y-%m-%d').date()
            if selected_date < date.today():
                return "Error: You cannot set a deadline in the past.", 400


    # task name input validation   
    task_name = request.form.get('name')
    if task_name and len(task_name) > 100:
        return "Error: Task name must be 100 characters or less.", 400

    new_task = Task(name=task_name, deadline=task_deadline, duration=task_duration, notes=task_notes)

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

    new_name = request.form.get('name')
    new_deadline = request.form.get('deadline')
    new_duration = request.form.get('duration')
    new_notes = request.form.get('notes')

    if new_name and len(new_name) > 100:
        return "Error: Task name must be 100 characters or less.", 400
    
    # Date time validation
    if new_deadline:
        try:
            selected_date = datetime.strptime(new_deadline, '%Y-%m-%dT%H:%M').date()
            if selected_date < date.today():
                return "Error: You cannot set a deadline in the past.", 400
        except ValueError:
            selected_date = datetime.strptime(new_deadline,'%Y-%m-%d').date()
            if selected_date < date.today():
                return "Error: You cannot set a deadline in the past.", 400
            
    # If all validations pass, update the database object
    task.name = new_name
    task.deadline = new_deadline
    task.duration = new_duration
    task.notes = new_notes

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

# 404 Page (accessible at /404)
@app.route('/404')
def page_404():
    return render_template('404.html'), 404

# 404 Error Handler
@app.errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404

# Focus session
@app.route('/focus/<int:task_id>')
def focus_session(task_id):
    task = Task.query.get_or_404(task_id)
    # Default to 25 minutes if no duration is set
    duration = task.duration
    if not duration:
        duration = 25
    return render_template('focus.html', task=task, duration=duration)

# Complete Task
@app.route('/complete')
def completed():
    # Only get tasks where is_completed is True
    completed_tasks = Task.query.filter_by(is_completed=True).all()
    return render_template('complete.html', tasks=completed_tasks)


if __name__ == '__main__':
    # Automatically create the database file if it doesn't exist
    with app.app_context():
        db.create_all()
    app.run(debug=True)