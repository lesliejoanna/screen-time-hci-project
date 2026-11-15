(() => {
    const container = document.getElementById('child-routines');
    const dashboardTab = document.getElementById('child-dashboard-tab');
    dashboardTab.addEventListener('click', () => {
        const heading = document.getElementById('child-dashboard-heading');
        heading.scrollIntoView({ block: 'start' });
        heading.focus({ preventScroll: true });
    });
    const urls = { Duolingo: 'https://www.duolingo.com/', 'Minecraft Classic': 'https://classic.minecraft.net/', 'YouTube Kids': 'https://www.youtubekids.com/' };
    function render() {
        container.replaceChildren();
        try {
            const child = getCurrentUser();
            const routines = RoutineStorage.read().filter(item => item.childId === child?.id && item.active);
            if (!routines.length) container.textContent = 'No active routines assigned to you.';
            routines.forEach(routine => {
                const card = document.createElement('div');
                card.className = 'routine-card';
                const title = document.createElement('h3');
                title.textContent = routine.name;
                card.append(title);
                const checks = routine.tasks.map(task => {
                    const label = document.createElement('label');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = routine.completed || routine.pending;
                    checkbox.disabled = routine.completed || routine.pending;
                    label.append(checkbox, document.createTextNode(task));
                    card.append(label);
                    return checkbox;
                });
                const details = document.createElement('p');
                details.textContent = `Reward: ${routine.minutes} minutes and ${routine.rewards.join(', ')}. Verification: ${routine.verification}${routine.verification === 'Parent PIN' ? ' (demo PIN: 1234)' : ''}.`;
                card.append(details);
                const message = document.createElement('p');
                message.setAttribute('role', 'status');
                card.append(message);
                if (routine.completed) {
                    message.textContent = 'Completed — reward earned!';
                    routine.rewards.forEach(name => {
                        if (!urls[name]) return;
                        const link = document.createElement('a');
                        link.href = urls[name];
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                        link.dataset.activityApp = name;
                        link.textContent = `Open ${name}`;
                        card.append(link);
                    });
                    if (!routine.rewardClaimed) {
                        const collect = document.createElement('button');
                        collect.textContent = 'Collect Playtime Reward';
                        collect.addEventListener('click', () => update(routine.id, item => {
                            if (item.rewardClaimed || !item.completed) return;
                            const minutes = Number(localStorage.getItem('playtimeMinutes') || 0);
                            localStorage.setItem('playtimeMinutes', String(minutes + item.minutes));
                            item.rewardClaimed = true;
                        }, message));
                        card.append(collect);
                    }
                } else if (routine.pending) {
                    message.textContent = 'Waiting for your parent to approve this routine on their Routines page.';
                } else {
                    let pin;
                    if (routine.verification === 'Parent PIN') {
                        const label = document.createElement('label');
                        label.textContent = 'Parent PIN (demo: 1234)';
                        pin = document.createElement('input');
                        pin.type = 'password';
                        pin.inputMode = 'numeric';
                        pin.maxLength = 4;
                        label.append(pin);
                        card.append(label);
                    }
                    const complete = document.createElement('button');
                    complete.textContent = routine.verification === 'Parent Sign-Off' ? 'Request Parent Sign-Off' : routine.verification === 'Parent PIN' ? 'Verify with Parent PIN' : 'Mark Complete (Honor System)';
                    complete.addEventListener('click', () => {
                        if (!checks.every(check => check.checked)) {
                            message.textContent = 'Check every task before submitting.';
                            return;
                        }
                        if (pin && pin.value !== '1234') {
                            message.textContent = 'Incorrect PIN. The demo parent PIN is 1234.';
                            return;
                        }
                        update(routine.id, item => {
                            if (item.completed || item.pending || !item.active) return;
                            if (item.verification === 'Parent Sign-Off') item.pending = true;
                            else RoutineStorage.complete(item);
                        }, message);
                    });
                    card.append(complete);
                }
                container.append(card);
            });
        } catch { container.textContent = 'Could not load your routines.'; }
    }
    function update(id, action, message) {
        try {
            const routines = RoutineStorage.read();
            const routine = routines.find(item => item.id === id && item.childId === getCurrentUser()?.id);
            if (!routine) return;
            action(routine);
            RoutineStorage.save(routines);
            render();
        } catch { message.textContent = 'Could not save the change. Please try again.'; }
    }
    window.addEventListener('storage', event => { if (event.key === 'savedRoutines' || event.key === null) render(); });
    window.addEventListener('focus', render);
    render();
})();
