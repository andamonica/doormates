# Door Mates 网站项目指南

这是一个由交互式游戏、角色构建器和前端地图系统组成的 Web 项目。项目使用 Node.js 提供了简单的文件生成及字符系统后台支持。

## 🚀 启动与运行

通过包含的 Shell 脚本，可以方便地以后台服务方式运行本前端系统：

**启动服务器** (自动在后台运行，并将日志输出到 `server.log`)：
```bash
./start.sh
```

一旦启动成功，即可在浏览器中访问：[http://localhost:8000](http://localhost:8000)

**停止服务器**：
```bash
./stop.sh
```

> **提示:** 初次运行或如果遇到权限问题，请赋权后执行：`chmod +x start.sh stop.sh`。或者，如果您只需要前台运行来调试，您可以直接在终端中运行 `node server.js` 并通过 `Ctrl + C` 退出。

## 🛠️ 项目结构

- `app/` - 网站的前端资源，包含：
  - `assets/`：存放所有图片(`images`)、视频(`videos`) 和 音频(`audio`) 等媒体文件。
  - `styles/`：存放整个项目所有页面的层叠样式表 (CSS)。
  - `js/`：负责各页面的交互逻辑。例如通过 Fabric.js 驱动的 `character-creator.js` 及各场景页面(`map.js`, `ubahn.js`)的逻辑。
- `character-creator/`、`map/`、`doormates/`、`game-world-*/` - HTML 页面。各个场景都有其独立的目录。
- `server.js` - 用于提供本地文件访问服务和处理角色创建所需的后台逻辑。
- `media/` - 服务器存储新生成人物图的存放位置。
- `characters.json` - 本地运行产生的简单前端数据系统(存储新产生的人物图引用)。

## 📝 代码维护指南

在这继续维护开发代码时，建议遵循以下说明来保证项目清晰：

### 1. 资源路径规范 (重要❗️)
引入包括在 `HTML` 及在 `Javascript` (例如在数组中定义音效文件) 的路径时，**强烈建议全部使用绝对路径引用**(即以 `/app/` 开头)。
- **错误示例**: `src="app/assets/audio/hello.mp3"` (如果在子目录如 `/character-creator/` 下运行，会导致路径解析错误，报 404 找不到文件)
- **正确示例**: `src="/app/assets/audio/hello.mp3"`

### 2. 添加或更换媒体资源
如果需要更新、添加音频或图片：
- 文件必须放进正确的 `app/assets/` 对应的内部目录结构中。
- 前往相关的 `.js` 或者被引用的 `index.html`，更新对应的资源地址即可，无需另外的构建编译 (Build) 步骤。
- 如果替换了同名文件但浏览器没发生变化，可以在 `HTML` 中给调用的资源末尾加上版本参数绕开浏览器缓存，如 `/app/js/script.js?v=2`。

### 3. 组件化或者样式的修改
- 为了不互相干扰导致页面错版，项目为 `apartments`、`ubahn`、`map` 分别建立了它们独立的 CSS 样式表；而在多处常用的按钮设计（`btns.css`）和字体排印 (`typo.css`) 是共享的。 
- 若调整某一特定场景界面的位置坐标，请直接修改与其对应的特定样式表 (比如 `/app/styles/game-world/ubahn/variables.css`)。

### 4. 后台数据库更新
目前的 "数据库" (`characters.json`) 仅供轻量级运行角色创造系统而设。随着文件或角色名堆积，如果偶尔想清空数据，除了停止服务后删除 `media/characters/` 里面的旧图片外，请直接清空 `characters.json` 的内容使其变为 `{}`，然后保存并重新启动服务。
