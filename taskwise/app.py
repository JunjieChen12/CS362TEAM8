from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date

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

# Algorithm  
def calculate_priority(task):
    score = 0
    today = date.today()

    #FACTOR 1: Urgency
    if task.deadline:
        try:
            deadline_date = datetime.strptime(task.deadline, '%Y-%m-%d').date()
            days_left = (deadline_date - today).days
            
            if days_left < 0:
                #Overdue: higher weight
                score += 200 + abs(days_left) * 10
            elif days_left == 0:
                # Due Today: High baseline
                score += 150
            elif days_left <= 3:
                # 1-3 days 
                score += (100 / (days_left + 1))
            else:
                # Distant: Lower linear weight
                score += max(0, 40 - days_left)
        except ValueError:
            pass

    #FACTOR 2: Effort / Duration
    if task.duration:
        duration = int(task.duration)
        if duration <= 30:
            # Under 30 mins
            score += 40
        elif duration <= 90:
            # Deep Work 
            score += 20
        else:
            # Very long tasks 
            score += 5

    # FACTOR 3: Task Age
    if task.created:
        created_date = task.created.date()
        # Calculate how many days old the task is 
        age_delta = today - created_date
        days_old = age_delta.days 
        # 2 points for every day the task has existed 
        # Low priority tasks eventually move up 
        score += (days_old * 2) 
    return score


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
    else:
        focus_task = None
    
    today = datetime.now().strftime('%A, %b %d')

    return render_template('index.html', 
                           active_tasks=active_tasks, 
                           completed_tasks=completed_tasks, 
                           focus_task=focus_task, 
                           current_date=today)

# Add Task
@app.route('/add', methods=['POST'])
def add_task():
    task_name = request.form.get('name')
    task_deadline = request.form.get('deadline')
    task_duration = request.form.get('duration')
    task_notes = request.form.get('notes')
    
    # duration validation
    if task_deadline:
        selected_date = datetime.strptime(task_deadline, '%Y-%m-%d').date()
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
    task.name = request.form.get('name')
    task.deadline = request.form.get('deadline')
    task.duration = request.form.get('duration')
    task.notes = request.form.get('notes')

    task.name = request.form.get('name')
    if task.name and len(task.name) > 100:
        return "Error: Task name must be 100 characters or less.", 400

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