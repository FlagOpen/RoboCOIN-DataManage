## 开发指南

### 代码组织

#### JavaScript模块

每个模块负责单一功能：

```javascript
// modules/config.js - 配置管理
import ConfigManager from './modules/config.js';
const config = ConfigManager.getConfig();

// modules/data-manager.js - 数据管理
import dataManager from './modules/data-manager.js';
await dataManager.loadDatasets();

// modules/filter-manager.js - 过滤器
import FilterManager from './modules/filter-manager.js';
const filterManager = new FilterManager(datasets);
```

#### CSS模块

样式按功能分离：

```css
/* variables.css - 变量 */
:root {
    --grid-gap: 1rem;
}

/* layout.css - 布局 */
.app-container {
    display: flex;
}

/* header.css - 头部 */
.header-container {
    background: linear-gradient(...);
}
```

### 添加新功能

1. **确定模块**: 功能属于哪个模块？
2. **添加方法**: 在模块中添加新方法
3. **类型注解**: 添加JSDoc注解
4. **集成调用**: 在app.js中集成
5. **测试验证**: 测试新功能

### 调试技巧

在浏览器控制台：

```javascript
// 访问应用实例
window.APP

// 查看数据集
APP.filterManager.datasets

// 查看选中项
APP.selectedDatasets

// 查看购物车
APP.listDatasets

// 手动触发过滤
document.dispatchEvent(new CustomEvent('filtersChanged'))
```

## 性能特性

### 虚拟滚动

支持渲染大量数据集而不影响性能：

- 视频网格：只渲染可见卡片
- 选择列表：只渲染可见项
- 动态计算可见范围
- 元素缓存复用

### 延迟加载

视频按需加载：

- IntersectionObserver监控
- 进入视口时加载
- 离开视口时暂停
- 预加载缓冲区

### 事件优化

- 事件委托（减少监听器）
- 防抖/节流（减少频繁调用）
- requestAnimationFrame（优化渲染）
- 批量DOM更新

## 配置

### CSS变量

在 `css/variables.css` 中修改配置：

```css
:root {
    --grid-min-card-width: 15.625rem; /* 卡片最小宽度 */
    --grid-card-height: 18.75rem;     /* 卡片高度 */
    --grid-gap: 1rem;                  /* 卡片间距 */
    --selection-item-height: 2.8125rem; /* 列表项高度 */
}
```

### JavaScript配置

配置通过CSS变量读取，无需修改JavaScript代码。

## 数据集资源结构

应用遵循标准化的资源目录结构：

```
docs/assets/
├── info/                      # JSON索引文件
│   ├── data_index.json              # 数据集名称列表
│   └── consolidated_datasets.json   # 合并的数据集元数据
│
├── dataset_info/              # YAML元数据文件（每个数据集一个）
│   ├── *.yml                  # YAML格式的数据集元数据
│   └── *.yaml                 # 备用YAML扩展名
│
└── videos/                    # MP4视频演示文件
    └── *.mp4                  # 按数据集路径命名的视频文件
```

### 数据集元数据格式

每个数据集在 `assets/dataset_info/` 中有对应的YAML文件：

```yaml
dataset_name: [任务名称]
dataset_uuid: [可选的UUID]
task_descriptions:
  - [描述文本]
scene_type:
  - [位置类别]
  - [具体位置]
atomic_actions:
  - [动作动词，如抓取、拾取、放置、擦拭]
objects:
  - object_name: [名称]
    level1: [类别]
    level2: [子类别]
    level3: [可选]
    level4: [可选]
    level5: [可选]
operation_platform_height: [高度（厘米）]
device_model:
  - [机器人型号名称]
end_effector_type: [夹爪类型]
```

### 路径配置

应用使用以下路径结构（在 `js/modules/config.js` 中定义）：

- **资源根目录**: `./assets`
- **信息文件**: `./assets/info`（JSON索引）
- **数据集信息**: `./assets/dataset_info`（YAML元数据）
- **视频**: `./assets/videos`（MP4文件）

## 常见问题

### Q: 为什么必须使用本地服务器？

A: 因为使用了ES6模块（`import/export`），浏览器的CORS策略要求通过HTTP协议访问。

### Q: 支持哪些浏览器？

A: 支持所有现代浏览器（Chrome 61+、Firefox 60+、Safari 11+、Edge 79+）。

### Q: 如何优化加载速度？

A: 确保存在 `assets/info/consolidated_datasets.json` 文件（单次请求替代2000+个YAML请求）。

### Q: 数据从哪里来？

A: 数据从 `assets/info/consolidated_datasets.json` 或 `assets/dataset_info/*.yaml` 加载。

## 更新日志

### v1.0 - 模块化重构 (2025-11-18)

**JavaScript重构：**
- ✅ 拆分为11个模块文件
- ✅ 添加完整JSDoc类型注解
- ✅ 使用ES6原生模块
- ✅ 降低91%的app.js代码量

**CSS重构：**
- ✅ 拆分为10个模块文件
- ✅ 完全模块化的样式组织
- ✅ 清晰的职责分离

**功能保持：**
- ✅ 100%向后兼容
- ✅ 所有功能正常
- ✅ 性能不降