(() => {
    const draft = RoutineStorage.getDraft();
    const rewards = [
        { name: 'Duolingo', image: '../../Images/duolingo.png' },
        { name: 'Minecraft Classic', image: '../../Images/Minecraft.png' },
        { name: 'YouTube Kids', image: '../../Images/YouTube.png' }
    ];
    const selected = new Set(draft.rewards || []);
    rewards.forEach((reward, index) => {
        const button = document.getElementById(`reward${index + 1}`);
        button.textContent = reward.name;
        button.style.backgroundImage = `url(${reward.image})`;
        button.style.backgroundSize = 'cover';
        button.style.backgroundPosition = 'center';
        function render() {
            button.classList.toggle('reward-selected', selected.has(reward.name));
            button.classList.toggle('reward-not-selected', !selected.has(reward.name));
            button.setAttribute('aria-pressed', String(selected.has(reward.name)));
        }
        button.addEventListener('click', () => {
            if (selected.has(reward.name)) selected.delete(reward.name);
            else selected.add(reward.name);
            render();
        });
        render();
    });
    const allowance = document.getElementById('allowance');
    allowance.value = draft.minutes || 15;
    document.getElementById('allowance-form').addEventListener('submit', event => event.preventDefault());
    document.getElementById('routine-next').addEventListener('click', () => {
        if (!allowance.reportValidity()) return;
        if (selected.size === 0) {
            document.getElementById('routine-error').textContent = 'Select at least one reward app.';
            return;
        }
        try {
            RoutineStorage.saveDraft({ ...draft, rewards: [...selected], minutes: Number(allowance.value) });
            window.location.href = 'verification.html';
        } catch { document.getElementById('routine-error').textContent = 'Could not save your reward choices.'; }
    });
})();
