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
        const searchQuery = document.getElementById('searchBox')?.value || '';
        const selectedFilters = this.filterManager.selectedFilters;
        
        // Calculate count for a specific filter option
        const calculateCountForOption = (filterKey, filterValue) => {
            const filterId = `${filterKey}:${filterValue}`;
            const isSelected = selectedFilters.has(filterId);
            
            // Create a temporary filter set with or without this option
            const tempFilters = new Set(selectedFilters);
            if (isSelected) {
                // Remove this filter to calculate "if deselected"
                tempFilters.delete(filterId);
            } else {
                // Add this filter to calculate "if selected"
                tempFilters.add(filterId);
            }
            
            // Apply filters with the temporary set
            const filters = {};
            tempFilters.forEach(fId => {
                const [key, value] = fId.split(':');
                if (!filters[key]) filters[key] = [];
                filters[key].push(value);
            });
            
            // Count matching datasets
            let count = 0;
            this.filterManager.datasets.forEach(ds => {
                // Apply search query filter
                if (searchQuery && !ds.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return;
                }
                
                // Apply filter conditions
                let matches = true;
                for (const [key, values] of Object.entries(filters)) {
                    let match = false;
                    
                    if (key === 'scene') {
                        match = ds.scenes && ds.scenes.some(v => values.includes(v));
                    } else if (key === 'robot') {
                        const robots = Array.isArray(ds.robot) ? ds.robot : [ds.robot];
                        match = robots.some(r => values.includes(r));
                    } else if (key === 'end') {
                        match = values.includes(ds.endEffector);
                    } else if (key === 'action') {
                        match = ds.actions && ds.actions.some(a => values.includes(a));
                    } else if (key === 'object') {
                        match = ds.objects && ds.objects.some(obj => 
                            obj.hierarchy.some(h => values.includes(h))
                        );
                    }
                    
                    if (!match) {
                        matches = false;
                        break;
                    }
                }
                
                if (matches) count++;
            });
            
            return count;
        };
        
        const counts = {};
        
        // Calculate counts for all filter options
        document.querySelectorAll('[data-count]').forEach(el => {
            const countKey = el.dataset.count;
            if (!countKey) return;
            
            // Get the filter option element that contains this count element
            const optionElement = el.closest('.filter-option');
            if (!optionElement) return;
            
            // Get filter key and value from the option element
            const filterKey = optionElement.dataset.filter;
            const filterValue = optionElement.dataset.value;
            
            // Only process if this is a selectable filter option (has both filter and value)
            if (filterKey && filterValue) {
                counts[countKey] = calculateCountForOption(filterKey, filterValue);
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

