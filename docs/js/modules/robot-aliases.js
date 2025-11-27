/**
 * @file Robot Aliases Module
 * @description Lightweight manager for robot display names and search aliases.
 *              Loads a JSON dictionary of robot IDs -> { common_name, aliases[] }.
 */

class RobotAliasManager {
    constructor() {
        /**
         * @type {Object.<string, { common_name?: string, aliases?: string[] }>}
         */
        this.aliasMap = {};

        /** @type {boolean} */
        this.loaded = false;

        /** @type {Promise<Object>|null} */
        this.loadingPromise = null;
    }

    /**
     * Load alias map from JSON file.
     * @param {import('./config.js').ConfigManager['getConfig'] extends () => infer C ? C : any} config
     *        Application config with paths.info.
     * @returns {Promise<Object>} Loaded alias map object
     */
    async load(config) {
        if (this.loaded) {
            return this.aliasMap;
        }
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        const infoPath = config?.paths?.info || './assets/info';
        const url = `${infoPath}/robot_aliases.json`;

        this.loadingPromise = (async () => {
            try {
                const res = await fetch(url);
                if (!res.ok) {
                    console.warn(`[RobotAliasManager] Alias file not found at ${url}. Status: ${res.status}`);
                    this.aliasMap = {};
                } else {
                    const data = await res.json();
                    if (data && typeof data === 'object') {
                        this.aliasMap = data;
                    } else {
                        this.aliasMap = {};
                    }
                }
            } catch (err) {
                console.warn('[RobotAliasManager] Failed to load robot_aliases.json:', err);
                this.aliasMap = {};
            } finally {
                this.loaded = true;
            }

            return this.aliasMap;
        })();

        return this.loadingPromise;
    }

    /**
     * Get raw alias entry for a robot ID.
     * @param {string} robotId
     * @returns {{ common_name?: string, aliases?: string[] } | null}
     */
    getAliasEntry(robotId) {
        if (!robotId) return null;
        return this.aliasMap[robotId] || null;
    }

    /**
     * Get preferred display name for a robot.
     * Falls back to the original ID when no alias is configured.
     * @param {string} robotId
     * @returns {string}
     */
    getDisplayName(robotId) {
        if (!robotId) return '';
        const entry = this.getAliasEntry(robotId);
        return (entry && entry.common_name) || robotId;
    }

    /**
     * Build a list of search tokens for a robot entry:
     * - Original ID
     * - common_name (if present)
     * - All aliases (if present)
     * @param {string} robotId
     * @returns {string[]} Tokens for search
     */
    getSearchTokensForRobot(robotId) {
        const tokens = [];
        if (!robotId) return tokens;

        const idStr = String(robotId);
        tokens.push(idStr);

        const entry = this.getAliasEntry(idStr);
        if (entry) {
            if (entry.common_name) {
                tokens.push(String(entry.common_name));
            }
            if (Array.isArray(entry.aliases)) {
                entry.aliases.forEach(alias => {
                    if (alias) {
                        tokens.push(String(alias));
                    }
                });
            }
        }

        return tokens;
    }
}

// Export singleton instance
const instance = new RobotAliasManager();
export default instance;


