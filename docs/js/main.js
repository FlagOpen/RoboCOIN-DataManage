/**
 * @file Main Entry Point
 * @description Application entry point with error handling
 */

import APP from './app.js';

/**
 * Initialize application when DOM is ready
 */
function initApp() {
    try {
        APP.init();
    } catch (error) {
        console.error('Failed to initialize application:', error);
        alert('Application initialization failed. Please refresh the page.');
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

