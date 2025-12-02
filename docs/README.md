**English** | [中文](README.zh.md)

# RoboCOIN DataManager

**Version: v1.1**

Live Demo: https://flagopen.github.io/RoboCOIN-DataManager/

## What is RoboCOIN DataManager?

RoboCOIN DataManager is a user-friendly web application designed to help you easily browse, explore, and download datasets from the RoboCOIN project. Whether you're a researcher, developer, or robotics enthusiast, this tool provides an intuitive interface to discover and obtain the robotic manipulation data you need for your projects.

### Key Features
- **Browse RoboCOIN Datasets**: Explore hundreds of robotic manipulation episodes with video previews
- **Advanced Filtering**: Find specific datasets by scene, robot type, actions, and objects
- **Video Previews**: Watch short video clips of robotic tasks directly in your browser
- **Batch Download**: Select multiple datasets and generate download commands for bulk acquisition
- **Multi-Source Support**: Download from both ModelScope and HuggingFace repositories

> ⚠️ **Important**: Before downloading datasets through this web interface, please install the [RoboCOIN project](https://github.com/FlagOpen/RoboCOIN) to get the best download experience with pre-built batch download scripts:
> ```bash
> pip install robocoin
> ```

## How the Web App Works

This web application loads RoboCOIN dataset information directly in your browser and provides an interactive interface to explore and select datasets. Here's how it works:

### Data Loading Process
1. **Dataset Discovery**: The app loads metadata for all available RoboCOIN datasets
2. **Video Previews**: Short video clips are loaded for previewing robotic tasks
3. **Interactive Filtering**: You can filter datasets by various criteria like robot types, scenes, and actions
4. **Download Generation**: Selected datasets are used to generate Python download commands

### Browser Requirements
- **Modern Browsers**: Chrome 61+, Firefox 60+, Safari 11+, Edge 61+, or Opera 48+
- **JavaScript**: Must be enabled (the app uses modern ES6 modules)
- **Internet Connection**: Required for loading dataset information and video previews

## Main Features

### 1. Dataset Exploration
- **Visual Previews**: Watch short video clips of robotic manipulation tasks
- **Detailed Information**: View comprehensive metadata for each dataset including robot types, scenes, actions, and objects
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 2. Smart Filtering System
- **Multiple Filter Categories**: Filter datasets by scene, robot model, end-effector, action type, and manipulated objects
- **Real-time Search**: Search datasets by name with instant filtering
- **Filter Combinations**: Combine multiple filters to find exactly the datasets you need
- **Quick Reset**: Easily clear all filters with one click

### 3. Dataset Selection and Management
- **Visual Selection**: Click on dataset cards to select/deselect them
- **Batch Operations**: Select all visible datasets or clear all selections at once
- **Selection Counter**: Always see how many datasets you've selected
- **Shopping Cart**: Your selected datasets appear in a dedicated panel on the right

### 4. Download Management
- **Multi-Source Downloads**: Choose between downloading from ModelScope or HuggingFace
- **Python Commands**: Get ready-to-use Python commands for downloading your selected datasets
- **Clipboard Integration**: Copy download commands with one click
- **Selection Backup**: Export your dataset selections as JSON files for later use

### 5. User-Friendly Interface
- **Loading Progress**: See progress bars while datasets are loading
- **Error Handling**: Clear error messages if something goes wrong
- **Toast Notifications**: Helpful feedback for your actions
- **Keyboard Shortcuts**: Use Ctrl+F to quickly search through filter options

## Getting Started

### Accessing the Web App
1. Visit the live demo: https://flagopen.github.io/RoboCOIN-DataManager/
2. Wait for the datasets to load (you'll see a progress bar)
3. Start exploring the RoboCOIN datasets!

### Browser Compatibility
- **Recommended**: Chrome 61+, Firefox 60+, Safari 11+, Edge 61+
- **JavaScript**: Must be enabled in your browser
- **Internet**: Required for loading dataset information

## How to Use the Web App

### Step 1: Explore Datasets
1. **Browse Videos**: Scroll through the dataset cards to see video previews of robotic tasks
2. **Hover for Info**: Hover over any video card to see basic information without clicking
3. **Click for Details**: Click on a video card to open a detailed modal with complete dataset information

### Step 2: Filter Your Search
1. Click the **"Filter datasets"** button in the top control bar
2. Use the sidebar to choose filter categories:
   - **Scene**: Filter by environment (kitchen, living room, etc.)
   - **Robot**: Filter by robot model (Franka, UR5, etc.)
   - **End-effector**: Filter by gripper type
   - **Action**: Filter by task type (pick, place, etc.)
   - **Object**: Filter by manipulated objects
3. Click filter options to activate them (you can select multiple)
4. Use the search box (Ctrl+F) to quickly find specific filter options
5. Click **"Done"** or press Escape to apply filters

### Step 3: Search by Name
- Use the search box in the top control bar to search datasets by name
- Search works with your active filters for precise results
- Click the × button to clear your search

### Step 4: Select Datasets
1. **Individual Selection**: Click on video cards to select/deselect them (selected cards show a border and checkmark)
2. **Batch Selection**: Click **"Select all datasets"** to select everything currently visible
3. **Clear Selection**: Click **"Deselect all datasets"** to clear all selections
4. Watch the selection counter in the top bar to see how many you've chosen

### Step 5: Generate Download Commands
1. Your selected datasets appear in the **"Batch Downloader"** panel on the right
2. Choose your preferred download source: **HuggingFace** or **ModelScope**
3. Click **"Copy & Checkout"** to copy the Python download command
4. Paste and run the command in your terminal to download the datasets
5. **Optional**: Add `--target-dir /your/custom/path` to the command for custom download location

### Step 6: Save Your Selections
- **Export Selections**: Click **"Export JSON"** to save your current selections as a file
- **Import Selections**: Click **"Import JSON"** to load previously saved selections
- Useful for sharing selections or continuing work later

### Tips for Best Experience
- **Video Loading**: Videos load automatically when you hover over them
- **Performance**: The app uses virtual scrolling to handle large numbers of datasets efficiently
- **Mobile Friendly**: Works on tablets and phones with touch controls
- **Error Recovery**: If something goes wrong, try refreshing the page

## Need Help or Found an Issue?

### Report Problems
If you encounter any issues while using the web app, please let us know:
- **GitHub Issues**: Visit the [RoboCOIN repository](https://github.com/FlagOpen/RoboCOIN) and create an issue
- **Describe the Problem**: Include what you were doing, what browser you're using, and any error messages
- **Screenshots**: If possible, include screenshots of the issue

### Contact Information
For questions about the RoboCOIN project or datasets:
- **Email**: pykerogers@outlook.com
- **Project Repository**: [github.com/FlagOpen/RoboCOIN](https://github.com/FlagOpen/RoboCOIN)

### About RoboCOIN
This web app is part of the RoboCOIN project. To learn more about the datasets and how to use them in your research:
1. Visit the main RoboCOIN repository
2. Install the Python package: `pip install robocoin`
3. Follow the documentation for dataset usage and citation information
