const setup = (() => {
    if (window.location.hash === '#reset-demo') {
        ['childReward', 'screenTimeSetup', 'screenTimeSession', 'Routine Name'].forEach(key => localStorage.removeItem(key));
        window.location.replace('../Kids/dashboard.html#reset-demo');
        return;
    }
    function getElement(id) {
        return document.getElementById(id);
    }
    const PROFILE_STORAGE_KEY = 'screenTimeSetup';
    const PIN_STEP = 0;
    const SCHEDULE_STEP = 2;
    const FOCUS_STEP = 4;
    const REVIEW_STEP = 5;
    const TOTAL_STEPS = 6;
    let currentStep = PIN_STEP;
    const settingIds = ['allow-duolingo', 'allow-youtube', 'allow-minecraft', 'allow-coolmath', 'session-start', 'session-duration', 'cue-visual', 'cue-audio', 'focus-hide', 'focus-motion', 'profile-name'];
    function restoreSavedSettings() {
        try {
            const saved = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || '{}');
            settingIds.forEach(id => {
                const field = getElement(id);
                if (field.type === 'checkbox' && typeof saved[id] === 'boolean') field.checked = saved[id];
                else if (typeof saved[id] === 'string') field.value = saved[id];
            });
        } catch {
            getElement('setup-error').textContent = 'Saved settings could not be loaded. You can create a new profile.';
        }
    }

    function showStep(next) {
        currentStep = next;
        document.querySelectorAll('[data-step]').forEach(panel => panel.classList.toggle('hidden', Number(panel.dataset.step) !== currentStep));
        getElement('setup-progress').textContent = `Step ${currentStep + 1} of ${TOTAL_STEPS}`;
        getElement('setup-back').disabled = currentStep === PIN_STEP;
        let nextButtonLabel = 'Next';
        if (currentStep === PIN_STEP) nextButtonLabel = 'Confirm PIN';
        if (currentStep === REVIEW_STEP) nextButtonLabel = 'Deploy to Child Session';
        getElement('setup-next').textContent = nextButtonLabel;
        getElement('setup-navigation').classList.toggle('hidden', currentStep >= TOTAL_STEPS);
        getElement('setup-error').textContent = '';
        document.querySelector(`[data-step="${currentStep}"] h2`).focus();
    }
    function showProfileSummary() {
        const allowedApps = [];
        if (getElement('allow-duolingo').checked) allowedApps.push('Duolingo');
        if (getElement('allow-youtube').checked) allowedApps.push('YouTube Kids');
        if (getElement('allow-minecraft').checked) allowedApps.push('Minecraft Classic');
        if (getElement('allow-coolmath').checked) allowedApps.push('Coolmath Games');

        const transitionCues = [];
        if (getElement('cue-visual').checked) transitionCues.push('5 minute visual cue');
        if (getElement('cue-audio').checked) transitionCues.push('2 minute chime');

        const focusSettings = [];
        if (getElement('focus-hide').checked) focusSettings.push('Hide navigation');
        if (getElement('focus-motion').checked) focusSettings.push('Reduce animations');

        const rows = [
            ['Allowed apps', allowedApps.join(', ') || 'None'],
            ['Daily schedule', `${getElement('session-start').value}, ${getElement('session-duration').value} minutes`],
            ['Cues', transitionCues.join(', ') || 'None'],
            ['Focus', focusSettings.join(', ') || 'Standard']
        ];
        getElement('profile-summary').replaceChildren();
        rows.forEach(([label, value]) => {
            const term = document.createElement('dt');
            const detail = document.createElement('dd');
            term.textContent = label;
            detail.textContent = value;
            getElement('profile-summary').append(term, detail);
        });
    }
    function collectSettings() {
        return {
            'allow-duolingo': getElement('allow-duolingo').checked,
            'allow-youtube': getElement('allow-youtube').checked,
            'allow-minecraft': getElement('allow-minecraft').checked,
            'allow-coolmath': getElement('allow-coolmath').checked,
            'session-start': getElement('session-start').value,
            'session-duration': getElement('session-duration').value,
            'cue-visual': getElement('cue-visual').checked,
            'cue-audio': getElement('cue-audio').checked,
            'focus-hide': getElement('focus-hide').checked,
            'focus-motion': getElement('focus-motion').checked,
            'profile-name': getElement('profile-name').value,
        };
    }

    function startChildSession() {
        if (!getElement('profile-name').reportValidity()) return;
        const profile = collectSettings();
        const session = { profile, endsAt: Date.now() + Number(profile['session-duration']) * 60000 };
        try {
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
            localStorage.setItem('screenTimeSession', JSON.stringify(session));
        } catch {
            getElement('setup-error').textContent = 'Could not save the session. Please enable browser storage and try again.';
            return;
        }
        window.location.href = '../Kids/dashboard.html#session=' + encodeURIComponent(JSON.stringify(session));
    }
    getElement('setup-next').addEventListener('click', () => {
        if (currentStep === PIN_STEP && getElement('setup-pin').value !== '1234') {
            getElement('setup-error').textContent = 'Enter the demo parent PIN: 1234.';
            return;
        }
        if (currentStep === SCHEDULE_STEP && (!getElement('session-start').reportValidity() || !getElement('session-duration').reportValidity())) return;
        if (currentStep === REVIEW_STEP) {
            startChildSession();
            return;
        }
        if (currentStep === FOCUS_STEP) showProfileSummary();
        showStep(currentStep + 1);
        getElement('setup-pin').value = '';
    });
    getElement('setup-back').addEventListener('click', () => showStep(Math.max(0, currentStep - 1)));
    getElement('setup-pin').addEventListener('keydown', event => { if (event.key === 'Enter') getElement('setup-next').click(); });
    restoreSavedSettings();
    showStep(PIN_STEP);
})();
