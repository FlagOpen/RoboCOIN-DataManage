**English** | [中文](README.zh.md)

# RoboCOIN DataManager

https://flagopen.github.io/RoboCOIN-DataManager/

**Version:** v1.1

## Project Overview

RoboCOIN dataset visualization and download tool, supporting advanced filtering, preview, selection, and dataset export. Features a modern, responsive interface with virtual scrolling for handling large datasets efficiently.

## Project Structure

```
DataManage/
├── docs/
│   ├── assets/                 # Resource files
│   │   ├── dataset_info/       # Dataset metadata (266 YAML files)
│   │   ├── info/               # Index files
│   │   │   ├── consolidated_datasets.json  # Consolidated dataset information
│   │   │   ├── data_index.json             # Dataset index
│   │   │   └── robot_aliases.json          # Robot display name mappings
│   │   ├── thumbnails/         # Thumbnail images (*.jpg)
│   │   └── videos/             # Video files (*.mp4)
│   │
│   ├── css/                    # Modular style files
│   │   ├── core/               # Core styles
│   │   │   ├── variables.css   # CSS variable definitions
│   │   │   ├── base.css        # Base styles
│   │   │   ├── layout.css      # Layout styles
│   │   │   └── header.css      # Header styles
│   │   ├── filter/             # Filter component styles
│   │   │   ├── filter-control-bar.css
│   │   │   ├── filter-dropdown.css
│   │   │   ├── filter-options.css
│   │   │   └── filter-tooltip.css
│   │   ├── video/              # Video component styles
│   │   │   ├── video-card.css
│   │   │   ├── video-grid.css
│   │   │   ├── video-hover-overlay.css
│   │   │   ├── video-info.css
│   │   │   ├── video-panel.css
│   │   │   ├── video-thumbnail.css
│   │   │   └── video-toolbar.css
│   │   ├── selection/          # Selection panel styles
│   │   │   ├── selection-panel-base.css
│   │   │   ├── selection-list.css
│   │   │   ├── selection-item.css
│   │   │   ├── selection-footer.css
│   │   │   └── selection-hub-buttons.css
│   │   ├── components/         # Reusable components
│   │   │   ├── modal.css
│   │   │   └── toast.css
│   │   ├── animations/         # Animation definitions
│   │   │   └── animations.css
│   │   ├── responsive/         # Responsive design
│   │   │   ├── responsive-desktop.css
│   │   │   ├── responsive-tablet.css
│   │   │   ├── responsive-mobile.css
│   │   │   └── responsive-print.css
│   │   └── style.css           # CSS entry point
│   │
│   ├── js/                     # Modular JavaScript files
│   │   ├── modules/            # Feature modules
│   │   │   ├── @filter/        # Filter module group
│   │   │   │   ├── filter-manager.js
│   │   │   │   ├── filter-renderer.js
│   │   │   │   ├── filter-state.js
│   │   │   │   ├── filter-search.js
│   │   │   │   ├── filter-hierarchy.js
│   │   │   │   ├── data.js
│   │   │   │   └── index.js
│   │   │   ├── config.js       # Configuration management
│   │   │   ├── data-manager.js # Data management
│   │   │   ├── video-grid.js   # Video grid with virtual scrolling
│   │   │   ├── selection-panel.js # Selection panel with virtual scrolling
│   │   │   ├── download-manager.js # Download command generation
│   │   │   ├── robot-aliases.js # Robot name alias management
│   │   │   ├── ui-utils.js     # UI utilities
│   │   │   ├── event-handlers.js # Event handling
│   │   │   ├── virtual-scroll.js # Virtual scrolling utilities
│   │   │   ├── dom-utils.js    # DOM manipulation utilities
│   │   │   ├── error-notifier.js # Error handling
│   │   │   └── toast-manager.js # Toast notifications
│   │   ├── app.js              # Main application coordinator
│   │   ├── main.js             # Application entry point
│   │   ├── templates.js        # HTML template generator
│   │   └── types.js            # TypeScript-like type definitions
│   │
│   ├── index.html              # Main page
│   ├── favicon.ico             # Website icon
│   ├── README.md               # Project documentation (English)
│   └── README.zh.md            # Project documentation (Chinese)
│
└── README.md                   # Root directory documentation
```

## Core Features

### 1. Advanced Dataset Filtering
- **Multi-dimensional filtering**: Scene, Robot, End-effector, Action, Object
- **Hierarchical filters**: Supports object hierarchy with expandable/collapsible groups
- **Filter Finder**: Search filter options with keyboard navigation (Ctrl+F)
  - Real-time highlighting of matching options
  - Navigate through matches with arrow keys
  - Match counter display
- **Real-time dataset search**: Search datasets by name in the main search box
- **Filter state management**: Active filter count display and easy reset
- **Robot alias support**: Friendly display names for robot models

### 2. Rich Dataset Preview
- **Video auto-play on hover**: Videos automatically play when hovering over cards
- **Hover information overlay**: Quick preview of dataset metadata
- **Detail modal dialog**: Comprehensive dataset information including:
  - Dataset metadata (scene, robot, action, objects)
  - Version information
  - Codebase version
  - Download links
- **Thumbnail loading**: Fast thumbnail display for quick browsing
- **Video controls**: Play/pause controls in video cards

### 3. Selection and Management
- **Multi-select support**: Click cards to select/deselect multiple datasets
- **Batch operations**: 
  - Select all filtered datasets
  - Deselect all datasets
  - Add selected items to cart
  - Remove selected items from cart
  - Clear entire cart
- **Shopping cart (Batch Downloader)**: 
  - Virtual scrolling for large selections
  - Individual item removal
  - Real-time count updates
- **Selection state persistence**: Maintains selection state during filtering

### 4. Export and Download
- **JSON export/import**: 
  - Export selection list as JSON file
  - Import previously saved selections
- **Python download command generation**: 
  - Generate ready-to-use download commands
  - Support for both ModelScope and HuggingFace hubs
  - One-click copy to clipboard
  - Batch download support for multiple datasets

### 5. Performance Optimization
- **Virtual scrolling**: 
  - Efficient rendering for large datasets (266+ datasets)
  - Applied to both video grid and selection panel
  - Element caching and reuse
- **Lazy loading**: 
  - Videos load only when visible
  - IntersectionObserver-based optimization
  - Progressive loading with progress indicator
- **Optimized rendering**: 
  - Minimal DOM manipulation
  - Efficient event handling
  - Smooth animations and transitions

### 6. User Experience
- **Responsive design**: 
  - Desktop, tablet, and mobile layouts
  - Print-friendly styles
  - Adaptive UI components
- **Loading indicators**: 
  - Progress bar during dataset loading
  - Loading overlay with spinner
  - Dataset count display
- **Toast notifications**: 
  - Success/error feedback
  - Non-intrusive notifications
- **Global banner**: 
  - Important announcements
  - Auto-dismissible on interaction
- **Keyboard shortcuts**: 
  - Ctrl+F for Filter Finder
  - Arrow keys for navigation

## Quick Start

### Browser Requirements

- Chrome/Edge 61+
- Firefox 60+
- Safari 11+
- Opera 48+

(Modern browsers supporting ES6 modules)

## User Guide

### 1. Filter Datasets

Click the **"Filter datasets"** button to open the filter panel:
- **Select filter categories**: Scene, Robot, End-effector, Action, Object
- **Hierarchical selection**: Expand/collapse object groups for hierarchical filtering
- **Filter Finder**: 
  - Press `Ctrl+F` or click the search box in the filter panel
  - Type to search filter options
  - Use ↑/↓ arrow keys or navigation buttons to move between matches
  - Matching options are highlighted automatically
- **View active filters**: The filter button shows the count of active filters
- **Reset filters**: Click "Reset filters" to clear all active filters

### 2. Search Datasets

- Use the **search box** in the top toolbar to search datasets by name
- Search works in real-time and filters the displayed datasets
- Click the **×** button to clear the search

### 3. Select Datasets

- **Single selection**: Click on a video card to select/deselect it
- **Batch selection**: 
  - Click **"Select all datasets"** to select all currently filtered datasets
  - Click **"Deselect all datasets"** to clear all selections
- **Visual feedback**: Selected cards are highlighted with a border
- **Selection count**: The toolbar shows the number of selected datasets

### 4. Manage Shopping Cart (Batch Downloader)

The selection panel on the right side shows your shopping cart:
- **Add to cart**: Selected datasets can be added to the cart (managed automatically)
- **View cart items**: Scroll through the cart list (supports virtual scrolling)
- **Remove items**: Click the remove button on individual items
- **Cart count**: See how many datasets are in your cart

### 5. Export Download Commands

1. **Select Hub source**: 
   - Toggle between **HuggingFace** and **ModelScope** using the hub switch button
   - The current hub is indicated by the active state
2. **Generate command**: 
   - The download command is automatically generated based on cart contents
   - View the command in the code output area
3. **Copy command**: 
   - Click **"Copy & Checkout"** to copy the command to clipboard
   - Execute the command in your terminal to download datasets

### 6. Import/Export Selections

- **Export JSON**: 
  - Click **"Export JSON"** to save your current cart as a JSON file
  - Useful for sharing selections or saving for later
- **Import JSON**: 
  - Click **"Import JSON"** to load a previously saved selection file
  - Restores your cart from the JSON file

### 7. View Dataset Details

- **Hover preview**: Hover over a video card to see quick information
- **Detail modal**: Click on a video card to open a detailed information modal
- **Video playback**: Videos auto-play on hover (desktop) or on click (mobile)

## Contributing

Issues and Pull Requests are welcome!

## Contact

For any questions, please contact pykerogers@outlook.com
