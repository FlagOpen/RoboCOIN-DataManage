/**
 * @file Event Handlers Module
 * @description Centralizes all event binding and handling logic
 */

/// <reference path="../types.js" />

import ConfigManager from './config.js';
import { debounce } from './virtual-scroll.js';

/**
 * Event Handlers Manager Class
 */
export class EventHandlers {
    /**
     * @param {Object} managers - Object containing all manager instances
     * @param {Object} managers.filter - Filter manager
     * @param {Object} managers.videoGrid - Video grid manager
     * @param {Object} managers.selectionPanel - Selection panel manager
     * @param {Object} managers.ui - UI utilities
     * @param {Set<string>} selectedDatasets - Selected dataset paths
     * @param {Map<string, Dataset>} datasetMap - Dataset map
     */
    constructor(managers, selectedDatasets, datasetMap) {
        this.managers = managers;
        this.selectedDatasets = selectedDatasets;
        this.datasetMap = datasetMap;
        this.config = ConfigManager.getConfig();
    }
    
    /**
     * Bind all events
     */
    bindEvents() {
        this.bindFilterEvents();
        this.bindVideoGridEvents();
        this.bindSelectionListEvents();
        this.bindToolbarEvents();
        this.bindResizeEvents();
        this.bindScrollEvents();
    }
    
    /**
     * Bind filter-related events
     */
    bindFilterEvents() {
        // Search box (debounced)
        const searchBox = document.getElementById('searchBox');
        if (searchBox) {
            searchBox.addEventListener('input', debounce(() => {
                document.dispatchEvent(new CustomEvent('filtersChanged'));
            }, 150));
        }
        
        // Filter dropdown events
        const filterTriggerBtn = document.getElementById('filterTriggerBtn');
        const filterDropdownClose = document.getElementById('filterDropdownClose');
        const filterDropdownOverlay = document.getElementById('filterDropdownOverlay');
        
        if (filterTriggerBtn) {
            filterTriggerBtn.addEventListener('click', () => {
                this.managers.ui.openFilterDropdown();
            });
        }
        
        if (filterDropdownClose) {
            filterDropdownClose.addEventListener('click', () => {
                this.managers.ui.closeFilterDropdown();
            });
        }
        
        if (filterDropdownOverlay) {
            filterDropdownOverlay.addEventListener('click', (e) => {
                if (e.target.id === 'filterDropdownOverlay') {
                    this.managers.ui.closeFilterDropdown();
                }
            });
        }
        
        // Reset filters button
        const resetFiltersBtn = document.getElementById('resetFiltersBtn');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                document.getElementById('searchBox').value = '';
                this.managers.filter.resetFilters();
                document.dispatchEvent(new CustomEvent('filtersChanged'));
            });
        }
        
        // Hub selection
        const hubSelect = document.getElementById('hubSelect');
        if (hubSelect) {
            hubSelect.addEventListener('change', (e) => {
                this.managers.selectionPanel.setHub(e.target.value);
            });
        }
    }
    
    /**
     * Bind video grid events (event delegation)
     */
    bindVideoGridEvents() {
        const grid = document.getElementById('videoGrid');
        if (!grid) return;
        
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Event delegation: click on video-card
        grid.addEventListener('click', (e) => {
            if (e.target.tagName === 'VIDEO') return;
            
            const card = e.target.closest('.video-card');
            if (!card) return;
            
            const path = card.dataset.path;
            if (!path) return;
            
            // Touch device overlay handling
            const overlay = e.target.closest('.video-hover-overlay');
            if (isTouchDevice && overlay) {
                overlay.classList.remove('touch-active');
                return;
            }
            
            if (isTouchDevice) {
                const cardOverlay = card.querySelector('.video-hover-overlay');
                if (cardOverlay && !cardOverlay.classList.contains('touch-active')) {
                    document.querySelectorAll('.video-hover-overlay.touch-active').forEach(o => {
                        o.classList.remove('touch-active');
                    });
                    cardOverlay.classList.add('touch-active');
                    return;
                }
            }
            
            this.toggleSelection(path);
        });
        
        // Video load error handling
        grid.addEventListener('error', (e) => {
            if (e.target.tagName === 'VIDEO') {
                const card = e.target.closest('.video-card');
                if (card) {
                    const errorDiv = card.querySelector('.video-error');
                    if (errorDiv) errorDiv.style.display = 'block';
                }
            }
        }, true);
        
        // Touch device: close overlays when clicking outside
        if (isTouchDevice) {
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.video-card')) {
                    document.querySelectorAll('.video-hover-overlay.touch-active').forEach(o => {
                        o.classList.remove('touch-active');
                    });
                }
            });
        }
    }
    
    /**
     * Bind selection list events (event delegation)
     */
    bindSelectionListEvents() {
        const list = document.getElementById('selectionList');
        if (!list) return;
        
        let hoverTimer = null;
        let currentHoverPath = null;
        
        // Click events
        list.addEventListener('click', (e) => {
            const item = e.target.closest('.selection-item');
            if (!item) return;
            
            const path = item.dataset.path;
            if (!path) return;
            
            // Remove button
            if (e.target.closest('.btn-remove')) {
                e.stopPropagation();
                this.managers.selectionPanel.listDatasets.delete(path);
                this.managers.selectionPanel.markListChanged();
                this.managers.videoGrid.updateCardStyles();
                this.managers.selectionPanel.updateSelectionPanel();
                return;
            }
            
            // Detail button
            if (e.target.closest('.btn-detail')) {
                e.stopPropagation();
                this.managers.ui.showDetailModal(path, this.datasetMap);
                return;
            }
            
            // Toggle selection
            if (this.selectedDatasets.has(path)) {
                this.selectedDatasets.delete(path);
            } else {
                this.selectedDatasets.add(path);
            }
            this.managers.videoGrid.updateCardStyles();
            this.managers.selectionPanel.updateSelectionPanel();
        });
        
        // Hover preview
        list.addEventListener('mouseenter', (e) => {
            const item = e.target.closest('.selection-item');
            if (!item) return;
            
            const path = item.dataset.path;
            if (!path) return;
            
            if (e.target.closest('.btn-detail, .btn-remove')) {
                return;
            }
            
            if (hoverTimer) {
                clearTimeout(hoverTimer);
            }
            
            currentHoverPath = path;
            
            hoverTimer = setTimeout(() => {
                if (currentHoverPath === path) {
                    this.managers.ui.showHoverPreview(path, item, this.datasetMap);
                }
            }, this.config.timing.hoverDelay);
        }, true);
        
        list.addEventListener('mouseleave', (e) => {
            const item = e.target.closest('.selection-item');
            if (!item) return;
            
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
            
            currentHoverPath = null;
            
            const relatedTarget = e.relatedTarget;
            const previewCard = document.getElementById('hoverPreviewCard');
            
            if (!previewCard || !previewCard.contains(relatedTarget)) {
                this.managers.ui.hideHoverPreview();
            }
        }, true);
    }
    
    /**
     * Bind toolbar button events
     */
    bindToolbarEvents() {
        // Select/Deselect all
        const selectAllBtn = document.getElementById('selectAllBtn');
        const deselectAllBtn = document.getElementById('deselectAllBtn');
        
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                this.selectAllFiltered();
            });
        }
        
        if (deselectAllBtn) {
            deselectAllBtn.addEventListener('click', () => {
                this.deselectAllFiltered();
            });
        }
        
        // Cart actions
        const addToListBtn = document.getElementById('addToListBtn');
        const deleteFromListBtn = document.getElementById('deleteFromListBtn');
        const clearListBtn = document.getElementById('clearListBtn');
        
        if (addToListBtn) {
            addToListBtn.addEventListener('click', () => {
                this.managers.selectionPanel.addToList();
                this.managers.videoGrid.updateCardStyles();
                this.managers.selectionPanel.updateSelectionPanel();
            });
        }
        
        if (deleteFromListBtn) {
            deleteFromListBtn.addEventListener('click', () => {
                this.managers.selectionPanel.deleteFromList();
                this.managers.videoGrid.updateCardStyles();
                this.managers.selectionPanel.updateSelectionPanel();
            });
        }
        
        if (clearListBtn) {
            clearListBtn.addEventListener('click', () => {
                this.managers.selectionPanel.clearList();
                this.managers.videoGrid.updateCardStyles();
                this.managers.selectionPanel.updateSelectionPanel();
            });
        }
        
        // Import/Export
        const importBtn = document.getElementById('importBtn');
        const importFile = document.getElementById('importFile');
        const exportBtn = document.getElementById('exportBtn');
        const copyCodeBtn = document.getElementById('copyCodeBtn');
        
        if (importBtn) {
            importBtn.addEventListener('click', () => {
                importFile.click();
            });
        }
        
        if (importFile) {
            importFile.addEventListener('change', (e) => {
                this.managers.selectionPanel.handleImportFile(e, this.managers.filter.datasets);
                this.managers.videoGrid.updateCardStyles();
                this.managers.selectionPanel.updateSelectionPanel();
            });
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.managers.selectionPanel.exportSelection();
            });
        }
        
        if (copyCodeBtn) {
            copyCodeBtn.addEventListener('click', () => {
                this.managers.selectionPanel.copyCode();
            });
        }
    }
    
    /**
     * Bind window resize events
     */
    bindResizeEvents() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const filteredDatasets = this.managers.filter.applyFilters(
                    document.getElementById('searchBox')?.value || ''
                );
                this.managers.videoGrid.renderVideoGrid(filteredDatasets);
            }, 200);
        });
    }
    
    /**
     * Bind scroll events for virtual scrolling
     */
    bindScrollEvents() {
        // Video grid scroll
        const gridContainer = document.querySelector('.video-grid-container');
        if (gridContainer) {
            let videoScrollTicking = false;
            
            gridContainer.addEventListener('scroll', () => {
                if (!videoScrollTicking) {
                    window.requestAnimationFrame(() => {
                        const filteredDatasets = this.managers.filter.applyFilters(
                            document.getElementById('searchBox')?.value || ''
                        );
                        this.managers.videoGrid.renderVideoGrid(filteredDatasets);
                        videoScrollTicking = false;
                    });
                    videoScrollTicking = true;
                }
            });
        }
        
        // Selection list scroll
        const selectionList = document.getElementById('selectionList');
        if (selectionList) {
            let selectionScrollTicking = false;
            
            selectionList.addEventListener('scroll', () => {
                if (!selectionScrollTicking) {
                    window.requestAnimationFrame(() => {
                        this.managers.selectionPanel.updateSelectionPanel();
                        selectionScrollTicking = false;
                    });
                    selectionScrollTicking = true;
                }
            });
        }
    }
    
    /**
     * Toggle dataset selection
     * @param {string} path - Dataset path
     */
    toggleSelection(path) {
        if (this.selectedDatasets.has(path)) {
            this.selectedDatasets.delete(path);
        } else {
            this.selectedDatasets.add(path);
        }
        this.managers.videoGrid.updateCardStyles();
        this.managers.selectionPanel.updateSelectionPanel();
    }
    
    /**
     * Select all filtered datasets
     */
    selectAllFiltered() {
        const filteredDatasets = this.managers.filter.applyFilters(
            document.getElementById('searchBox')?.value || ''
        );
        filteredDatasets.forEach(ds => {
            this.selectedDatasets.add(ds.path);
        });
        this.managers.videoGrid.updateCardStyles();
        this.managers.selectionPanel.updateSelectionPanel();
    }
    
    /**
     * Deselect all filtered datasets
     */
    deselectAllFiltered() {
        const filteredDatasets = this.managers.filter.applyFilters(
            document.getElementById('searchBox')?.value || ''
        );
        filteredDatasets.forEach(ds => {
            this.selectedDatasets.delete(ds.path);
        });
        this.managers.videoGrid.updateCardStyles();
        this.managers.selectionPanel.updateSelectionPanel();
    }
}

export default EventHandlers;

