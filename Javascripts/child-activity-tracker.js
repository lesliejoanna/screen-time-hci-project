(() => {
    const STORAGE_KEY = 'childActivity';
    const MAX_EVENTS = 200;
    const child = getCurrentUser();
    if (!child || child.role !== 'child') return;

    let wasActive = null;
    let selectedApp = null;
    let selectedAppAt = 0;

    function recordActivity(isActive, reason, type = 'focus') {
        if (type === 'focus') {
            if (isActive === wasActive) return;
            wasActive = isActive;
        }

        try {
            const savedEvents = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const events = Array.isArray(savedEvents) ? savedEvents : [];
            events.push({
                childId: child.id,
                username: child.username,
                active: isActive,
                type,
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
        let reason = isActive ? 'Dashboard in focus' : isVisible ? 'Window lost focus' : 'Tab hidden';
        if (!isActive && selectedApp && Date.now() - selectedAppAt < 10000) {
            reason = `Selected ${selectedApp}, then left dashboard`;
            selectedApp = null;
        }
        recordActivity(isActive, reason);
        if (isActive && wasActive !== null) selectedApp = null;
    }

    function recordAppClick(event) {
        if (event.defaultPrevented) return;
        if (event.type === 'auxclick' && event.button !== 1) return;
        const link = event.target.closest('a[data-activity-app]');
        if (!link || link.closest('.hidden')) return;
        selectedApp = link.dataset.activityApp;
        selectedAppAt = Date.now();
        recordActivity(
            document.visibilityState === 'visible' && document.hasFocus(),
            `Selected ${link.dataset.activityApp}`,
            'app-click'
        );
    }

    document.addEventListener('click', recordAppClick);
    document.addEventListener('auxclick', recordAppClick);
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
