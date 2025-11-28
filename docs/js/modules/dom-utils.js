/**
 * @file DOM Utilities
 * @description Shared helpers for DOM querying, class manipulation and events.
 * @note Keep this file free of business logic; only generic helpers belong here.
 */

/**
 * Query single element.
 * @param {string} selector
 * @param {ParentNode} [root=document]
 * @returns {HTMLElement|null}
 */
export function qs(selector, root = document) {
    return /** @type {HTMLElement|null} */ (root.querySelector(selector));
}

/**
 * Query multiple elements.
 * @param {string} selector
 * @param {ParentNode} [root=document]
 * @returns {NodeListOf<HTMLElement>}
 */
export function qsa(selector, root = document) {
    return /** @type {NodeListOf<HTMLElement>} */ (root.querySelectorAll(selector));
}

/**
 * Add class to element (safe).
 * @param {Element|null} el
 * @param {string} className
 */
export function addClass(el, className) {
    if (el && el.classList) {
        el.classList.add(className);
    }
}

/**
 * Remove class from element (safe).
 * @param {Element|null} el
 * @param {string} className
 */
export function removeClass(el, className) {
    if (el && el.classList) {
        el.classList.remove(className);
    }
}

/**
 * Toggle class on element (safe).
 * @param {Element|null} el
 * @param {string} className
 * @param {boolean} [force]
 */
export function toggleClass(el, className, force) {
    if (el && el.classList) {
        if (typeof force === 'boolean') {
            el.classList.toggle(className, force);
        } else {
            el.classList.toggle(className);
        }
    }
}

/**
 * Set text content if element exists.
 * @param {Element|null} el
 * @param {string} text
 */
export function setText(el, text) {
    if (el) {
        el.textContent = text;
    }
}

/**
 * Set innerHTML if element exists.
 * @param {Element|null} el
 * @param {string} html
 */
export function setHTML(el, html) {
    if (el) {
        el.innerHTML = html;
    }
}

/**
 * Clear children from an element.
 * @param {Element|null} el
 */
export function clearChildren(el) {
    if (!el) return;
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
}

/**
 * Add event listener with safe guard.
 * @param {Element|null} el
 * @param {string} type
 * @param {EventListenerOrEventListenerObject} handler
 * @param {boolean|AddEventListenerOptions} [options]
 */
export function on(el, type, handler, options) {
    if (el) {
        el.addEventListener(type, handler, options);
    }
}

/**
 * Event delegation helper.
 * @param {Element|null} root
 * @param {string} selector
 * @param {string} type
 * @param {(event: Event, matched: Element) => void} handler
 */
export function delegate(root, selector, type, handler) {
    if (!root) return;
    root.addEventListener(type, (event) => {
        const target = /** @type {Element|null} */ (event.target instanceof Element ? event.target : null);
        if (!target) return;
        const matched = target.closest(selector);
        if (matched && root.contains(matched)) {
            handler(event, matched);
        }
    });
}

export default {
    qs,
    qsa,
    addClass,
    removeClass,
    toggleClass,
    setText,
    setHTML,
    clearChildren,
    on,
    delegate
};


