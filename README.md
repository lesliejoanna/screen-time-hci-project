# Screen Time Manager

Screen Time Manager is a browser-based screen time management prototype built with HTML, CSS, and JavaScript. Parents can grant rewards, create routines, review child dashboard activity, and configure focused child sessions. Children can complete assigned routines, collect rewards, and open apps selected for their sessions.

- GitHub repository: https://github.com/lesliejoanna/screen-time-hci-project
- Hosted website: https://lesliejoanna.github.io/screen-time-hci-project/
- Walkthrough video: https://www.youtube.com/watch?v=W3nrZkPYFHs

## Running the hosted UI

1. Open the hosted website in a current desktop browser with JavaScript and browser storage enabled.
2. Select **Sign In**, then choose **Parent** or **Child**.
3. Use a demo account below, or select **Create an account**.

No additional software, packages, or extensions are required for the hosted prototype. Internet access is needed to load the website and open external apps. Use the same browser profile and site address when testing parent and child interactions; private windows, different browsers, and different devices do not share the saved data.

## Test accounts

Demo accounts are created when account storage is first initialized.

| Role | Username | Password |
| --- | --- | --- |
| Parent | `parent` | `parent123` |
| Child | `child` | No password; select Child and enter the username only. |

New parent passwords must contain at least six characters. Child accounts do not require a password. New accounts can be created, but test users are provider for convenience.

The fixed prototype parent PIN is **1234**. It is displayed in the relevant UI and is separate from the parent account password. Parents do not configure a custom PIN in this implementation.

## Operating the UI

### Landing page and accounts

The landing page introduces the website and links to Login. Login includes a link to create a parent or child account. Signing in opens the dashboard matching the selected account role. Parent and child pages check the signed-in role and redirect to Login when it does not match. Logout clears the current tab's sign-in and the shared saved login; other tabs with their own signed-in user remain signed in.

### Parent controls and rewards (simple task)

1. Sign in as a parent and open **Controls**.
2. Select **Grant Reward**.
3. Choose **+15 mins play**, **+30 mins play**, or **Unlock app**.
4. Select **Confirm** to grant the reward, or **Back** to leave without confirming.
5. In the same browser and site, sign in as the child to view the reward.
6. For minute rewards, select **Start Playtime** on the child dashboard to start the countdown. Additional minute grants increase the available playtime balance.
7. **Unlock app** displays app choices on the child dashboard. It has no separate expiry timer; it is an app-access flag rather than an enforced unlimited-time allowance.

### Creating and completing routines (moderate task)

1. Sign in as a parent, open **Routines**, and select **Create New Routine**.
2. Enter a routine name, assign a registered child, and select at least one required task.
3. Select **Next**, choose one or more reward apps, and enter an allowance from 1 to 180 whole minutes.
4. Select **Next** and choose **Parent PIN**, **Parent Sign-Off**, or **Honor System** as the verification method.
5. Select **Save & Activate Routine** and confirm that the routine appears in the parent's list as Active.
6. Sign in as the assigned child and check every completed task under **My Routines and Tasks**.
7. Complete verification using the selected method: enter PIN **1234**, request parent sign-off, or mark complete using the honor system. For sign-off, the parent must select **Approve Completion** on their Routines page.
8. After completion, open the earned app links and select **Collect Playtime Reward**, then **Start Playtime** to use the allowance.

Create a child account first if none are available. Parents can toggle routines Active or Inactive. Saved routines remain after reloading; inactive routines are hidden from the child's active list. Each routine's playtime reward can be collected once, and completed routines do not automatically reset each day.

### Focused session setup (complex task)

1. Sign in as a parent and open **Setup**.
2. Enter the demo parent PIN **1234** and select **Confirm PIN**.
3. Choose any combination of YouTube Kids, Minecraft Classic, Coolmath Games, and Duolingo, then select **Next**.
4. Enter a daily start time and a session duration from 1 to 180 whole minutes, then select **Next**.
5. Choose whether to enable the five-minute visual wind-down reminder.
6. Choose whether to enable the two-minute audio chime, then select **Next**.
7. Choose whether to hide child navigation and reduce animations, then select **Next**.
8. Enter a profile name and review the app choices, schedule, transition cues, and focus settings. Use **Back** if you need to change them.
9. Select **Deploy to Child Session**. The session countdown starts immediately.
10. Sign in as a child in the same browser and site to open the saved session. The countdown continues during sign-in.
11. Check the remaining time and open one of the selected apps from the session panel.
12. If you enabled the audio cue, select **Enable Audio Chime** on the child dashboard and ensure the browser tab and device are not muted.
13. Return to the dashboard as the session approaches its end. The visual reminder appears at five minutes remaining if enabled; the audio chime and written reminder are triggered at two minutes if enabled.
14. Let the countdown finish, or select **End Session Early**, enter PIN **1234**, and confirm. The session's app links are hidden when it ends.
15. Sign in as a parent and open **Controls** to review timestamped app selections, departures, and returns under **Child Dashboard Activity**.

The daily start time is saved with the profile; it does not automatically launch a session at that time. The focused-session countdown is separate from reward playtime. App links are controlled only within the dashboard; external apps are not closed when the session ends.

### Child dashboard and session controls

The child dashboard displays assigned routines, available reward playtime, unlocked reward apps, and any focused session. The session panel provides links to the apps selected during setup. Other earned rewards are shown separately.

Reloading the dashboard does not restart the countdown because it uses a saved end time. Enabled focus settings hide dashboard navigation and reduce animations. Select **Enable Audio Chime** to allow the optional audio cue, and ensure the tab and device are not muted. At five minutes remaining, the enabled visual reminder appears; at two minutes, the enabled audio cue and written reminder are triggered. Browser background throttling may delay reminders.

Select **End Session Early** and enter PIN **1234** to end the focused session. Session app links are hidden when it ends. Separate reward-app access is not revoked by ending a focused session.

### Child dashboard activity

**Child Dashboard Activity** on Parent Controls shows timestamped departures, returns, and app selections. Selecting an app such as Duolingo is recorded, and a departure shortly afterward includes the selected app's name. The list shows the newest records first, retains up to 200 events, and uses the viewing device's local time zone.

Activity updates between open tabs on the same browser profile and site. Parents can also review saved history after signing in later. Opening an allowed app, changing tabs, switching applications, or focusing browser controls can register as leaving the dashboard. The browser cannot identify an unrelated destination app or website. Crashes and forced termination cannot reliably be recorded.

### Reset Demo

**Reset Demo** on Parent Controls clears rewards, playtime balances and timers, setup profiles, child sessions, saved routines, activity history, and the current tab's routine draft. It resets reward selection while preserving registered accounts. Use it to prepare a new demonstration scenario.

## Implementation limitations

- This is a front-end prototype without a backend server, shared database, or device-management service. Account checks run in the browser; there is no server-side authentication.
- Data is stored in browser local storage and session storage. It does not synchronize between browsers or devices, and clearing browser data removes it.
- Routines are assigned to child accounts, but direct rewards and focused-session data are shared prototype state rather than isolated per child.
- Password hashing, role checks, and the fixed demo PIN are not production security. Browser developer tools can modify or bypass this prototype's state.
- App restrictions control dashboard links only. The website cannot block external sites, close tabs, or stop an external app when a timer ends.
- Routine task choices are predefined; Add Custom Task is a placeholder. Custom Reward is also a placeholder.
- Daily schedules are descriptive saved settings, not automatic recurring execution. Routine rewards are one-time per saved routine.

## Local testing

Optionally, to test the prototype locally, simply use Python 3 to host it

If Python 3 is already installed, open a terminal in the project root and run:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000/ and keep the terminal running. Press Ctrl+C to stop the server. Do not start it inside `Parents` or `Kids`, and do not open the HTML files directly with `file://`. Account checks require consistent browser storage and a secure context such as localhost or HTTPS. Localhost accounts and saved data are separate from those on GitHub Pages.
