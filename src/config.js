// Centralized configuration for the app
export const SHEET_BASE = 'sheets/sheet.json';
export const DEFAULT_BASE_URL = './';

// Git defaults (can be overridden in the UI and stored in sessionStorage)
export const GIT_OWNER = '';
export const GIT_REPO = '';
export const GIT_BRANCH = 'main';
export const GIT_TOKEN = ''; // intentionally empty; users should provide their PAT
