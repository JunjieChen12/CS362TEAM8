from datetime import datetime

def calculate_priority(task):
    score = 0
    now = datetime.now()

    # FACTOR 1: Urgency
    if task.deadline:
        try:
            # Try to parse the new date+time
            deadline_dt = datetime.strptime(task.deadline, '%Y-%m-%dT%H:%M')
        except ValueError:
            try:
                # Fallback for older tasks already in database that only have a date 'YYYY-MM-DD'
                deadline_dt = datetime.strptime(task.deadline, '%Y-%m-%d')
            except ValueError:
                deadline_dt = None

        if deadline_dt:
            # Calculate exact hours left
            time_left = deadline_dt - now
            hours_left = time_left.total_seconds() / 3600

            if hours_left < 0:
                # Overdue: extremely high priority, scales with how overdue it is
                score += 200 + abs(hours_left) * 2
            elif hours_left <= 24:
                # Due within 24 hours: High baseline + granular time bonus
                score += 150 + (24 - hours_left) * 2
            elif hours_left <= 72:
                # 1-3 days left
                score += (100 / ((hours_left / 24) + 1))
            else:
                # Distant: Lower linear weight
                days_left = hours_left / 24
                score += max(0, 40 - days_left)

    # FACTOR 2: Duration
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
        age_delta = now - task.created
        days_old = age_delta.days 
        score += (days_old * 2) 
        
    return score