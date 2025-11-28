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

