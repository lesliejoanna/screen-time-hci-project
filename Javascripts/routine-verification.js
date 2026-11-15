(() => {
    const draft = RoutineStorage.getDraft();
    const error = document.getElementById('routine-error');
    document.querySelectorAll('[name="verification"]').forEach(input => {
        input.checked = input.value === draft.verification;
        input.addEventListener('change', () => {
            draft.verification = input.value;
            RoutineStorage.saveDraft(draft);
        });
    });
    document.getElementById('save-routine').addEventListener('click', () => {
        const choice = document.querySelector('[name="verification"]:checked');
        if (!choice || !draft.name || !draft.childId || !draft.tasks?.length || !draft.rewards?.length || !(draft.minutes > 0)) {
            error.textContent = 'Complete the task and reward steps, then select a verification method.';
            return;
        }
        const parent = getCurrentUser();
        if (!parent || parent.role !== 'parent') return;
        try {
            const routines = RoutineStorage.read();
            routines.push({ ...draft, verification: choice.value, id: crypto.randomUUID(), parentId: parent.id, active: true, completed: false, pending: false });
            RoutineStorage.save(routines);
            sessionStorage.removeItem('routineDraft');
            window.location.href = 'mainpage.html';
        } catch { error.textContent = 'Could not save the routine. Please try again.'; }
    });
})();
