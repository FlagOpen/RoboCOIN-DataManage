[English](README.md) | **中文**

# RoboCOIN DataManager

https://flagopen.github.io/RoboCOIN-DataManager/

**版本：** v1.1

## 项目概述

RoboCOIN数据集可视化和下载工具，支持高级筛选、预览、选择和导出数据集。采用现代化响应式界面，通过虚拟滚动技术高效处理大型数据集。

## 项目结构

```
DataManage/
├── docs/
│   ├── assets/                 # 资源文件
│   │   ├── dataset_info/       # 数据集元信息（266个YAML文件）
│   │   ├── info/               # 索引文件
│   │   │   ├── consolidated_datasets.json  # 合并的数据集信息
│   │   │   ├── data_index.json             # 数据集索引
│   │   │   └── robot_aliases.json          # 机器人显示名称映射
│   │   ├── thumbnails/         # 缩略图文件（*.jpg）
│   │   └── videos/             # 视频文件（*.mp4）
│   │
│   ├── css/                    # 模块化样式文件
│   │   ├── core/               # 核心样式
│   │   │   ├── variables.css   # CSS变量定义
│   │   │   ├── base.css        # 基础样式
│   │   │   ├── layout.css      # 布局样式
│   │   │   └── header.css      # 头部样式
│   │   ├── filter/             # 过滤器组件样式
│   │   │   ├── filter-control-bar.css
│   │   │   ├── filter-dropdown.css
│   │   │   ├── filter-options.css
│   │   │   └── filter-tooltip.css
│   │   ├── video/              # 视频组件样式
│   │   │   ├── video-card.css
│   │   │   ├── video-grid.css
│   │   │   ├── video-hover-overlay.css
│   │   │   ├── video-info.css
│   │   │   ├── video-panel.css
│   │   │   ├── video-thumbnail.css
│   │   │   └── video-toolbar.css
│   │   ├── selection/          # 选择面板样式
│   │   │   ├── selection-panel-base.css
│   │   │   ├── selection-list.css
│   │   │   ├── selection-item.css
│   │   │   ├── selection-footer.css
│   │   │   └── selection-hub-buttons.css
│   │   ├── components/         # 可复用组件
│   │   │   ├── modal.css
│   │   │   └── toast.css
│   │   ├── animations/         # 动画定义
│   │   │   └── animations.css
│   │   ├── responsive/         # 响应式设计
│   │   │   ├── responsive-desktop.css
│   │   │   ├── responsive-tablet.css
│   │   │   ├── responsive-mobile.css
│   │   │   └── responsive-print.css
│   │   └── style.css           # CSS入口文件
│   │
│   ├── js/                     # 模块化JavaScript文件
│   │   ├── modules/            # 功能模块
│   │   │   ├── @filter/        # 过滤器模块组
│   │   │   │   ├── filter-manager.js
│   │   │   │   ├── filter-renderer.js
│   │   │   │   ├── filter-state.js
│   │   │   │   ├── filter-search.js
│   │   │   │   ├── filter-hierarchy.js
│   │   │   │   ├── data.js
│   │   │   │   └── index.js
│   │   │   ├── config.js       # 配置管理
│   │   │   ├── data-manager.js # 数据管理
│   │   │   ├── video-grid.js   # 视频网格（支持虚拟滚动）
│   │   │   ├── selection-panel.js # 选择面板（支持虚拟滚动）
│   │   │   ├── download-manager.js # 下载命令生成
│   │   │   ├── robot-aliases.js # 机器人名称别名管理
│   │   │   ├── ui-utils.js     # UI工具
│   │   │   ├── event-handlers.js # 事件处理
│   │   │   ├── virtual-scroll.js # 虚拟滚动工具
│   │   │   ├── dom-utils.js    # DOM操作工具
│   │   │   ├── error-notifier.js # 错误处理
│   │   │   └── toast-manager.js # 提示通知
│   │   ├── app.js              # 主应用协调器
│   │   ├── main.js             # 应用入口文件
│   │   ├── templates.js        # HTML模板生成器
│   │   └── types.js            # TypeScript类型定义
│   │
│   ├── index.html              # 主页面
│   ├── favicon.ico             # 网站图标
│   ├── README.md               # 项目文档（英文）
│   └── README.zh.md            # 项目文档（中文）
│
└── README.md                   # 根目录说明
```

## 核心特性

### 1. 高级数据集筛选
- **多维度筛选**：场景、机器人、末端执行器、动作、操作对象
- **层级式过滤器**：支持对象层级结构，可展开/折叠分组
- **Filter Finder（筛选项搜索）**：
  - 按 `Ctrl+F` 或点击筛选面板中的搜索框
  - 输入关键词搜索筛选项
  - 使用 ↑/↓ 方向键或导航按钮在匹配项间移动
  - 自动高亮匹配的选项
- **实时数据集搜索**：在主搜索框中按名称搜索数据集
- **筛选状态管理**：显示活动筛选器数量，一键重置
- **机器人别名支持**：为机器人型号提供友好的显示名称

### 2. 丰富的数据集预览
- **悬停自动播放视频**：鼠标悬停在卡片上时自动播放视频
- **悬停信息层**：快速预览数据集元信息
- **详情模态框**：完整的数据集信息，包括：
  - 数据集元数据（场景、机器人、动作、对象）
  - 版本信息
  - 代码库版本
  - 下载链接
- **缩略图加载**：快速显示缩略图，便于浏览
- **视频控制**：视频卡片中的播放/暂停控制

### 3. 选择和管理
- **多选支持**：点击卡片选择/取消选择多个数据集
- **批量操作**：
  - 选择所有筛选后的数据集
  - 取消选择所有数据集
  - 将选中项添加到购物车
  - 从购物车移除选中项
  - 清空整个购物车
- **购物车（批量下载器）**：
  - 支持虚拟滚动，处理大量选择
  - 单独移除项目
  - 实时更新计数
- **选择状态保持**：在筛选过程中保持选择状态

### 4. 导出和下载
- **JSON导出/导入**：
  - 将选择列表导出为JSON文件
  - 导入之前保存的选择
- **Python下载命令生成**：
  - 生成即用的下载命令
  - 支持ModelScope和HuggingFace两个Hub
  - 一键复制到剪贴板
  - 支持批量下载多个数据集

### 5. 性能优化
- **虚拟滚动**：
  - 高效渲染大型数据集（266+个数据集）
  - 应用于视频网格和选择面板
  - 元素缓存和复用
- **延迟加载**：
  - 仅在可见时加载视频
  - 基于IntersectionObserver的优化
  - 带进度指示器的渐进式加载
- **优化渲染**：
  - 最小化DOM操作
  - 高效的事件处理
  - 流畅的动画和过渡效果

### 6. 用户体验
- **响应式设计**：
  - 桌面、平板和移动端布局
  - 打印友好样式
  - 自适应UI组件
- **加载指示器**：
  - 数据集加载时的进度条
  - 带旋转器的加载覆盖层
  - 数据集计数显示
- **提示通知**：
  - 成功/错误反馈
  - 非侵入式通知
- **全局横幅**：
  - 重要公告
  - 交互时自动关闭
- **键盘快捷键**：
  - Ctrl+F 打开Filter Finder
  - 方向键导航

## 快速开始

### 浏览器要求

- Chrome/Edge 61+
- Firefox 60+
- Safari 11+
- Opera 48+

（支持ES6模块的现代浏览器）

## 使用指南

### 1. 筛选数据集

点击 **"Filter datasets"** 按钮打开筛选面板：
- **选择筛选类别**：场景、机器人、末端执行器、动作、操作对象
- **层级选择**：展开/折叠对象组进行层级筛选
- **Filter Finder（筛选项搜索）**：
  - 按 `Ctrl+F` 或点击筛选面板中的搜索框
  - 输入关键词搜索筛选项
  - 使用 ↑/↓ 方向键或导航按钮在匹配项间移动
  - 匹配的选项会自动高亮显示
- **查看活动筛选器**：筛选按钮显示活动筛选器的数量
- **重置筛选器**：点击"Reset filters"清除所有活动筛选器

### 2. 搜索数据集

- 使用顶部工具栏中的**搜索框**按名称搜索数据集
- 搜索实时生效，过滤显示的数据集
- 点击 **×** 按钮清除搜索

### 3. 选择数据集

- **单选**：点击视频卡片选择/取消选择
- **批量选择**：
  - 点击 **"Select all datasets"** 选择所有当前筛选的数据集
  - 点击 **"Deselect all datasets"** 清除所有选择
- **视觉反馈**：选中的卡片会高亮显示边框
- **选择计数**：工具栏显示已选择的数据集数量

### 4. 管理购物车（批量下载器）

右侧的选择面板显示您的购物车：
- **添加到购物车**：选中的数据集可以添加到购物车（自动管理）
- **查看购物车项目**：滚动浏览购物车列表（支持虚拟滚动）
- **移除项目**：点击单个项目的移除按钮
- **购物车计数**：查看购物车中有多少个数据集

### 5. 导出下载命令

1. **选择Hub源**：
   - 使用Hub切换按钮在 **HuggingFace** 和 **ModelScope** 之间切换
   - 当前Hub通过活动状态指示
2. **生成命令**：
   - 根据购物车内容自动生成下载命令
   - 在代码输出区域查看命令
3. **复制命令**：
   - 点击 **"Copy & Checkout"** 将命令复制到剪贴板
   - 在终端中执行命令以下载数据集

### 6. 导入/导出选择

- **导出JSON**：
  - 点击 **"Export JSON"** 将当前购物车保存为JSON文件
  - 便于分享选择或稍后使用
- **导入JSON**：
  - 点击 **"Import JSON"** 加载之前保存的选择文件
  - 从JSON文件恢复您的购物车

### 7. 查看数据集详情

- **悬停预览**：悬停在视频卡片上查看快速信息
- **详情模态框**：点击视频卡片打开详细信息模态框
- **视频播放**：视频在悬停时自动播放（桌面）或点击时播放（移动端）

## 贡献

欢迎提交Issue和Pull Request！

## 联系方式

如有任何问题，请及时联系 pykerogers@outlook.com

