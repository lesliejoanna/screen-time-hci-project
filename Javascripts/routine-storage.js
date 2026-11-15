const RoutineStorage = (() => {
    const key = 'savedRoutines';
    function read() {
        const routines = JSON.parse(localStorage.getItem(key) || '[]');
        return Array.isArray(routines) ? routines : [];
    }
    function save(routines) {
        localStorage.setItem(key, JSON.stringify(routines));
    }
    function getDraft() {
        return JSON.parse(sessionStorage.getItem('routineDraft') || '{}');
    }
    function saveDraft(draft) {
        sessionStorage.setItem('routineDraft', JSON.stringify(draft));
    }
    function complete(routine) {
        routine.completed = true;
        routine.pending = false;
        routine.completedAt = new Date().toISOString();
    }
    return { read, save, getDraft, saveDraft, complete };
})();
