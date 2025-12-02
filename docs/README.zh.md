[English](README.md) | **中文**

# RoboCOIN DataManager

**版本: v1.1**

在线演示: https://flagopen.github.io/RoboCOIN-DataManager/

## 什么是 RoboCOIN DataManager ？

RoboCOIN DataManager 是一个网页工具，帮助你查找和下载 RoboCOIN 项目的机器人操作数据集。不用记住复杂的命令，你可以直接看视频，筛选标签，选择需要的数据，然后获取现成的下载命令。

## 怎么一步直接下载？

点击视频窗格右下角的下载icon,直接复制下载命令！

## 要批量下载我想要的数据，我该怎么做？

### 第 1 步：打开网站
访问：https://flagopen.github.io/RoboCOIN-DataManager/

等待数据集加载（会看到进度条）。

### 第 2 步：找到想要的数据
- **浏览视频**：滚动查看视频卡片，看有哪些机器人任务
- **使用筛选**：点击"Filter datasets"按条件筛选：
  - 什么场景（厨房、客厅等）
  - 什么机器人（Unitree, Agilex等）
  - 什么动作（拿起、放下等）
  - 什么物体（杯子、盒子等）
- **按名称搜索**：用搜索框找特定数据集

### 第 3 步：选择数据集
- 点击视频卡片来选择，可以多选！
- 使用 Select all 和 Deselect All 来进行快速的全选/全不选！
- 顶部计数器会显示当前你已经选了多少个数据集

### 第 4 步：获取下载命令
- 看右边的"Batch Downloader"面板，你选择的所有数据集都在这里！
- 选择下载源：HuggingFace 或 ModelScope
- 点击"Copy & Checkout"复制Python命令

### 第 5 步：下载数据
1. **先安装 RoboCOIN**（只需一次）：
   ```bash
   pip install robocoin
   ```
   请先拉取对应项目：https://github.com/FlagOpen/RoboCOIN

2. **粘贴运行复制的命令**：
    如果需要，你可以定制你自己的下载目标目录：
    ```bash
    ...--target-dir YOUR_TARGET_DOWNLOAD_DIR
    ```

3. **等待下载完成** - RoboCOIN 的下载工具会自动处理一切

就这么简单！数据就会下载到你的电脑里。

## 更多功能

### 保存你的选择
- 点击"Export JSON"把当前选择保存成文件
- 点击"Import JSON"加载保存的选择
- 适合分享或以后继续用

## 需要帮助？

### 下载遇到问题？
1. 确认安装了RoboCOIN：`pip install robocoin`
2. 检查到 Github 的网络连接

### 发现bug或有问题？
- **报告问题**：[RoboCOIN GitHub](https://github.com/FlagOpen/RoboCOIN) 或者直接在本项目发起你的 issue
- **邮箱**：请随时联系 pykerogers@outlook.com

### 关于 RoboCOIN , 了解更多
- **主项目**：[github.com/FlagOpen/RoboCOIN](https://github.com/FlagOpen/RoboCOIN)
- **文档**：查看主仓库了解数据集详情和研究用法

