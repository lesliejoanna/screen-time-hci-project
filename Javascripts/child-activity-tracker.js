(() => {
    const STORAGE_KEY = 'childActivity';
    const MAX_EVENTS = 200;
    const child = getCurrentUser();
    if (!child || child.role !== 'child') return;

    let wasActive = null;

    function recordActivity(isActive, reason) {
        if (isActive === wasActive) return;
        wasActive = isActive;

        try {
            const savedEvents = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const events = Array.isArray(savedEvents) ? savedEvents : [];
            events.push({
                childId: child.id,
                username: child.username,
                active: isActive,
                reason,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
        } catch {
            document.getElementById('activity-notice').textContent = 'Activity logging is unavailable because browser storage could not be updated.';
        }
    }

    function updateActivity() {
        const isVisible = document.visibilityState === 'visible';
        const isActive = isVisible && document.hasFocus();
        const reason = isActive ? 'Dashboard in focus' : isVisible ? 'Window lost focus' : 'Tab hidden';
        recordActivity(isActive, reason);
    }

    window.addEventListener('blur', updateActivity);
    window.addEventListener('focus', updateActivity);
    document.addEventListener('visibilitychange', updateActivity);
    window.addEventListener('pagehide', () => recordActivity(false, 'Dashboard closed or navigated away'));
    window.addEventListener('pageshow', updateActivity);

    window.addEventListener('storage', event => {
        if (event.key === null || (event.key === STORAGE_KEY && event.newValue === null)) {
            wasActive = null;
        }
    });
    updateActivity();
})();
