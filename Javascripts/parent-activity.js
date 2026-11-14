(() => {
    const STORAGE_KEY = 'childActivity';
    const activityList = document.getElementById('child-activity-list');
    const activityStatus = document.getElementById('child-activity-status');

    function displayActivity() {
        activityList.replaceChildren();
        let events;
        try {
            events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            if (!Array.isArray(events)) throw new Error('Invalid activity log');
        } catch {
            activityStatus.textContent = 'Activity history could not be loaded.';
            return;
        }

        if (events.length === 0) {
            activityStatus.textContent = 'No child dashboard activity recorded yet.';
            return;
        }

        activityStatus.textContent = 'Most recent activity first. Times use this device’s local time zone.';
        events.slice().reverse().forEach(event => {
            const row = document.createElement('li');
            const time = document.createElement('time');
            time.dateTime = event.timestamp;
            time.textContent = new Date(event.timestamp).toLocaleString();
            const description = document.createElement('span');
            description.textContent = `${event.username}: ${event.active ? 'Opened or returned to dashboard' : 'Left dashboard'} — ${event.reason}`;
            row.append(time, description);
            activityList.append(row);
        });
    }

    window.addEventListener('storage', event => {
        if (event.key === STORAGE_KEY || event.key === null) displayActivity();
    });
    window.addEventListener('pageshow', displayActivity);
    window.addEventListener('focus', displayActivity);
    document.getElementById('reset-demo').addEventListener('click', displayActivity);
    displayActivity();
})();
