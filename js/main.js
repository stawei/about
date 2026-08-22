/* 数据配置 */
const profileData = {
  name: '浅小兮',
  avatar: '/img/avatar.jpg',
  roles: ['一名开发者', '一名设计师', '一名终身学习者', '一名热爱生活的人'],
  socials: {
    github: 'https://github.com/stawei',
    bilibili: 'https://space.bilibili.com/516107164',
    email: 'mailto:2963286491@qq.com'
  }
};

const introData = {
  paragraphs: [
    '你好，我是<strong>浅小兮</strong>，一名热爱构建数字产品的开发者。我喜欢把想法变成可以触摸、可以使用的真实产品，从一行行代码到最终交付的体验，每一步都让我感到兴奋。',
    '我主要关注 <strong>前端工程</strong> 与 <strong>用户体验设计</strong>，相信好的产品既要有扎实的工程基础，也要有让人愉悦的视觉表达。工作之余，我喜欢折腾开源项目、写技术博客，也偶尔做点小工具解决生活中的小问题。',
    '最近我在学习更多关于 <strong>全栈架构</strong> 和 <strong>AI 应用</strong> 的知识，希望未来能构建出更有影响力的产品。如果你对同样的领域感兴趣，欢迎随时和我交流。',
    '除了写代码，我也喜欢 <strong>音乐</strong>、<strong>摄影</strong> 和 <strong>阅读</strong>，这些爱好让我的生活保持平衡，也常常成为灵感的来源。'
  ],
  skills: ['JavaScript', 'TypeScript', 'Vue', 'React', 'Node.js', 'Python', 'Docker', 'Git'],
  tags: ['浅小兮', '千曦一梦', '多喜乐，常安宁', 'zxwlove', '相遇的刹那开始就注定了别离'],
  stats: [
    { num: '4', label: '个项目' },
    { num: '4', label: '年学习' },
    { num: '∞', label: '热情' }
  ]
};

const projectsData = [
  {
    cover: 'https://free.picui.cn/free/2026/08/22/6a892f855b0f4.png',
    name: '个人主页Home',
    desc: '这个参照github大神优化修改的项目，网站为zxwlove.cn备用线路为zxwlove.us.ci',
    tech: ['Vue', 'Node.js', 'JavaScript'],
    github: 'https://github.com/stawei/home',
    demo: 'https://zxwlove.us.ci'
  },
  {
    cover: 'https://free.picui.cn/free/2026/08/22/6a892b9dc13b5.png',
    name: 'Hexo-Blog',
    desc: '根据Hexo框架搭建的个人博客，展示了我的前端技能和内容创作能力。',
    tech: ['Vue', 'Hexo', 'Docker'],
    github: 'https://github.com/stawei/hexo-blog',
    demo: 'https://blog.zxwlove.us.ci'
  },
  {
    cover: 'https://free.picui.cn/free/2026/08/22/6a892ec572f60.png',
    name: '关于我',
    desc: '一个简单的自我介绍页面。',
    tech: ['HTML', 'JavaScript', 'CSS'],
    github: 'https://github.com/stawei/about',
    demo: 'https://zxwlove.cc.cd'
  },
  {
    cover: 'https://free.picui.cn/free/2026/08/22/6a89311a517fd.png',
    name: '暂定',
    desc: '暂定',
    tech: ['暂定', '暂定', '暂定'],
    github: 'https://github.com/你的用户名/project-4',
    demo: 'https://your-demo4.vercel.app'
  }
];

const timelineData = [
  { year: '2022', title: '接触编程', desc: '写下第一行 Hello World，打开了新世界的大门。' },
  { year: '2023', title: '完成第一个项目', desc: '从零搭建了一个完整应用，理解了工程化的意义。' },
  { year: '2023.12.01', title: '开始写博客', desc: '互联网的编程小船启航，把学习笔记整理成文章分享，倒逼自己深入思考。' },
  { year: '2025', title: '持续学习中', desc: '探索全栈与 AI 应用，构建更有影响力的产品。' },
  { year: '2025.06-2626.06', title: '失踪人口', desc: '因为毕业找工作租房等，暂停了编程。' },
  { year: '2026.06-至今', title: '回归', desc: '开始朝花夕拾~' }
];

const musicConfig = {
  // 多平台歌单配置
  playlists: [
    {
      server: 'netease',  // 网易云音乐
      type: 'playlist',
      id: '5314875708',
      name: '网易云歌单'
    },
    {
      server: 'tencent',  // QQ音乐
      type: 'playlist',
      id: '1171747653',   // QQ音乐歌单ID
      name: 'QQ音乐歌单'
    }
  ],
  theme: '#1989fa',
  themeDark: '#4d8dff'
};

/* ============================================================
   个人主页 - 核心交互逻辑
   ============================================================ */
(function () {
  'use strict';

  /* 深色模式切换 */
  function initTheme() {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    // 同步 APlayer 主题色
    var apTheme = next === 'dark' ? '#4d8dff' : '#1989fa';
    document.querySelectorAll('meting-js').forEach(function (el) {
      el.setAttribute('theme', apTheme);
    });
  }

  /* ============================================================
     2. 导航栏滚动状态
     ============================================================ */
  var nav = document.getElementById('nav');

  function onScroll() {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  /* ============================================================
     3. 导航指示条移动
     ============================================================ */
  var indicator = document.getElementById('navIndicator');

  function moveIndicator(el) {
    if (!el) {
      indicator.style.opacity = '0';
      return;
    }
    // 跳过主题切换按钮和头像（没有 data-target 或者是 button 元素）
    if (!el.getAttribute('data-target') || el.tagName === 'BUTTON') {
      indicator.style.opacity = '0';
      return;
    }
    indicator.style.opacity = '1';
    var rect = el.getBoundingClientRect();
    var parentRect = el.parentElement.getBoundingClientRect();
    // 计算相对于父容器的位置
    var left = rect.left - parentRect.left + el.parentElement.scrollLeft;
    indicator.style.left = left + 'px';
    indicator.style.width = rect.width + 'px';
  }

  /* ============================================================
     4. 平滑滚动
     ============================================================ */
  function smoothScrollTo(id) {
    var target = document.getElementById(id);
    if (!target) return;
    var offset = 70;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ============================================================
     5. 导航点击绑定
     ============================================================ */
  function bindNavClicks() {
    document.querySelectorAll('[data-target]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var id = link.getAttribute('data-target');
        smoothScrollTo(id);
        closeDrawer();
      });
    });
  }

  /* ============================================================
     6. IntersectionObserver 滚动高亮
     ============================================================ */
  var navLinks = document.querySelectorAll('.nav-link');

  function initSectionObserver() {
    var sections = document.querySelectorAll('section[id]');
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          navLinks.forEach(function (link) {
            // 跳过主题切换按钮
            if (!link.getAttribute('data-target') || link.tagName === 'BUTTON') return;
            var isActive = link.getAttribute('data-target') === id;
            link.classList.toggle('active', isActive);
            if (isActive) {
              moveIndicator(link);
            }
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ============================================================
     7. 移动端抽屉菜单
     ============================================================ */
  var drawer = document.getElementById('drawer');
  var overlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('show');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('show');
  }

  function bindDrawer() {
    var hamburger = document.getElementById('hamburger');
    var drawerClose = document.getElementById('drawerClose');
    if (hamburger) hamburger.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);
  }

  /* ============================================================
     8. 打字机效果（使用 profileData.roles）
     ============================================================ */
  function initTypewriter() {
    var typewriterEl = document.getElementById('typewriter');
    if (!typewriterEl) return;
    var roles = (typeof profileData !== 'undefined' && profileData.roles) ? profileData.roles : ['一名开发者'];
    var roleIdx = 0, charIdx = 0, deleting = false;

    function typeLoop() {
      var current = roles[roleIdx];
      if (deleting) {
        typewriterEl.textContent = current.substring(0, charIdx--);
        if (charIdx < 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(typeLoop, 400);
          return;
        }
        setTimeout(typeLoop, 50);
      } else {
        typewriterEl.textContent = current.substring(0, charIdx++);
        if (charIdx > current.length) {
          deleting = true;
          setTimeout(typeLoop, 1500);
          return;
        }
        setTimeout(typeLoop, 100);
      }
    }
    typeLoop();
  }

  /* ============================================================
     9. 项目渲染（使用 projectsData）
     ============================================================ */
  function renderProjects() {
    var track = document.getElementById('projectsTrack');
    if (!track) return;
    var data = (typeof projectsData !== 'undefined' && projectsData.length) ? projectsData : [];
    // 生成项目卡片HTML
    var cardsHtml = data.map(function (p) {
      var techHtml = p.tech.map(function (t) {
        return '<span class="tech-tag">' + t + '</span>';
      }).join('');
      return (
        '<div class="project-card">' +
          '<div class="project-cover"><img src="' + p.cover + '" alt="' + p.name + '" loading="lazy" /></div>' +
          '<div class="project-body">' +
            '<h3 class="project-name">' + p.name + '</h3>' +
            '<p class="project-desc">' + p.desc + '</p>' +
            '<div class="project-tech">' + techHtml + '</div>' +
            '<div class="project-links">' +
              '<a class="project-btn btn-primary" href="' + p.github + '" target="_blank">GitHub</a>' +
              '<a class="project-btn btn-ghost" href="' + p.demo + '" target="_blank">Demo</a>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
    track.innerHTML = cardsHtml;
  }

  /* ============================================================
     10. 时间线渲染（使用 timelineData）
     ============================================================ */
  function renderTimeline() {
    var list = document.getElementById('timelineList');
    if (!list) return;
    var data = (typeof timelineData !== 'undefined' && timelineData.length) ? timelineData : [];
    list.innerHTML = data.map(function (t) {
      return (
        '<div class="tl-item">' +
          '<div class="tl-dot"></div>' +
          '<div class="tl-card">' +
            '<span class="tl-year">' + t.year + '</span>' +
            '<h3 class="tl-title">' + t.title + '</h3>' +
            '<p class="tl-desc">' + t.desc + '</p>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  /* ============================================================
     11. 获取城市信息（ipwho.is API + 中英文映射兜底）
     ============================================================ */
  // 常见城市中英文映射表
  var cityMap = {
    'Beijing': '北京', 'Shanghai': '上海', 'Guangzhou': '广州', 'Shenzhen': '深圳',
    'Hangzhou': '杭州', 'Chengdu': '成都', 'Nanjing': '南京', 'Wuhan': '武汉',
    'Xi\'an': '西安', 'Chongqing': '重庆', 'Tianjin': '天津', 'Suzhou': '苏州',
    'Qingdao': '青岛', 'Dalian': '大连', 'Xiamen': '厦门', 'Kunming': '昆明',
    'Zhengzhou': '郑州', 'Changsha': '长沙', 'Hefei': '合肥', 'Fuzhou': '福州',
    'Jinan': '济南', 'Harbin': '哈尔滨', 'Shenyang': '沈阳', 'Taiyuan': '太原',
    'Shijiazhuang': '石家庄', 'Nanchang': '南昌', 'Guiyang': '贵阳', 'Lanzhou': '兰州',
    'Urumqi': '乌鲁木齐', 'Lhasa': '拉萨', 'Hohhot': '呼和浩特', 'Yinchuan': '银川',
    'Xining': '西宁', 'Nanning': '南宁', 'Haikou': '海口', 'Sanya': '三亚'
  };

  function toChineseCity(name) {
    if (!name) return '';
    // 如果已经是中文（包含中文字符），直接返回
    if (/[\u4e00-\u9fa5]/.test(name)) return name;
    // 尝试从映射表中查找
    return cityMap[name] || name;
  }

  function fetchLocation() {
    var tag = document.getElementById('locationTag');
    if (!tag) return;
    // 延迟执行，避免阻塞首屏渲染
    setTimeout(function() {
      fetch('https://ipwho.is/')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success && data.city) {
            var cityName = toChineseCity(data.city);
            tag.textContent = '欢迎来自：' + cityName + '的友人';
          } else {
            tag.textContent = '欢迎远方的友人';
          }
        })
        .catch(function () {
          tag.textContent = '欢迎远方的友人';
        });
    }, 1000);
  }

  /* ============================================================
     12. 今日诗词打字机效果（与首页风格一致）
     ============================================================ */
  function initPoemTypewriter() {
    var poemEl = document.getElementById('jinrishici-sentence');
    if (!poemEl) return;

    // 添加光标样式
    poemEl.classList.add('poem-typewriter');

    var poems = [];
    var poemIdx = 0, charIdx = 0, deleting = false;

    // 等待今日诗词 SDK 加载完成
    var checkInterval = setInterval(function () {
      var text = poemEl.textContent || '';
      if (text && text !== '正在加载今日诗词....' && text.length > 0) {
        clearInterval(checkInterval);
        // 保存第一首诗词
        poems.push(text);
        // 清空内容，开始打字动画
        poemEl.textContent = '';
        typeLoop();
      }
    }, 300);

    // 超时保护
    setTimeout(function () { clearInterval(checkInterval); }, 5000);

    function typeLoop() {
      var current = poems[poemIdx] || '';
      if (deleting) {
        poemEl.textContent = current.substring(0, charIdx--);
        if (charIdx < 0) {
          deleting = false;
          poemIdx = (poemIdx + 1) % poems.length;
          setTimeout(typeLoop, 400);
          return;
        }
        setTimeout(typeLoop, 50);
      } else {
        poemEl.textContent = current.substring(0, charIdx++);
        if (charIdx > current.length) {
          deleting = true;
          setTimeout(typeLoop, 2000);
          return;
        }
        setTimeout(typeLoop, 100);
      }
    }

    // 监听 SDK 后续更新（如果 SDK 会刷新诗词）
    var observer = new MutationObserver(function () {
      var newText = poemEl.textContent || '';
      if (newText && newText !== '正在加载今日诗词....') {
        // 检查是否是新诗词
        var isNew = true;
        for (var i = 0; i < poems.length; i++) {
          if (poems[i] === newText) { isNew = false; break; }
        }
        if (isNew) {
          poems.push(newText);
        }
      }
    });
    observer.observe(poemEl, { childList: true, characterData: true, subtree: true });
  }

  /* ============================================================
     11. 通用淡入动画 + 时间线滑入（load 后才观察，避免误触发）
     ============================================================ */
  function initRevealAnimations() {
    // 通用淡入
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

    // 时间线节点单独观察
    var tlObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.tl-item').forEach(function (el) { tlObserver.observe(el); });
  }


  /* ============================================================
     初始化入口
     ============================================================ */
  function init() {
    initTheme();
    bindNavClicks();
    bindDrawer();
    initTypewriter();
    renderProjects();
    renderTimeline();
    fetchLocation();
    initPoemTypewriter();
    initGalleryLightbox();

    // 滚动监听
    window.addEventListener('scroll', onScroll, { passive: true });

    // 主题切换按钮
    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    // 导航头像点击回顶
    var navAvatar = document.querySelector('.nav-avatar');
    if (navAvatar) navAvatar.addEventListener('click', scrollToTop);

    // 滚动高亮
    initSectionObserver();

    // 窗口 resize 时重新定位指示条
    window.addEventListener('resize', function () {
      var active = document.querySelector('.nav-link.active');
      if (active) moveIndicator(active);
    });

    // load 后启动淡入动画 + 初始指示条定位
    window.addEventListener('load', function () {
      initRevealAnimations();
      var active = document.querySelector('.nav-link.active');
      if (active) moveIndicator(active);
    });
  }

  /* ============================================================
     11. 图片轮播全屏查看 (Lightbox) - 左右分栏 + 切换功能
     ============================================================ */
  function initGalleryLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxTitle = document.getElementById('lightboxTitle');
    var lightboxDesc = document.getElementById('lightboxDesc');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');
    var galleryItems = document.querySelectorAll('.gallery-item');

    if (!lightbox || !lightboxImg) return;

    var currentIndex = 0;
    var totalImages = 8; // 实际图片数量（不计算复制的）

    // 图片介绍数据
    var galleryData = [
      { title: '绿意镜影', desc: '我站在玻璃窗前，用手机记录下这美好的瞬间。透过玻璃，窗外的绿树倒影与我的身影重叠，形成了一种独特的双重曝光效果。阳光透过树叶洒下斑驳的光影，红白相间的校服在绿意中格外醒目。这是一个在户外休闲场所拍摄的日常片段，玻璃上的树影与人物相映成趣，展现了都市中难得的自然气息。', date: '2021年春', tag: '生活记录' },
      { title: '校园春景', desc: '晴朗的春日，红砖教学楼静静矗立在绿树环绕之中，前方池塘倒映着蓝天与绿意。这是在校园中捕捉到的宁静而美好的日常景象，展现了学习环境的和谐与自然之美。', date: '2024年春', tag: '校园风光' },
      { title: '黄昏校园', desc: '傍晚时分，红砖教学楼在橙黄色的天幕下静静矗立，建筑间的绿化区域与树木构成了一幅宁静的校园景象。这是在校园中捕捉到的黄昏美景，展现了学习环境的平和与自然之美。', date: '2024年春', tag: '校园风光' },
      { title: '知识殿堂', desc: '现代图书馆的圆形玻璃结构上，"探索思想的疆域，发现知识的奇迹"的文字与书架的倒影交织，形成独特的视觉效果。这是一个充满艺术感的阅读空间，展现了知识与文化的魅力。', date: '2024年春', tag: '文化空间' },
      { title: '乐园风光', desc: '透过茂密的绿树，远处的摩天轮在灰蓝色的天幕下静静矗立，绿色的座舱点缀其间。右侧可见其他游乐设施，整个场景充满了休闲与欢乐的氛围。这是在游乐园中捕捉到的轻松时刻，展现了娱乐空间的活力与魅力。', date: '2025年春', tag: '游乐园' },
      { title: '高达雕像', desc: '巨大的高达机器人雕像矗立在商业区，白色、蓝色和红色的配色方案十分醒目。背景中可见UNIQLO商店和其他现代建筑，这个动漫角色成为城市景观中引人注目的地标。这是在商业区拍摄的文化地标照片，展现了动漫文化与城市环境的融合。', date: '2025年春', tag: '动漫文化' },
      { title: '慈悲观音', desc: '巨大的观音雕像庄严矗立，灰色石材雕刻出细腻的衣纹和装饰，右手结印，左手持物，坐于莲花座上。背景是古建筑檐角，灰蒙的天空增添肃穆感。这是在宗教场所拍摄的佛教艺术作品，展现了信仰与艺术的融合。', date: '2026年春', tag: '宗教文化' },
      { title: '蓝天绿树', desc: '晴朗的蓝天下，一棵茂盛的绿树伸展枝叶，背景中可见城市建筑。这是在城市中捕捉到的自然与都市交融的景象，展现了城市中的绿色生机。', date: '2026年春', tag: '自然风光' }
    ];

    // 优先使用每个 .gallery-item 的 data-full，并把反斜杠规范化成 URL 可用的 /
    var galleryFullSrcs = Array.prototype.slice.call(galleryItems).slice(0, totalImages).map(function (item) {
      var src = item && (item.getAttribute('data-full') || (item.dataset && item.dataset.full));
      if (!src) return 'https://picsum.photos/seed/gallery' + (galleryItems.length + 1) + '/1200/800';
      return src.replace(/\\/g, '/');
    });

    // 更新全屏查看器内容
    function updateLightbox(index) {
      var data = galleryData[index];
      var fullSrc = galleryFullSrcs[index] || ('https://picsum.photos/seed/gallery' + (index + 1) + '/1200/800');

      lightboxImg.src = fullSrc;
      lightboxTitle.textContent = data.title;
      lightboxDesc.textContent = data.desc;

      // 更新meta信息
      var metaContainer = lightbox.querySelector('.lightbox-meta');
      if (metaContainer) {
        metaContainer.innerHTML = '<span class="lightbox-date">' + data.date + '</span>' +
          '<span class="lightbox-tag">' + data.tag + '</span>';
      }
    }

    // 显示上一张
    function showPrev() {
      currentIndex = (currentIndex - 1 + totalImages) % totalImages;
      updateLightbox(currentIndex);
    }

    // 显示下一张
    function showNext() {
      currentIndex = (currentIndex + 1) % totalImages;
      updateLightbox(currentIndex);
    }

    // 点击图片打开全屏
    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () {
        currentIndex = index % totalImages;
        updateLightbox(currentIndex);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    // 关闭全屏
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // 上一张按钮
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        showPrev();
      });
    }

    // 下一张按钮
    if (lightboxNext) {
      lightboxNext.addEventListener('click', function (e) {
        e.stopPropagation();
        showNext();
      });
    }

    // 点击遮罩关闭
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
        closeLightbox();
      }
    });

    // 键盘控制
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showPrev();
      } else if (e.key === 'ArrowRight') {
        showNext();
      }
    });
  }

  // DOM 就绪后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
