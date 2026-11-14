// Account storage and sign-in for the prototype.
//
// This is prototype-level, NOT production security. Known limits:
// - All data lives in this browser's localStorage, so anyone with dev tools
//   can read or edit it and get past the page guards.
// - Salted SHA-256 keeps plaintext passwords out of storage, but it is a fast
//   hash. A real app would use a slow one (bcrypt, Argon2) on a server.
// - Child accounts have no password: knowing the username is enough to sign in.
// - Anyone can sign up as a parent, because nothing can approve a new account.

const ACCOUNTS_KEY = "accounts";
const CURRENT_USER_KEY = "currentUser";
const MIN_PASSWORD_LENGTH = 6;

const siteRoot = new URL("../", document.currentScript.src);

// Anything that reads accounts during sign-in waits on this, since hashing is async.
const accountsReady = seedDemoAccounts();

function readJson(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
}

function getAccounts() {
    return readJson(ACCOUNTS_KEY, []);
}

function saveAccounts(accounts) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function findAccount(username) {
    const name = username.trim().toLowerCase();
    return getAccounts().find(account => account.username.toLowerCase() === name);
}

function toHex(bytes) {
    return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password, salt) {
    const data = new TextEncoder().encode(salt + password);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return toHex(new Uint8Array(digest));
}

// Only parent accounts get a salt and passwordHash.
async function buildAccount(username, password, role) {
    const account = {
        id: crypto.randomUUID(),
        username: username,
        role: role,
        createdAt: new Date().toISOString()
    };

    if (role === "parent") {
        account.salt = toHex(crypto.getRandomValues(new Uint8Array(16)));
        account.passwordHash = await hashPassword(password, account.salt);
    }

    return account;
}

async function seedDemoAccounts() {
    if (localStorage.getItem(ACCOUNTS_KEY) !== null) {
        return;
    }

    const parent = await buildAccount("parent", "parent123", "parent");
    const child = await buildAccount("child", "", "child");
    saveAccounts([parent, child]);
}

// Returns { ok: true, account } or { ok: false, error }.
async function createAccount(username, password, role) {
    await accountsReady;

    const name = username.trim();

    if (!name) {
        return { ok: false, error: "Please enter a username." };
    }
    if (role !== "parent" && role !== "child") {
        return { ok: false, error: "Please choose Parent or Child." };
    }
    if (role === "parent" && !password) {
        return { ok: false, error: "Please enter a password." };
    }
    if (role === "parent" && password.length < MIN_PASSWORD_LENGTH) {
        return { ok: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
    }

    const account = await buildAccount(name, password, role);

    // Checked after the async hash so two quick submits can't both pass.
    if (findAccount(name)) {
        return { ok: false, error: "That username is already taken." };
    }

    saveAccounts([...getAccounts(), account]);
    return { ok: true, account: account };
}

// Returns { ok: true, account } or { ok: false, error }.
async function verifyLogin(username, password, role) {
    await accountsReady;

    const account = findAccount(username);

    if (role === "child") {
        if (!account || account.role !== "child") {
            return { ok: false, error: "No child account found with that username." };
        }
        return { ok: true, account: account };
    }

    const invalid = { ok: false, error: "Incorrect username or password." };

    if (!account || account.role !== "parent") {
        return invalid;
    }

    const hash = await hashPassword(password, account.salt);
    return hash === account.passwordHash ? { ok: true, account: account } : invalid;
}

function setCurrentUser(account) {
    const user = JSON.stringify({
        id: account.id,
        username: account.username,
        role: account.role
    });
    sessionStorage.setItem(CURRENT_USER_KEY, user);
    localStorage.setItem(CURRENT_USER_KEY, user);
}

// Reads the account back from the store so a stale currentUser doesn't count.
function getCurrentUser() {
    let current;
    try {
        const savedUser = sessionStorage.getItem(CURRENT_USER_KEY);
        current = savedUser ? JSON.parse(savedUser) : readJson(CURRENT_USER_KEY, null);
    } catch {
        current = null;
    }
    const account = current && getAccounts().find(item => item.id === current.id);

    if (!account) {
        return null;
    }

    const user = { id: account.id, username: account.username, role: account.role };
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
}

function logout() {
    sessionStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
}

function redirectToDashboard(role) {
    const page = role === "parent" ? "Parents/controls.html" : "Kids/dashboard.html";
    window.location.href = new URL(page, siteRoot).href;
}

// Page guard: call from the <head> of a protected page.
function requireRole(role) {
    const check = () => {
        const user = getCurrentUser();

        if (!user || user.role !== role) {
            document.documentElement.style.visibility = "hidden";
            window.location.replace(new URL("login.html", siteRoot).href);
        }
    };

    check();

    // Re-check when the back button restores this page after logging out.
    window.addEventListener("pageshow", check);
}
