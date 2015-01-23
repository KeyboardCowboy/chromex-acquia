# ![Acquia Cloud Logo](https://raw.githubusercontent.com/KeyboardCowboy/chromex-acquia/master/acquia_cloud.png) Acquia Cloud Process Monitor
Google Chrome extension for Acquia Cloud to create notifications as processes change state.

## Usage
1. Download this repo.
2. Open Chrome Extensions in the browser.
3. Enable developer mode.
4. Load unpacked extension.
5. Choose the directory you downloaded this repo into.
6. Open your Acquia Cloud UI in a tab
7. Initiate a process.

You should see a Chrome notification with the process state.  As the state
changes (i.e. it finishes or fails) another notification will be generated.

## Roadmap
- Use the extension button to show a list of current, active processes.
- Hook into Acquia's API instead of polling the tab's DOM.
