(() => {
    const draft = RoutineStorage.getDraft();
    const name = document.getElementById('routine-name');
    const childSelect = document.getElementById('routine-child');
    const error = document.getElementById('routine-error');
    name.value = draft.name || '';
    getAccounts().filter(account => account.role === 'child').forEach(child => {
        const option = document.createElement('option');
        option.value = child.id;
        option.textContent = child.username;
        childSelect.append(option);
    });
    childSelect.value = draft.childId || childSelect.value;
    const tasks = ['Finish Math Homework', 'Clean Dishes'];
    const selected = new Set(draft.tasks || []);
    tasks.forEach((task, index) => {
        const button = document.getElementById(`isitSelected${index + 1}`);
        function render() {
            button.textContent = task;
            button.className = selected.has(task) ? 'task-selected' : 'task-not-selected';
            button.setAttribute('aria-pressed', String(selected.has(task)));
        }
        button.addEventListener('click', () => {
            if (selected.has(task)) selected.delete(task);
            else selected.add(task);
            render();
        });
        render();
    });
    document.getElementById('routine-next').addEventListener('click', () => {
        if (!name.value.trim() || !childSelect.value || selected.size === 0) {
            error.textContent = 'Enter a routine name, choose a child, and select at least one task. Create a child account first if none are available.';
            return;
        }
        try {
            RoutineStorage.saveDraft({ ...draft, name: name.value.trim(), childId: childSelect.value, tasks: [...selected] });
            window.location.href = 'pair_rewards.html';
        } catch { error.textContent = 'Could not save your choices. Please enable browser storage.'; }
    });
})();
