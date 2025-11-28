/**
 * @file Main Entry Point
 * @description Application entry point with error handling
 */

import APP from './app.js';
import ErrorNotifier from './modules/error-notifier.js';

/**
 * Initialize application when DOM is ready
 */
function initApp() {
    try {
        APP.init();
    } catch (error) {
        ErrorNotifier.error('Application initialization failed. Please refresh the page.', error);
    }
}

// Ensure DOM is fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for debugging
if (typeof window !== 'undefined') {
    window.APP = APP;
}

