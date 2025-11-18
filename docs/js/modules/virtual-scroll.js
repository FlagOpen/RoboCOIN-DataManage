/**
 * @file Virtual Scroll Utilities
 * @description Utilities for implementing efficient virtual scrolling
 */

/// <reference path="../types.js" />

/**
 * Calculate visible range for virtual scrolling
 * @param {number} scrollTop - Current scroll position
 * @param {number} containerHeight - Container height
 * @param {number} itemHeight - Height of each item
 * @param {number} totalItems - Total number of items
 * @param {number} bufferItems - Number of buffer items before/after visible area
 * @returns {VirtualScrollState} Virtual scroll state
 */
export function calculateVisibleRange(scrollTop, containerHeight, itemHeight, totalItems, bufferItems = 5) {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferItems);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(totalItems, startIndex + visibleCount + bufferItems * 2);
    
    return {
        scrollTop,
        containerHeight,
        itemHeight,
        startIndex,
        endIndex,
        totalItems
    };
}

/**
 * Calculate grid layout parameters
 * @param {number} gridWidth - Grid container width
 * @param {number} minCardWidth - Minimum card width
 * @param {number} gap - Gap between items
 * @returns {GridLayoutParams} Grid layout parameters
 */
export function calculateGridLayout(gridWidth, minCardWidth, gap) {
    const itemsPerRow = Math.max(1, Math.floor((gridWidth + gap) / (minCardWidth + gap)));
    const cardWidth = Math.floor((gridWidth - gap * (itemsPerRow - 1)) / itemsPerRow);
    
    return {
        gridWidth,
        cardWidth,
        itemsPerRow,
        gap
    };
}

/**
 * Element cache for virtual scrolling
 * Manages DOM element reuse to improve performance
 */
export class ElementCache {
    constructor() {
        /** @type {Map<string, HTMLElement>} */
        this.cache = new Map();
    }
    
    /**
     * Get element from cache
     * @param {string} key - Cache key
     * @returns {HTMLElement|undefined} Cached element
     */
    get(key) {
        return this.cache.get(key);
    }
    
    /**
     * Set element in cache
     * @param {string} key - Cache key
     * @param {HTMLElement} element - Element to cache
     */
    set(key, element) {
        this.cache.set(key, element);
    }
    
    /**
     * Check if key exists in cache
     * @param {string} key - Cache key
     * @returns {boolean} True if key exists
     */
    has(key) {
        return this.cache.has(key);
    }
    
    /**
     * Delete element from cache
     * @param {string} key - Cache key
     * @returns {boolean} True if element was deleted
     */
    delete(key) {
        return this.cache.delete(key);
    }
    
    /**
     * Clear all cached elements
     */
    clear() {
        this.cache.clear();
    }
    
    /**
     * Get cache size
     * @returns {number} Number of cached elements
     */
    get size() {
        return this.cache.size;
    }
}

/**
 * Update element positions for virtual scrolling
 * @param {HTMLElement[]} elements - Elements to position
 * @param {number} startIndex - Start index
 * @param {number} itemHeight - Item height
 * @param {number} itemWidth - Item width
 * @param {number} itemsPerRow - Items per row (for grid layout)
 * @param {number} gap - Gap between items
 */
export function updateElementPositions(elements, startIndex, itemHeight, itemWidth, itemsPerRow = 1, gap = 0) {
    elements.forEach((element, i) => {
        const globalIndex = startIndex + i;
        
        if (itemsPerRow > 1) {
            // Grid layout
            const row = Math.floor(globalIndex / itemsPerRow);
            const col = globalIndex % itemsPerRow;
            element.style.position = 'absolute';
            element.style.left = `${col * (itemWidth + gap)}px`;
            element.style.top = `${row * itemHeight}px`;
        } else {
            // List layout
            element.style.position = 'absolute';
            element.style.top = `${globalIndex * itemHeight}px`;
        }
    });
}

/**
 * Remove elements not in visible set
 * @param {HTMLElement} container - Container element
 * @param {Set<string>} visibleKeys - Set of visible keys
 * @param {ElementCache} cache - Element cache
 * @param {string} selector - Element selector
 */
export function removeInvisibleElements(container, visibleKeys, cache, selector) {
    const existingElements = container.querySelectorAll(selector);
    existingElements.forEach(element => {
        const key = element.dataset.path || element.dataset.key;
        if (!visibleKeys.has(key)) {
            element.remove();
            cache.delete(key);
        }
    });
}

/**
 * Create virtual container with proper height
 * @param {number} totalItems - Total number of items
 * @param {number} itemHeight - Height of each item
 * @returns {HTMLElement} Virtual container element
 */
export function createVirtualContainer(totalItems, itemHeight) {
    const container = document.createElement('div');
    container.className = 'virtual-container';
    container.style.position = 'relative';
    container.style.height = `${totalItems * itemHeight}px`;
    return container;
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

