(() => {
    const table = document.getElementById('routine-table-body');
    function render() {
        table.replaceChildren();
        try {
            const parent = getCurrentUser();
            const routines = RoutineStorage.read().filter(routine => routine.parentId === parent?.id);
            document.getElementById('routine-empty').textContent = routines.length ? '' : 'No routines yet. Select Create New Routine to get started.';
            routines.forEach(routine => {
                const row = document.createElement('tr');
                const name = document.createElement('td');
                const status = document.createElement('td');
                const toggle = document.createElement('button');
                name.textContent = `${routine.name} — ${routine.tasks.join(', ')}`;
                toggle.textContent = routine.active ? 'Active' : 'Inactive';
                toggle.className = routine.active ? 'routine-status-green' : 'routine-status-red';
                toggle.addEventListener('click', () => change(routine.id, item => { item.active = !item.active; }));
                status.append(toggle);
                const progress = document.createElement('p');
                progress.textContent = routine.completed ? 'Completed — reward earned' : routine.pending ? 'Awaiting parent sign-off' : routine.verification;
                status.append(progress);
                if (routine.pending && routine.active && !routine.completed) {
                    const approve = document.createElement('button');
                    approve.textContent = 'Approve Completion';
                    approve.addEventListener('click', () => change(routine.id, item => RoutineStorage.complete(item)));
                    status.append(approve);
                }
                row.append(name, status);
                table.append(row);
            });
        } catch { document.getElementById('routine-empty').textContent = 'Could not load routines.'; }
    }
    function change(id, update) {
        try {
            const routines = RoutineStorage.read();
            const routine = routines.find(item => item.id === id && item.parentId === getCurrentUser()?.id);
            if (!routine) return;
            update(routine);
            RoutineStorage.save(routines);
            render();
        } catch { document.getElementById('routine-empty').textContent = 'Could not save the change.'; }
    }
    document.getElementById('create-routine').addEventListener('click', () => {
        sessionStorage.removeItem('routineDraft');
        window.location.href = 'obligations.html';
    });
    window.addEventListener('storage', event => { if (event.key === 'savedRoutines' || event.key === null) render(); });
    window.addEventListener('focus', render);
    render();
})();
