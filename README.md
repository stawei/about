# AGENTS.md

## 项目类型
浅小兮的静态个人主页

## 技术栈
- 纯 HTML + CSS + 原生 JavaScript（零框架依赖）
- Vite ^5.4.0 用作本地预览与构建托管
- **Remix Icon** 4.1.0（CDN）— 图标库，使用 `ri-*` 类名
- **APlayer**（CDN）— 音频播放器库，音乐模块使用
- **Meting**（CDN）— 音乐数据 API 封装
- **今日诗词 SDK**（CDN）— 首页诗词打字机

## 文件结构
- `index.html` — 单页结构，各 section 通过 id 锚点导航
- `css/style.css` — 全部样式（CSS 变量 + 深色模式 + 响应式）
- `js/data.js` — 数据配置（profileData / introData / projectsData / timelineData / musicConfig）
- `js/main.js` — 核心交互（主题切换、导航、打字机、项目/时间线渲染、滚动动画、诗词、星空）
- `js/music.js` — 音乐播放器模块（APlayer 控制、歌词解析、播放列表、进度条拖动）
- `img/` — 图片资源，HTML 中以 `/img/xxx` 绝对路径引用

## 页面结构
导航栏 → Hero(#hero) → 自我介绍(#intro) → 项目(#projects) → 成长历程(#timeline) → 音乐(#music) → 关于(#about) → 页脚

## 关键实现
- **深色模式**：CSS 变量 + `data-theme` 属性 + localStorage 记忆
- **导航联动**：IntersectionObserver 监听区块高亮 + 指示条平滑移动
- **时间线**：Z 字形左右交替，从下到上向两边展开动画
- **项目卡片**：数据抽成 `projectsData` JS 数组动态渲染
- **打字机效果**：`profileData.roles` 数组轮播身份标签
- **滚动动画**：`.reveal` 类 + IntersectionObserver
- **社交链接**：胶囊样式（图标+文字），GitHub、B站、邮箱、抖音、X、QQ
- **项目轮播**：横向无缝滚动，悬停暂停，40秒循环
- **图片轮播**：160×160px图片，无缝滚动，点击Lightbox全屏查看
- **页脚**：三栏布局（联系我4项、导航4项、其他4项）

## 音乐模块
- **左侧**：当前播放歌曲封面（圆角 + 光晕动画），sticky 定位
- **中间**：歌曲信息、可拖动进度条、播放控制按钮、歌词展示
- **右侧**：播放列表（常驻显示，可滚动，当前播放项高亮）
- **技术实现**：
  - 使用 APlayer API 直接创建播放器实例（隐藏默认 UI）
  - 通过网易云音乐 API 获取歌单数据
  - 自定义 UI 完全覆盖 APlayer 默认样式
  - 支持歌词 LRC 格式解析和逐行高亮
  - 进度条支持鼠标拖动 seek
  - 深色模式自动适配
  - 播放列表上下淡入淡出效果

## 需用户替换的占位内容（全部集中在 js/data.js）
- profileData：姓名、头像、形象图、社交链接、身份标签
- introData：自我介绍文本、技能标签、统计数据
- projectsData：项目数据数组
- timelineData：时间线数据数组
- musicConfig：网易云歌单 ID

## What Didn't Work
- ❌ APlayer `preload: 'metadata'` → 初始化时立即加载音频源，第三方 MetoAPI 的音频 URL 在预览环境中 302 重定向加载失败 → 改为 `preload: 'none'` + error 事件捕获 + `unhandledrejection` 兜底
- ❌ `cover.src = song.cover || ''` → 空 URL 赋给 `<img>` 会触发加载错误 → 改为仅在有效 URL 时赋值

## Lessons
- 第三方音乐 API（MetoAPI）的音频 URL 通过 302 重定向到实际资源，在沙箱预览环境的 `<audio>` 标签中可能因跨域/auth 时效性加载失败，需要做好 error 事件处理和全局兜底
- APlayer 的 `error` 事件不会阻止内部 Promise rejection 冒泡，仍需 `window.addEventListener('unhandledrejection', ...)` 兜底
- Vite 构建时 `<script src="js/*.js">` 若无 `type="module"` 会被警告无法打包，但不影响运行（项目用传统脚本加载顺序）
- `meoo-cli read-browser-screenshot` 默认只截首屏，页脚在视口外时需用 `--path "/#about"` 等锚点滚动到底部再截图

## 部署
可直接部署到 GitHub Pages / Vercel / Netlify，需 index.html + css/ + js/ 目录。

---

## 各模块修改路径速查

### 个人信息
| 内容 | 文件路径 | 说明 |
|------|----------|------|
| 姓名/头像/社交链接 | `js/data.js` → `profileData` | 修改姓名、头像路径、各平台链接 |
| 身份标签（打字机） | `js/data.js` → `profileData.roles` | 数组形式，会轮播显示 |
| 导航栏Logo文字 | `index.html` → `.nav-logo span` | 直接修改文字内容 |

### 首页 Hero
| 内容 | 文件路径 | 说明 |
|------|----------|------|
| 社交链接按钮 | `index.html` → `.hero-socials` | 胶囊样式，图标+文字 |
| 诗词打字机 | `js/main.js` → `initPoem()` | 调用今日诗词SDK |
| 背景星空 | `js/main.js` → `initStarfield()` | Canvas绘制，可调整星星数量 |

### 自我介绍
| 内容 | 文件路径 | 说明 |
|------|----------|------|
| 介绍文本 | `js/data.js` → `introData.description` | 支持HTML标签 |
| 技能标签 | `js/data.js` → `introData.skills` | 数组形式 |
| 统计数据 | `js/data.js` → `introData.stats` | 数字+标签 |
| 形象图 | `js/data.js` → `introData.figure` | 图片路径 |

### 项目展示（轮播模式）
| 内容 | 文件路径 | 说明 |
|------|----------|------|
| 项目数据 | `js/data.js` → `projectsData` | 数组，每个项目包含标题、描述、标签、链接、图片 |
| 轮播容器 | `index.html` → `.projects-carousel` | 横向滚动容器 |
| 轮播样式 | `css/style.css` → `.projects-track` | 无缝滚动动画，40秒循环，悬停暂停 |
| 项目卡片 | `css/style.css` → `.project-card` | 280px宽度，悬停效果 |

### 成长历程
| 内容 | 文件路径 | 说明 |
|------|----------|------|
| 历程数据 | `js/data.js` → `timelineData` | 数组，包含年份、标题、描述 |
| 时间线样式 | `css/style.css` → `.timeline` | Z字形布局、展开动画 |
| 动画效果 | `css/style.css` → `.tl-item .tl-card` | 从下到上向两边展开 |

### 音乐模块
| 内容 | 文件路径 | 说明 |
|------|----------|------|
| 歌单ID | `js/data.js` → `musicConfig.playlistId` | 网易云音乐歌单ID |
| 布局高度 | `css/style.css` → `.music-layout` | 500px高度，左右对齐 |
| 播放器样式 | `css/style.css` → `.music-section` | 三栏布局 |
| 播放列表淡入淡出 | `css/style.css` → `.music-playlist-items` | 上下8%渐变遮罩 |
| 播放逻辑 | `js/music.js` | APlayer控制、歌词解析、进度条 |

### 关于区域
| 内容 | 文件路径 | 说明 |
|------|----------|------|
| 心路历程文本 | `index.html` → `.music-related-text` | 直接修改 |
| 图片轮播 | `index.html` → `.gallery-section` | 160×160px图片，10px间距 |
| 轮播样式 | `css/style.css` → `.gallery-container` | 无缝滚动动画，悬停放大 |
| Lightbox查看器 | `index.html` → `#lightbox` | 70%/30%分栏，竖排文字，左右切换 |

### 页脚
| 内容 | 文件路径 | 说明 |
|------|----------|------|
| 版权信息 | `index.html` → `footer` | 直接修改 |
| 联系方式图标 | `index.html` → `.footer-socials` | Remix Icon类名 |

### 全局样式
| 内容 | 文件路径 | 说明 |
|------|----------|------|
| 主题色 | `css/style.css` → `:root` | `--primary`等CSS变量 |
| 深色模式 | `css/style.css` → `[data-theme="dark"]` | 深色主题变量 |
| 动画时长 | `css/style.css` → `--transition` | 全局过渡时间 |
| 圆角大小 | `css/style.css` → `--radius-*` | 卡片、按钮圆角 |

### 导航与交互
| 内容 | 文件路径 | 说明 |
|------|----------|------|
| 导航链接 | `index.html` → `.nav-links` | 锚点导航 |
| 导航高亮 | `js/main.js` → `initNavObserver()` | IntersectionObserver |
| 主题切换 | `js/main.js` → `initTheme()` | 深色/浅色模式 |
| 滚动动画 | `js/main.js` → `initReveal()` | `.reveal`类元素入场动画 |
