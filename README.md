# AGENTS.md

## 项目概览
这是一个基于纯 HTML/CSS/JavaScript 的静态个人主页，采用单页锚点导航结构，用于展示个人简介、项目经历、成长历程、音乐模块和联系信息。

![关于我的项目照片](https://free.picui.cn/free/2026/08/22/6a892ec572f60.png)

项目特点：
- 无框架依赖，适合快速部署和维护
- 支持深色/浅色主题切换
- 通过 `IntersectionObserver` 实现导航高亮和滚动动画
- 采用数据驱动渲染，内容集中在 `js/data.js`
- 带音乐模块，使用 APlayer + Meting 接口拉取歌单
- 可直接部署到 GitHub Pages / Vercel / Netlify

## 技术栈
- HTML + CSS + 原生 JavaScript
- Vite ^5.4.0：本地开发与构建
- Remix Icon 4.1.0：图标库，类名以 `ri-*` 形式使用
- APlayer：音乐播放器核心
- Meting：音乐数据 API 封装
- 今日诗词 SDK：首页诗词打字机
- 运行环境：Node >= 18

## 目录结构
- `index.html`：页面骨架与各 section 入口
- `css/style.css`：全站样式、主题变量、响应式布局
- `js/data.js`：所有页面内容配置，核心自定义入口
- `js/main.js`：主题、导航、轮播、打字机、滚动动画等交互逻辑
- `js/music.js`：音乐播放器实现、歌词解析、播放列表与拖动进度条
- `img/`：图片资源，页面中使用 `/img/...` 访问
- `vercel.json`：Vercel 配置，包含 CSP、rewrite 和 headers
- `netlify.toml`：Netlify 相关配置
- `package.json`：脚本与依赖定义

## 页面结构
页面按以下顺序组织：

导航栏 → Hero (#hero) → 自我介绍 (#intro) → 项目展示 (#projects) → 成长历程 (#timeline) → 音乐 (#music) → 关于 (#about) → 页脚

## 关键实现
- 深色模式：通过 CSS 变量和 `data-theme` 属性控制，使用 `localStorage` 保持用户偏好
- 导航联动：`IntersectionObserver` 监听各区块进入视口，更新当前导航状态
- 时间线动画：采用 Z 字形左右交替布局，配合入场动画模拟从下到上展开效果
- 项目卡片：从 `projectsData` 数组动态渲染，支持滚动展示和悬停交互
- 打字机效果：`profileData.roles` 数组轮播展示当前身份标签
- 滚动动画：通过 `.reveal` 类与 `IntersectionObserver` 控制元素出现动画
- 社交链接：使用胶囊式按钮布局，支持 GitHub、Bilibili、邮箱、抖音、X、QQ 等平台
- 项目轮播：横向无缝滚动，悬停暂停，循环时长约 40 秒
- 图片轮播：图片尺寸统一为 160×160，支持无缝轮播和 Lightbox 全屏查看
- 页脚：三栏布局（联系我、导航、其他）

## 音乐模块
音乐功能为页面重点扩展，布局分为三栏：

- 左侧：当前歌单封面与专辑图，使用圆角和光晕效果，采用 sticky 定位
- 中间：歌曲信息、播放控制、进度条、歌词展示
- 右侧：播放列表，常驻展示并支持滚动，当前播放项高亮

实现细节：
- 使用 APlayer API 直接创建播放器实例，隐藏默认 UI
- 通过网易云音乐 API / Meting 拉取歌单数据
- 自定义覆盖 APlayer 默认样式以贴合页面设计
- 解析 LRC 歌词并逐行高亮
- 支持拖拽进度条 seek
- 深色模式自动适配
- 列表支持上/下渐变遮罩和平滑过渡

## 需要用户替换的内容
这些内容通常集中在 `js/data.js`，是最常修改的入口：

- `profileData`：姓名、头像、形象图、社交链接、身份标签
- `introData`：自我介绍文本、技能标签、统计数据
- `projectsData`：项目数组，按卡片形式展示
- `timelineData`：成长历程时间线数据
- `musicConfig`：网易云歌单 ID

## 关键维护入口速查

### 个人信息
| 内容 | 文件位置 | 说明 |
| --- | --- | --- |
| 姓名 / 头像 / 社交链接 | `js/data.js` → `profileData` | 修改个人资料和联系信息 |
| 身份标签 | `js/data.js` → `profileData.roles` | 轮播显示的身份标签 |
| 导航栏 logo | `index.html` → `.nav-logo span` | 修改站点名称 |

### 首页 Hero
| 内容 | 文件位置 | 说明 |
| --- | --- | --- |
| 社交按钮 | `index.html` → `.hero-socials` | 主页社交入口 |
| 诗词打字机 | `js/main.js` → `initPoem()` | 调用今日诗词 SDK |
| 背景星空 | `js/main.js` → `initStarfield()` | Canvas 绘制星空效果 |

### 自我介绍
| 内容 | 文件位置 | 说明 |
| --- | --- | --- |
| 介绍文本 | `js/data.js` → `introData.description` | 支持 HTML 内容 |
| 技能标签 | `js/data.js` → `introData.skills` | 展示个人技能 |
| 统计数据 | `js/data.js` → `introData.stats` | 数字 + 文字组合 |
| 形象图 | `js/data.js` → `introData.figure` | 主页展示图 |

### 项目展示
| 内容 | 文件位置 | 说明 |
| --- | --- | --- |
| 项目数据 | `js/data.js` → `projectsData` | 数组形式管理所有项目 |
| 轮播容器 | `index.html` → `.projects-carousel` | 横向滚动容器 |
| 轮播样式 | `css/style.css` → `.projects-track` | 无缝滚动动画 |
| 卡片样式 | `css/style.css` → `.project-card` | 适配每个项目卡片 |

### 成长历程
| 内容 | 文件位置 | 说明 |
| --- | --- | --- |
| 时间线内容 | `js/data.js` → `timelineData` | 年份 / 标题 / 描述 |
| 时间线样式 | `css/style.css` → `.timeline` | Z 字型布局 |
| 动画效果 | `css/style.css` → `.tl-item .tl-card` | 从下到上展开动画 |

### 音乐模块
| 内容 | 文件位置 | 说明 |
| --- | --- | --- |
| 歌单 ID | `js/data.js` → `musicConfig.playlistId` | 网易云歌单配置 |
| 布局 | `css/style.css` → `.music-layout` | 三栏布局与高度控制 |
| 播放器样式 | `css/style.css` → `.music-section` | UI 视觉样式 |
| 播放逻辑 | `js/music.js` | 歌单拉取、播放、歌词等逻辑 |

### 关于 / 页脚
| 内容 | 文件位置 | 说明 |
| --- | --- | --- |
| 心路历程文本 | `index.html` → `.music-related-text` | 关于模块文案 |
| 图片轮播 | `index.html` → `.gallery-section` | 展示图集 |
| Lightbox | `index.html` → `#lightbox` | 全屏查看器 |
| 页脚信息 | `index.html` → `footer` | 版权和联系信息 |

### 全局样式
| 内容 | 文件位置 | 说明 |
| --- | --- | --- |
| 主题色 | `css/style.css` → `:root` | 全局颜色变量 |
| 深色模式 | `css/style.css` → `[data-theme="dark"]` | 暗色主题配置 |
| 动画时长 | `css/style.css` → `--transition` | 全局过渡时间 |
| 圆角大小 | `css/style.css` → `--radius-*` | 卡片和按钮圆角 |

## 本地开发与构建
启动开发环境：

```bash
npm install
npm run dev
```

默认端口为 `3015`。

构建生产包：

```bash
npm run build
```

本项目可直接部署为静态站点，产物为 `dist/`。

## 已知问题与经验总结

### 1. 音乐播放器相关
- `APlayer` 使用 `preload: 'metadata'` 时，第三方 MetoAPI 的音频 URL 异常时可能出现 302 重定向失败，最终改为 `preload: 'none'`，并在 `error` / `unhandledrejection` 中兜底
- 直接给 `<img>` 赋值空字符串会触发加载错误，因此只有在 URL 有效时才设置 `src`
- `api.moeyao.cn` 对 QQ 音乐支持不完整，返回 301，建议仅用于网易云音乐源
- `meting.mikus.ink` 在浏览器环境中偶发 403，需准备备用源，如 `api.qijieya.cn`

### 2. 部署与权限
- Vercel 的 CSP 必须覆盖所有外部脚本域名和接口域名，否则广告拦截/脚本拦截会直接导致页面异常
- `script-src` 需要包含 `https://sdk.jinrishici.com`
- `connect-src` 需要放宽至诗词 API / Meting API 所需域名，否则会出现请求失败

### 3. 适配与兼容性
- Vite 在加载 `js/*.js` 时如果缺少 `type="module"`，会出现打包警告，但传统脚本顺序加载仍可正常运行
- 移动端需注意：
  - `.hero-socials` 加 `flex-wrap: wrap`
  - `.projects-carousel` / `.gallery-container` 需要支持横向滚动
  - 触摸滑动应启用 `touch-action: pan-x` 和 `-webkit-overflow-scrolling: touch`
  - 需要隐藏滚动条并避免重复覆盖媒体查询

## 部署方式
项目可直接部署到以下平台：

- GitHub Pages
- Vercel
- Netlify

部署时，至少保留：
- `index.html`
- `css/`
- `js/`
- `img/`

## 维护建议
- 所有页面数据优先修改 `js/data.js`，避免直接硬编码到 HTML 中
- 若要新增模块，保持结构与样式分离：数据在 JS，布局在 HTML，样式在 CSS
- 对音乐与外部 API 的改动要优先在浏览器和部署环境中验证 CORS、403、防盗链与 301 重定向问题
- 若要调整站点内容，请优先保持页面结构不变，只更新数据和样式变量

## 总结
这是一个典型的“内容驱动型静态个人主页”项目，适合用于展示个人品牌、作品集和技术经历。项目设计简单、维护成本低，且具备较强的扩展性；因此建议在后续维护中优先保留当前“数据驱动 + 结构分离”的开发方式。
