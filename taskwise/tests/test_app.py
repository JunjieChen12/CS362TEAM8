import unittest
from app import app, db, Task

class TaskwiseTestCase(unittest.TestCase):
    def setUp(self):
        # Configure a temporary in-memory database for testing
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app = app.test_client()
        
        with app.app_context():
            db.create_all()

    def tearDown(self):
        # Clean up the database after each test
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_index_page_loads(self):
        """Test that the home page loads successfully (HTTP 200)"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'TASKWISE', response.data)

    def test_add_task(self):
        """Test adding a task via the POST route"""
        response = self.app.post('/add', data=dict(
            name="Test Task",
            deadline="2026-12-31",
            duration=60
        ), follow_redirects=True)
        
        self.assertEqual(response.status_code, 200)
        
        # Verify it was added to the database
        with app.app_context():
            task = Task.query.first()
            self.assertIsNotNone(task)
            self.assertEqual(task.name, "Test Task")

    def test_complete_task(self):
        """Test toggling a task completion status"""
        # First, add a task
        with app.app_context():
            task = Task(name="To be completed", duration=30)
            db.session.add(task)
            db.session.commit()
            task_id = task.id

        # Now toggle it
        response = self.app.get(f'/toggle/{task_id}', follow_redirects=True)
        self.assertEqual(response.status_code, 200)

        # Verify it is now completed
        with app.app_context():
            updated_task = db.session.get(Task, task_id)
            self.assertTrue(updated_task.is_completed)

if __name__ == '__main__':
    unittest.main()