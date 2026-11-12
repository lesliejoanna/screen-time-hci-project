(() => {
    if (window.location.hash === '#reset-demo') {
        ['childReward', 'screenTimeSetup', 'screenTimeSession', 'Routine Name'].forEach(key => localStorage.removeItem(key));
        window.location.replace('../Parents/controls.html');
        return;
    }
    function getElement(id) {
        return document.getElementById(id);
    }
    const allowedApps = [
        ['allow-youtube', 'YouTube Kids', 'https://www.youtubekids.com/'],
        ['allow-minecraft', 'Minecraft Classic', 'https://classic.minecraft.net/'],
        ['allow-coolmath', 'Coolmath Games', 'https://www.coolmathgames.com/'],
        ['allow-duolingo', 'Duolingo', 'https://www.duolingo.com/']
    ];
    let session;
    let audioContext;
    let hasPlayedChime = false;
    function isValidSession(value) {
        return value && value.profile && typeof value.profile === 'object' && Number.isFinite(value.endsAt);
    }
    let transferredSession = null;
    if (window.location.hash.startsWith('#session=')) {
        try {
            const value = JSON.parse(decodeURIComponent(window.location.hash.slice(9)));
            if (isValidSession(value)) {
                transferredSession = value;
                localStorage.setItem('screenTimeSession', JSON.stringify(value));
            }
        } catch {
            // Keep a valid transferredSession session available even if browser storage fails.
        }
        if (transferredSession) {
            try { window.history.replaceState(null, '', window.location.pathname + window.location.search); }
            catch { /* Some browsers restrict history changes for local files. */ }
        }
    }
    function loadSession() {
        try { session = transferredSession || JSON.parse(localStorage.getItem('screenTimeSession')); }
        catch { session = null; }
        transferredSession = null;
        if (!isValidSession(session)) session = null;
        hasPlayedChime = false;
        updateDashboard();
    }
    function updateDashboard() {
        const secondsRemaining = session ? Math.max(0, Math.ceil((session.endsAt - Date.now()) / 1000)) : 0;
        const isSessionActive = secondsRemaining > 0;
        const profile = session ? session.profile : {};
        updateSessionDetails(secondsRemaining, isSessionActive, profile);
        updateFocusSettings(isSessionActive, profile);
        updateAllowedApps(isSessionActive, profile);
        playWindDownChime(secondsRemaining, isSessionActive, profile);
    }

    function updateSessionDetails(secondsRemaining, isSessionActive, profile) {
        getElement('child-session').classList.toggle('hidden', !session);
        getElement('session-empty').classList.toggle('hidden', !!session);
        const minutes = Math.floor(secondsRemaining / 60);
        const seconds = String(secondsRemaining % 60).padStart(2, '0');
        if (session) {
            getElement('dashboard-time').textContent = `Remaining time: ${minutes}:${seconds}`;
        } else {
            getElement('dashboard-time').textContent = 'No active session';
        }
        getElement('dashboard-status').textContent = isSessionActive ? 'Status: Session active' : 'Status: Locked';
        getElement('child-profile').textContent = profile['profile-name'] || 'My Session';
        getElement('child-schedule').textContent = session ? `Daily schedule: ${profile['session-start']} · ${profile['session-duration']} minutes` : '';
        getElement('child-wind-down').classList.toggle('hidden', !(isSessionActive && secondsRemaining <= 300 && profile['cue-visual']));
        let reminder = '';
        if (!isSessionActive && session) {
            reminder = 'Session ended. Time for a break.';
        } else if (isSessionActive && secondsRemaining <= 120 && profile['cue-audio']) {
            reminder = 'Two minutes left. Finish your activity.';
        }
        getElement('child-cue').textContent = reminder;
        getElement('enable-chime').classList.toggle('hidden', !isSessionActive || !profile['cue-audio'] || !!audioContext);
        getElement('child-end').disabled = !isSessionActive;
        if (!isSessionActive) getElement('child-end-confirmation').classList.add('hidden');
    }

    function updateFocusSettings(isSessionActive, profile) {
        document.querySelector('main nav').classList.toggle('hidden', isSessionActive && profile['focus-hide'] === true);
        document.body.classList.toggle('setup-reduce-motion', isSessionActive && profile['focus-motion'] === true);
    }

    function updateAllowedApps(isSessionActive, profile) {
        allowedApps.forEach(([key, name]) => {
            const link = getElement(key);
            link.classList.toggle('hidden', !isSessionActive || profile[key] !== true);
        });
        getElement('child-no-apps').classList.toggle('hidden', isSessionActive && allowedApps.some(([key]) => profile[key] === true));
    }

    function playWindDownChime(secondsRemaining, isSessionActive, profile) {
        if (isSessionActive && secondsRemaining <= 120 && profile['cue-audio'] && audioContext && !hasPlayedChime) {
            hasPlayedChime = true;
            const tone = audioContext.createOscillator();
            const volume = audioContext.createGain();
            volume.gain.value = 0.08;
            tone.connect(volume).connect(audioContext.destination);
            tone.frequency.value = 660;
            tone.start();
            tone.stop(audioContext.currentTime + 0.4);
        }
    }

    allowedApps.forEach(([key, name, url]) => {
        const link = document.createElement('a');
        link.id = key;
        link.textContent = name;
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.addEventListener('click', event => {
            if (!session || Date.now() >= session.endsAt || session.profile[key] !== true) event.preventDefault();
        });
        getElement('child-apps').append(link);
    });
    const empty = document.createElement('p');
    empty.id = 'child-no-apps';
    empty.textContent = 'No apps available in this session.';
    getElement('child-apps').append(empty);
    getElement('enable-chime').addEventListener('click', async () => {
        try {
            const Audio = window.AudioContext || window.webkitAudioContext;
            audioContext = new Audio();
            await audioContext.resume();
            updateDashboard();
        } catch {
            audioContext = null;
            getElement('child-cue').textContent = 'Audio unavailable. The written reminder will still appear.';
        }
    });
    getElement('child-end').addEventListener('click', () => {
        getElement('child-end-confirmation').classList.remove('hidden');
        getElement('child-pin').focus();
    });
    getElement('child-cancel-end').addEventListener('click', () => {
        getElement('child-end-confirmation').classList.add('hidden');
        getElement('child-pin').value = '';
        getElement('child-end-error').textContent = '';
    });
    function endSession() {
        if (getElement('child-pin').value !== '1234') {
            getElement('child-end-error').textContent = 'Incorrect parent PIN.';
            return;
        }
        if (!session) return;
        const ended = { ...session, endsAt: Date.now() };
        try { localStorage.setItem('screenTimeSession', JSON.stringify(ended)); }
        catch { getElement('child-end-error').textContent = 'Could not save changes. Please try again.'; return; }
        session = ended;
        getElement('child-pin').value = '';
        updateDashboard();
    }

    getElement('child-confirm-end').addEventListener('click', endSession);
    window.addEventListener('storage', event => { if (event.key === 'screenTimeSession' || event.key === null) loadSession(); });
    loadSession();
    setInterval(updateDashboard, 1000);
})();
