import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './tests/browser', use: { baseURL: 'http://127.0.0.1:4321', launchOptions: { executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] } }, webServer: { command: 'npm run preview -- --port 4321', url: 'http://127.0.0.1:4321', reuseExistingServer: true } });
