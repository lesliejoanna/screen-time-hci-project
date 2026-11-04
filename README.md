# screen-time-hci-project

A front-end prototype of a family screen time manager, built with plain HTML, CSS and JavaScript. There's no backend or build step, and all data is stored in the browser's `localStorage`.

## Running it

Serve the folder from `localhost`, because password hashing uses the Web Crypto API, which browsers only enable on secure pages:

```bash
npx serve
```

## Demo accounts

These are created the first time a page that loads `Javascripts/accounts.js` opens:

| Role | Username | Password |
|---|---|---|
| Parent | `parent` | `parent123` |
| Child | `child` | None: child accounts have no password |

To sign in as a child, choose the Child toggle and enter only the username.

## Accounts and security

Account logic is in `Javascripts/accounts.js`. Parent passwords are stored as a salted SHA-256 hash, never as plaintext. This is prototype-level security, not production security:

- Anyone with browser dev tools can read or edit `localStorage` and get past the page guards.
- Child accounts have no password, so knowing the username is enough to sign in.
- Anyone can sign up as a parent.
- Accounts exist only in the browser where they were created.
