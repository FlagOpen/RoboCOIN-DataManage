/**
 * @file Main Application Module
 * @description Coordinates all modules and manages application state
 */

/// <reference path="./types.js" />

import ConfigManager from './modules/config.js';
import dataManager from './modules/data-manager.js';
import FilterManager from './modules/filter-manager.js';
import VideoGridManager from './modules/video-grid.js';
import SelectionPanelManager from './modules/selection-panel.js';
import UIUtils from './modules/ui-utils.js';
import EventHandlers from './modules/event-handlers.js';

/**
 * Main Application Class
 */
class Application {
    constructor() {
        /** @type {Set<string>} */
        this.selectedDatasets = new Set();
        
        /** @type {Set<string>} */
        this.listDatasets = new Set();
        
        /** @type {Object|null} */
        this.config = null;
        
        /** @type {FilterManager|null} */
        this.filterManager = null;
        
        /** @type {VideoGridManager|null} */
        this.videoGridManager = null;
        
        /** @type {SelectionPanelManager|null} */
        this.selectionPanelManager = null;
        
        /** @type {UIUtils|null} */
        this.uiUtils = null;
        
        /** @type {EventHandlers|null} */
        this.eventHandlers = null;
    }
    
    /**
     * Initialize the application
     */
    async init() {
        try {
            // Show loading overlay
            const loadingOverlay = document.getElementById('loadingOverlay');
            loadingOverlay.classList.remove('hidden');
            
            // Initialize configuration
            this.config = ConfigManager.getConfig();
            
            // Load datasets
            const loadingProgress = document.getElementById('loadingProgress');
            const loadingBar = document.getElementById('loadingBar');
            await dataManager.loadDatasets(loadingProgress, loadingBar);
            
            // Build dataset index
            dataManager.buildDatasetIndex();
            
            // Initialize managers
            this.initializeManagers();
            
            // Build filter UI
            this.filterManager.buildFilterGroups();
            
            // Bind all events
            this.eventHandlers.bindEvents();
            
            // Setup filter change listener
            document.addEventListener('filtersChanged', () => {
                this.handleFiltersChanged();
            });
            
            // Initial render
            this.handleFiltersChanged();
            
            // Hide loading overlay
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 300);
            
            console.log('✓ Application initialized successfully');
            
        } catch (err) {
            console.error('Initialization failed:', err);
            alert('Failed to initialize application: ' + err.message);
            
            setTimeout(() => {
                document.getElementById('loadingOverlay').classList.add('hidden');
            }, 300);
        }
    }
    
    /**
     * Initialize all manager instances
     */
    initializeManagers() {
        // Filter Manager
        this.filterManager = new FilterManager(dataManager.getAllDatasets());
        
        // Video Grid Manager
        this.videoGridManager = new VideoGridManager(
            this.selectedDatasets,
            this.listDatasets
        );
        
        // Selection Panel Manager
        this.selectionPanelManager = new SelectionPanelManager(
            this.selectedDatasets,
            this.listDatasets,
            dataManager.datasetMap
        );
        
        // UI Utilities
        this.uiUtils = new UIUtils();
        
        // Event Handlers
        this.eventHandlers = new EventHandlers(
            {
                filter: this.filterManager,
                videoGrid: this.videoGridManager,
                selectionPanel: this.selectionPanelManager,
                ui: this.uiUtils
            },
            this.selectedDatasets,
            dataManager.datasetMap
        );
    }
    
    /**
     * Handle filters changed event
     */
    handleFiltersChanged() {
        const searchQuery = document.getElementById('searchBox')?.value || '';
        const filteredDatasets = this.filterManager.applyFilters(searchQuery);
        
        // Update counts
        this.uiUtils.updateCounts(filteredDatasets.length, this.selectedDatasets.size);
        
        // Update filter counts in UI
        this.updateFilterCounts(filteredDatasets);
        
        // Render video grid
        this.videoGridManager.renderVideoGrid(filteredDatasets);
        
        // Update selection panel
        this.selectionPanelManager.updateSelectionPanel();
    }
    
    /**
     * Update filter counts in UI
     * @param {Dataset[]} filteredDatasets - Filtered datasets
     */
    updateFilterCounts(filteredDatasets) {
        const counts = {};
        
        filteredDatasets.forEach(ds => {
            // Count scenes
            if (ds.scenes) {
                ds.scenes.forEach(scene => {
                    const countKey = `scene-${scene}`;
                    counts[countKey] = (counts[countKey] || 0) + 1;
                });
            }
            
            // Count robots
            if (ds.robot) {
                const robots = Array.isArray(ds.robot) ? ds.robot : [ds.robot];
                robots.forEach(robot => {
                    const countKey = `robot-${robot}`;
                    counts[countKey] = (counts[countKey] || 0) + 1;
                });
            }
            
            // Count end effectors
            if (ds.endEffector) {
                const countKey = `end-${ds.endEffector}`;
                counts[countKey] = (counts[countKey] || 0) + 1;
            }
            
            // Count actions
            if (ds.actions) {
                ds.actions.forEach(action => {
                    const countKey = `action-${action}`;
                    counts[countKey] = (counts[countKey] || 0) + 1;
                });
            }
            
            // Count objects (including hierarchy paths)
            if (ds.objects) {
                ds.objects.forEach(obj => {
                    obj.hierarchy.forEach(level => {
                        const fullPath = obj.hierarchy.slice(0, obj.hierarchy.indexOf(level) + 1).join('>');
                        const countKey = `object-${fullPath}`;
                        counts[countKey] = (counts[countKey] || 0) + 1;
                    });
                });
            }
        });
        
        // Set counts for "All" options
        ['scene', 'robot', 'end', 'action', 'object'].forEach(filterType => {
            counts[`${filterType}-__ALL__`] = filteredDatasets.length;
        });
        
        // Update DOM
        document.querySelectorAll('[data-count]').forEach(el => {
            const key = el.dataset.count;
            el.textContent = counts[key] || 0;
        });
    }
}

// Create and export singleton instance
const APP = new Application();
export default APP;

