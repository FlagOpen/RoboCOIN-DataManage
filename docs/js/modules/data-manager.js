/**
 * @file Data Manager Module
 * @description Handles dataset loading, caching, and indexing
 */

/// <reference path="../types.js" />

import ConfigManager from './config.js';

/**
 * Data Manager Class
 * Manages dataset loading, caching, and indexing
 */
export class DataManager {
    constructor() {
        /** @type {Dataset[]} */
        this.datasets = [];
        
        /** @type {Map<string, Dataset>} */
        this.datasetMap = new Map();
        
        /** @type {Object} */
        this.config = ConfigManager.getConfig();
    }
    
    /**
     * Load all datasets
     * @param {HTMLElement} loadingProgress - Loading progress element
     * @param {HTMLElement} loadingBar - Loading bar element
     * @returns {Promise<Dataset[]>} Loaded datasets
     */
    async loadDatasets(loadingProgress, loadingBar) {
        try {
            console.log('🚀 Attempting to load consolidated JSON (preferred)...');
            const startTime = performance.now();

            // Update initial progress
            loadingProgress.textContent = 'Loading consolidated data...';
            loadingBar.style.width = '10%';

            // PRIORITY: Always try consolidated JSON first (single request, much faster)
            try {
                console.log('📄 Fetching consolidated_datasets.json...');
                const res = await fetch(`${this.config.paths.info}/consolidated_datasets.json`);

                if (res.ok) {
                    console.log('✅ Consolidated JSON found! Processing...');
                    loadingBar.style.width = '50%';

                    const allData = await res.json();
                    loadingBar.style.width = '75%';

                    const datasetCount = Object.keys(allData).length;
                    console.log(`✓ Loaded ${datasetCount} datasets from consolidated JSON`);

                    // Convert consolidated data to dataset objects
                    this.datasets = Object.entries(allData).map(([path, raw]) => this.createDatasetObject(path, raw));

                    // Update progress to 100%
                    loadingProgress.textContent = `${this.datasets.length} datasets loaded`;
                    loadingBar.style.width = '100%';

                    const endTime = performance.now();
                    const loadTime = (endTime - startTime).toFixed(2);

                    console.log(`✓ Loaded ${this.datasets.length} datasets in ${loadTime}ms (${(loadTime / this.datasets.length).toFixed(2)}ms per dataset)`);
                    console.log('🎉 Using optimized consolidated JSON!');

                    return this.datasets;
                } else if (res.status === 404) {
                    console.warn('⚠️ Consolidated JSON not found (404). This is expected in development.');
                } else {
                    console.warn(`⚠️ Consolidated JSON request failed (${res.status}). Will try YAML fallback.`);
                }
            } catch (jsonError) {
                console.warn('⚠️ Failed to fetch consolidated JSON:', jsonError.message);
            }

            // FALLBACK: Use YAML mode if JSON is not available
            console.log('📁 Falling back to YAML mode...');
            loadingProgress.innerHTML = `
                <div style="color: #ff9800; font-weight: 600;">📁 Loading in YAML mode</div>
                <div style="font-size: 12px; margin-top: 4px;">Consolidated JSON not available. Loading from individual YAML files...</div>
            `;
            await this.loadDatasetsFromYAML(loadingProgress, loadingBar);
            return this.datasets;
            
            loadingBar.style.width = '50%';
            
            const allData = await res.json();
            loadingBar.style.width = '75%';
            
            const datasetCount = Object.keys(allData).length;
            console.log(`✓ Loaded ${datasetCount} datasets in consolidated format (optimized)`);
            
            // Convert consolidated data to dataset objects
            this.datasets = Object.entries(allData).map(([path, raw]) => this.createDatasetObject(path, raw));
            
            // Update progress to 100%
            loadingProgress.textContent = `${this.datasets.length} datasets loaded`;
            loadingBar.style.width = '100%';
            
            const endTime = performance.now();
            const loadTime = (endTime - startTime).toFixed(2);
            
            console.log(`✓ Loaded ${this.datasets.length} datasets in ${loadTime}ms (${(loadTime / this.datasets.length).toFixed(2)}ms per dataset)`);
            console.log('🎉 Optimization: Single JSON request vs 2000+ YAML requests!');
            
            return this.datasets;
            
        } catch (err) {
            console.error('Failed to load datasets:', err);
            throw err;
        }
    }
    
    /**
     * Create dataset object from raw data
     * @param {string} path - Dataset path
     * @param {Object} raw - Raw dataset data
     * @returns {Dataset} Dataset object
     */
    createDatasetObject(path, raw) {
        // 优先使用 raw.raw 部分的数据（如果存在），否则使用顶层数据
        // 这是因为很多数据集的顶层字段为空，但 raw 部分有正确数据
        const rawData = raw.raw || {};
        
        return {
            path: path,
            name: path || raw.dataset_name,
            video_url: `${this.config.paths.videos}/${path}.mp4`,
            // Thumbnails are provided directly from assets/thumbnails directory
            // No automatic thumbnail generation - thumbnails must exist in assets/thumbnails/${path}.jpg
            thumbnail_url: `${this.config.paths.assetsRoot}/thumbnails/${path}.jpg`,
            // 使用新字段 tasks（从 meta/tasks.jsonl 读取的精确任务描述）
            // 而非旧的 task_descriptions（YAML中可能包含错误）
            description: raw.tasks || (rawData.task_descriptions && rawData.task_descriptions[0]) || '',
            // 优先从 raw.raw 部分读取，因为顶层字段经常为空
            scenes: raw.scene_type && raw.scene_type.length > 0 ? raw.scene_type : (rawData.scene_type || []),
            actions: raw.atomic_actions && raw.atomic_actions.length > 0 ? raw.atomic_actions : (rawData.atomic_actions || []),
            objects: (function() {
                const topObjects = raw.objects || [];
                const rawObjects = rawData.objects || [];
                const objectsToUse = topObjects.length > 0 ? topObjects : rawObjects;
                return objectsToUse.map(obj => ({
                    name: obj.object_name,
                    hierarchy: [
                        obj.level1, 
                        obj.level2, 
                        obj.level3, 
                        obj.level4, 
                        obj.level5
                    ].filter(level => level !== null && level !== undefined),
                    raw: obj
                }));
            })(),
            // 使用新字段 robot_type（从 meta/info.json 读取）
            // 不使用旧的 device_model（YAML中的字段可能有错误）
            robot: raw.robot_type,
            endEffector: raw.end_effector_type || rawData.end_effector_type,
            platformHeight: raw.operation_platform_height !== undefined ? raw.operation_platform_height : rawData.operation_platform_height,

            // 数据集大小相关信息
            frameRange: raw.frame_range || rawData.frame_range,
            datasetSize: raw.dataset_size || rawData.dataset_size,
            statistics: raw.statistics || rawData.statistics,

            // Additional metadata
            cameras: raw.cameras || rawData.cameras || [],
            license: raw.license || rawData.license,
            tags: raw.tags || rawData.tags || [],
            robot_type: raw.robot_type || rawData.robot_type,

            // 扩展的元数据字段（用于详情弹出窗口）
            dataset_uuid: raw.dataset_uuid || rawData.dataset_uuid,
            language: raw.language || rawData.language || [],
            task_categories: raw.task_categories || rawData.task_categories || [],
            sub_tasks: raw.sub_tasks || rawData.sub_tasks || [],
            annotations: raw.annotations || rawData.annotations || {},
            authors: raw.authors || rawData.authors || {},
            homepage: raw.homepage || rawData.homepage,
            paper: raw.paper || rawData.paper,
            repository: raw.repository || rawData.repository,
            issues_url: raw.issues_url || rawData.issues_url,
            project_page: raw.project_page || rawData.project_page,
            contact_email: raw.contact_email || rawData.contact_email,
            contact_info: raw.contact_info || rawData.contact_info,
            support_info: raw.support_info || rawData.support_info,
            citation_bibtex: raw.citation_bibtex || rawData.citation_bibtex,
            additional_citations: raw.additional_citations || rawData.additional_citations,
            version_info: raw.version_info || rawData.version_info,
            codebase_version: raw.codebase_version || rawData.codebase_version,
            depth_enabled: raw.depth_enabled || rawData.depth_enabled,
            data_schema: raw.data_schema || rawData.data_schema,
            structure: raw.structure || rawData.structure,
            tasks: raw.tasks || rawData.tasks,

            raw: raw,
            getAllScenes: function() { return this.scenes; },
            hasScene: function(sceneType) { return this.scenes.includes(sceneType); },
            getObjectsByLevel: function(level, value) {
                return this.objects.filter(obj => obj.hierarchy[level - 1] === value);
            },
            getTopLevelCategories: function() {
                return [...new Set(this.objects.map(obj => obj.hierarchy[0]))];
            }
        };
    }
    
    /**
     * Load datasets from YAML files (fallback)
     * @param {HTMLElement} loadingProgress - Loading progress element
     * @param {HTMLElement} loadingBar - Loading bar element
     * @returns {Promise<void>}
     */
    async loadDatasetsFromYAML(loadingProgress, loadingBar) {
        try {
            loadingProgress.innerHTML = `
                <div style="color: #ff9800;">Loading data index...</div>
                <div style="font-size: 11px; margin-top: 4px; color: #666;">YAML mode active (slower than JSON mode)</div>
            `;
            loadingBar.style.width = '5%';
            
            const indexRes = await fetch(`${this.config.paths.info}/data_index.json`);
            if (!indexRes.ok) {
                throw new Error('data_index.json not found');
            }
            
            const indexData = await indexRes.json();
            const fileList = Array.isArray(indexData) ? indexData : Object.keys(indexData);
            
            loadingProgress.innerHTML = `
                <div style="color: #ff9800;">Loading ${fileList.length} YAML files...</div>
                <div style="font-size: 11px; margin-top: 4px; color: #666;">This may take a minute. Consider adding consolidated JSON for faster loading.</div>
            `;
            loadingBar.style.width = '10%';
            
            // Import js-yaml dynamically if needed
            if (typeof jsyaml === 'undefined') {
                loadingProgress.innerHTML = `
                    <div>Loading YAML parser...</div>
                    <div style="font-size: 11px; margin-top: 4px; color: #666;">One-time download from CDN</div>
                `;
                await this.loadJsYamlLibrary();
            }
            
            // Load YAML files one by one
            const allData = {};
            for (let i = 0; i < fileList.length; i++) {
                const file = fileList[i];
                const path = file.replace(/\.ya?ml$/, '');
                
                try {
                    const yamlRes = await fetch(`${this.config.paths.datasetInfo}/${file}`);
                    const yamlText = await yamlRes.text();
                    const parsed = jsyaml.load(yamlText);
                    allData[path] = parsed;
                    
                    // Update progress
                    const progress = 10 + (i / fileList.length) * 80;
                    loadingBar.style.width = `${progress}%`;
                    
                    if (i % 50 === 0 || i === fileList.length - 1) {
                        loadingProgress.innerHTML = `
                            <div style="color: #ff9800;">Loading YAML files: ${i + 1}/${fileList.length}</div>
                            <div style="font-size: 20px; font-weight: 700; margin-top: 8px; color: #ff9800; text-align: center;">${Math.round((i / fileList.length) * 100)}% complete</div>
                        `;
                    }
                } catch (err) {
                    console.warn(`Failed to load ${file}:`, err);
                }
            }
            
            loadingProgress.innerHTML = `
                <div style="color: #4caf50;">Processing datasets...</div>
                <div style="font-size: 11px; margin-top: 4px; color: #666;">Almost done!</div>
            `;
            loadingBar.style.width = '95%';
            
            // Convert to dataset objects (same as consolidated JSON flow)
            this.datasets = Object.entries(allData).map(([path, raw]) => this.createDatasetObject(path, raw));
            
            loadingProgress.innerHTML = `
                <div style="color: #4caf50; font-weight: 600;">✓ ${this.datasets.length} datasets loaded (YAML mode)</div>
                <div style="font-size: 11px; margin-top: 4px; color: #666;">Tip: Add consolidated JSON for faster loading next time</div>
            `;
            loadingBar.style.width = '100%';
            
            console.log(`✓ Loaded ${this.datasets.length} datasets from YAML files`);
            console.info('💡 Tip: Run scripts/opti_init.py to generate optimized files for faster loading');
            
        } catch (err) {
            console.error('Failed to load datasets from YAML:', err);
            throw err;
        }
    }
    
    /**
     * Load js-yaml library dynamically
     * @returns {Promise<void>}
     */
    async loadJsYamlLibrary() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * Build dataset index for fast lookups
     */
    buildDatasetIndex() {
        this.datasetMap.clear();
        this.datasets.forEach(ds => {
            this.datasetMap.set(ds.path, ds);
        });
        console.log('✓ Dataset index built:', this.datasetMap.size, 'items');
    }
    
    /**
     * Get dataset by path
     * @param {string} path - Dataset path
     * @returns {Dataset|undefined} Dataset object
     */
    getDataset(path) {
        return this.datasetMap.get(path);
    }
    
    /**
     * Get all datasets
     * @returns {Dataset[]} All datasets
     */
    getAllDatasets() {
        return this.datasets;
    }
    
    /**
     * Get datasets count
     * @returns {number} Number of datasets
     */
    getCount() {
        return this.datasets.length;
    }
}

// Export singleton instance
export default new DataManager();

