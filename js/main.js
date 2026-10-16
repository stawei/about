/* 数据配置 */
const profileData = {
  name: '浅小兮',
  roles: ['一名开发者', '一名设计师', '一名终身学习者', '一名热爱生活的人'],
  // 社交链接单一数据源：Hero 胶囊与页脚「联系我」均由此渲染。
  // 头像等本地图片仍留在 index.html，保持 img/ 相对路径由 HTML 单一处声明
  socials: [
    { key: 'github', icon: 'ri-github-fill', label: 'GitHub', href: 'https://github.com/stawei' },
    { key: 'bilibili', icon: 'ri-bilibili-fill', label: 'B站', href: 'https://space.bilibili.com/516107164' },
    { key: 'email', icon: 'ri-mail-send-line', label: '邮箱', href: 'mailto:2963286491@qq.com', footerIcon: 'ri-mail-line', footerLabel: '2963286491@qq.com' },
    { key: 'douyin', icon: 'ri-tiktok-line', label: '抖音', href: 'https://www.douyin.com/search/963209970' },
    { key: 'qq', icon: 'ri-qq-line', label: 'QQ', href: 'https://qm.qq.com/q/2963286491' }
  ]
};

const introData = {
  paragraphs: [
    '你好呀，很高兴认识你👋我是<strong>浅小兮</strong>，你也可以称呼<strong>千曦一梦</strong>或者<strong>不羡明月知</strong>。一名热爱构建数字产品的开发者——看着一行行代码慢慢长出模样，变成别人能点开、能用上的东西，那种满足感，什么都替代不了。',
    '我主要关注 <strong>前后端工程</strong> 与 <strong>大数据运维</strong>，总觉得一个舒服的技术实现，得既有靠谱的底子，又有让人眼前一亮的样子。',
    '不忙的时候，喜欢泡在开源项目里写写改改，在博客里记下踩过的坑和冒出的光，也随手做些小工具，解决生活里那些不起眼的小麻烦。',
    '最近在学习更多关于 <strong>全栈架构</strong> 和 <strong>AI 应用</strong> 的知识。如果你对同样的领域感兴趣，欢迎随时和我交流。',
    '喜欢 <strong>音乐</strong>、<strong>阅读</strong> 和 <strong>刷抖音</strong>，当然偶尔也会<strong>运动</strong>一下下的，这些细碎的爱好让生活不至于太紧绷，也常常给我送来意想不到的灵感。'
  ],
  // level 为掌握度，悬停技能标签时由 initSkillMeter() 填充到计量条
  skills: [
    { name: 'Java', level: '70%' },
    { name: 'TypeScript', level: '95%' },
    { name: 'JavaScript', level: '90%' },
    { name: 'React', level: '80%' },
    { name: 'Node.js', level: '75%' },
    { name: 'Python', level: '70%' },
    { name: 'Docker', level: '65%' },
    { name: 'Git', level: '90%' },
    { name: 'Msql', level: '70%' },
    { name: 'Hive', level: '65%' }
  ],
  tags: ['浅小兮', '千曦一梦', '多喜乐，常安宁', 'zxwlove', '@location', '相遇的刹那开始就注定了别离']
};

/* 项目卡片数据。热度竖条由 js/uptimerobot.js 按 demo 域名匹配 UptimeRobot 监控；
   若某项目的线上域名与 demo 不一致（如走备用域名），加 heatHost: '监控里的域名' 手动指定 */
const projectsData = [
  {
    cover: 'https://free.picui.cn/free/2026/08/22/6a892f855b0f4.png',
    name: '个人主页Home',
    desc: '这个参照github大神优化修改的项目，网站为zxwlove.cn备用线路为zxwlove.us.ci',
    tech: ['Node.js'],
    github: 'https://github.com/stawei/home',
    demo: 'https://zxwlove.us.ci/'
  },
  {
    cover: 'https://free.picui.cn/free/2026/08/22/6a892b9dc13b5.png',
    name: 'Hexo-Blog',
    desc: '根据Hexo框架搭建的个人博客，展示了我的前端技能和内容创作能力。',
    tech: ['Hexo'],
    github: 'https://github.com/stawei/hexo-blog',
    demo: 'https://blog.zxwlove.us.ci/'
  },
  {
    cover: 'https://free.picui.cn/free/2026/08/22/6a892ec572f60.png',
    name: '关于我',
    desc: '一个简单的自我介绍页面。',
    tech: ['JavaScript'],
    github: 'https://github.com/stawei/about',
    demo: 'https://zxwlove.cc.cd/'
  },
  {
    cover: 'https://free.picui.cn/free/2026/08/22/6a89311a517fd.png',
    name: 'Starlight',
    desc: '个人设计的Blog',
    tech: ['Starlight'],
    github: 'https://github.com/stawei/Starlight',
    demo: 'https://zxwlove.xyz/'
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
  // 多平台歌单配置（播放器主题色由 CSS 变量控制，此处仅数据源）
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
  ]
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
     9. 项目渲染（使用 projectsData）- 看板条目 + 活跃度竖条
     ============================================================ */

  /**
   * 兜底热度：以项目名为种子生成稳定的 12 段强度值（对应近 12 个月）。
   * 仅在 UptimeRobot 未覆盖该项目（js/uptimerobot.js 未命中监控域名）时使用，
   * 同一名称每次渲染结果一致，不会随刷新跳动。
   */
  function projectActivity(seed) {
    var h = 2166136261;
    for (var i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    var out = [];
    for (var m = 0; m < 12; m++) {
      h = (h * 1664525 + 1013904223) >>> 0;
      var noise = (h % 1000) / 1000;
      // 越靠近当前月份越强，营造「仍在维护」的趋势
      var trend = 0.5 + (m / 11) * 0.5;
      out.push(Math.min(1, 0.18 + noise * 0.5 + trend * 0.32));
    }
    return out;
  }

  function renderProjects() {
    var rows = document.getElementById('projectsRows');
    if (!rows) return;
    var data = (typeof projectsData !== 'undefined' && projectsData.length) ? projectsData : [];

    var count = document.getElementById('projectsCount');
    if (count) count.textContent = data.length ? '共 ' + data.length + ' 个' : '';

    if (data.length === 0) {
      rows.innerHTML = '<p class="projects-empty">项目整理中，稍后再来看看。</p>';
      return;
    }

    rows.innerHTML = data.map(function (p) {
      var tech = p.tech || [];
      var badges = tech.slice(0, 2).map(function (t) {
        return '<span class="pr-badge">' + t + '</span>';
      }).join('');
      if (tech.length > 2) {
        badges += '<span class="pr-badge pr-badge-more" title="' + tech.slice(2).join(' / ') + '">+' + (tech.length - 2) + '</span>';
      }
      // 真实数据优先：命中 UptimeRobot 监控域名时用逐月可用率，否则回落种子热度
      var heat = (window.ProjectHeat && window.ProjectHeat.get) ? window.ProjectHeat.get(p) : null;
      var values = heat ? heat.values : projectActivity(p.name);
      var bars = values.map(function (v, i) {
        var tip = '';
        if (heat) {
          tip = heat.uptimes[i] === null
            ? heat.labels[i] + ' 无监控记录'
            : heat.labels[i] + ' 可用率 ' + (Math.round(heat.uptimes[i] * 1000) / 10).toFixed(1) + '%';
        }
        return '<span class="pr-bar' + (v >= 0.72 ? ' is-active' : '') +
               '" style="--o:' + v.toFixed(2) + '"' +
               (tip ? ' title="' + tip + '"' : '') + '></span>';
      }).join('');

      var links =
        (p.github ? '<a class="pr-link" href="' + p.github + '" target="_blank" rel="noopener noreferrer" title="查看源码" aria-label="' + p.name + ' 源码"><i class="ri-github-fill" aria-hidden="true"></i></a>' : '') +
        (p.demo ? '<a class="pr-link" href="' + p.demo + '" target="_blank" rel="noopener noreferrer" title="访问站点" aria-label="' + p.name + ' 在线访问"><i class="ri-external-link-line" aria-hidden="true"></i></a>' : '');

      return (
        '<article class="project-row">' +
          '<div class="pr-main">' +
            (p.cover
              ? (p.demo
                  // 封面可点击直达项目站点；无 demo 的项目保持纯图片
                  ? '<a class="pr-cover-link" href="' + p.demo + '" target="_blank" rel="noopener noreferrer" title="访问 ' + p.name + '" aria-label="' + p.name + ' 在线访问"><img class="pr-cover" src="' + p.cover + '" alt="" loading="lazy" /></a>'
                  : '<img class="pr-cover" src="' + p.cover + '" alt="" loading="lazy" aria-hidden="true" />')
              : '') +
            '<div class="pr-text">' +
              '<div class="pr-head">' +
                '<h3 class="pr-name">' + p.name + '</h3>' +
              '</div>' +
              (p.desc ? '<p class="pr-desc">' + p.desc + '</p>' : '') +
              (badges ? '<div class="pr-badges">' + badges + '</div>' : '') +
            '</div>' +
          '</div>' +
          '<div class="pr-side">' +
            '<div class="pr-bars' + (heat ? ' is-live' : '') + '" aria-hidden="true">' + bars + '</div>' +
            '<div class="pr-scale"><span>近 12 个月</span><span>' +
              (heat ? heat.avgText : '维护热度') +
            '</span></div>' +
            (links ? '<div class="pr-links">' + links + '</div>' : '') +
          '</div>' +
        '</article>'
      );
    }).join('');
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
     10a. 自我介绍渲染（使用 introData）——段落 / 技能标签 / 标签卡
     ============================================================ */
  function renderIntro() {
    var data = (typeof introData !== 'undefined') ? introData : null;
    if (!data) return;

    // 段落：插到 .intro-text 最前，技能云与计量条保持静态结构
    var textEl = document.querySelector('#intro .intro-text');
    if (textEl && Array.isArray(data.paragraphs)) {
      var frag = document.createDocumentFragment();
      data.paragraphs.forEach(function (html) {
        var p = document.createElement('p');
        // 文案为本地数据常量，含受控 <strong> 标记，与项目/时间线渲染方式一致
        p.innerHTML = html;
        frag.appendChild(p);
      });
      textEl.insertBefore(frag, textEl.firstChild);
    }

    // 技能标签：data-level 驱动悬停计量条
    var cloud = document.querySelector('#intro .skill-cloud');
    if (cloud && Array.isArray(data.skills)) {
      cloud.textContent = '';
      data.skills.forEach(function (s) {
        var pill = document.createElement('span');
        pill.className = 'skill-pill';
        pill.textContent = s.name;
        if (s.level) pill.setAttribute('data-level', s.level);
        cloud.appendChild(pill);
      });
    }

    // 标签卡：'@location' 占位处放回访客城市标签（由 fetchLocation 填充）
    var tagsCard = document.getElementById('introTags');
    if (tagsCard && Array.isArray(data.tags)) {
      var locAnchor = document.getElementById('locationTag');
      tagsCard.textContent = '';
      data.tags.forEach(function (t) {
        if (t === '@location') {
          if (locAnchor) tagsCard.appendChild(locAnchor);
          return;
        }
        var span = document.createElement('span');
        span.className = 'intro-tag';
        span.textContent = t;
        tagsCard.appendChild(span);
      });
      if (locAnchor && !locAnchor.parentNode) tagsCard.appendChild(locAnchor);
    }
  }

  /* ============================================================
     10c. 社交链接渲染（使用 profileData.socials）——Hero 胶囊 + 页脚「联系我」
     ============================================================ */
  function makeSocialLink(s, opts) {
    opts = opts || {};
    var a = document.createElement('a');
    a.href = s.href;
    if (!/^mailto:/i.test(s.href)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    a.setAttribute('aria-label', s.label);
    if (opts.className) a.className = opts.className;
    var i = document.createElement('i');
    i.className = typeof opts.icon === 'function' ? opts.icon(s) : s.icon;
    var span = document.createElement('span');
    span.textContent = typeof opts.label === 'function' ? opts.label(s) : s.label;
    a.appendChild(i);
    a.appendChild(span);
    return a;
  }

  function renderSocials() {
    var wrap = document.getElementById('heroSocials');
    if (!wrap || !Array.isArray(profileData.socials)) return;
    wrap.textContent = '';
    profileData.socials.forEach(function (s) {
      wrap.appendChild(makeSocialLink(s, { className: 'social-btn social-pill' }));
    });
  }

  function renderFooterContact() {
    var list = document.getElementById('footerContact');
    if (!list || !Array.isArray(profileData.socials)) return;
    list.textContent = '';
    ['email', 'github', 'qq'].forEach(function (key) {
      var s = profileData.socials.find(function (x) { return x.key === key; });
      if (!s) return;
      var li = document.createElement('li');
      li.appendChild(makeSocialLink(s, {
        icon: function (x) { return x.footerIcon || x.icon; },
        label: function (x) { return x.footerLabel || x.label; }
      }));
      list.appendChild(li);
    });
  }

  /* ============================================================
     10b. 技能掌握度计量条（悬停/聚焦技能标签 → 填充到 data-level）
     ============================================================ */
  function initSkillMeter() {
    var cloud = document.querySelector('.skill-cloud');
    var meter = document.getElementById('skillMeter');
    if (!cloud || !meter) return;
    var fill = meter.querySelector('.skill-meter-fill');
    var nameEl = meter.querySelector('.skill-meter-name');
    var valEl = meter.querySelector('.skill-meter-val');
    var pills = cloud.querySelectorAll('.skill-pill[data-level]');

    var DEFAULT_NAME = '悬停技能查看掌握度';

    function show(pill) {
      // data-level 形如 "95%"，仅取数字并夹到 0-100，避免异常值撑破轨道
      var n = parseFloat(pill.getAttribute('data-level'));
      if (isNaN(n)) return;
      n = Math.max(0, Math.min(100, n));
      fill.style.width = n + '%';
      nameEl.textContent = pill.textContent.trim();
      valEl.textContent = n + '%';
      meter.classList.add('is-active');
      meter.setAttribute('aria-valuenow', String(n));
      meter.setAttribute('aria-valuetext', nameEl.textContent + ' ' + n + '%');
    }

    function reset() {
      fill.style.width = '0%';
      nameEl.textContent = DEFAULT_NAME;
      valEl.textContent = '--';
      meter.classList.remove('is-active');
      meter.setAttribute('aria-valuenow', '0');
      meter.removeAttribute('aria-valuetext');
    }

    pills.forEach(function (pill) {
      pill.setAttribute('tabindex', '0');
      pill.addEventListener('pointerenter', function () { show(pill); });
      pill.addEventListener('pointerleave', reset);
      // 键盘可达：聚焦即展示
      pill.addEventListener('focus', function () { show(pill); });
      pill.addEventListener('blur', reset);
      // 触屏无 hover：点按切换展示
      pill.addEventListener('click', function (e) {
        if (window.matchMedia('(hover: hover)').matches) return;
        e.preventDefault();
        show(pill);
      });
    });

    reset();
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
    var heroCity = document.getElementById('heroCity');
    if (!tag && !heroCity) return;
    // 延迟执行，避免阻塞首屏渲染
    setTimeout(function() {
      fetch('https://ipwho.is/')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success && data.city) {
            var cityName = toChineseCity(data.city);
            if (tag) tag.textContent = '欢迎来自：' + cityName + '的友人';
            if (heroCity) {
              heroCity.textContent = cityName;
              fetchWeather(cityName.replace(/市$/, ''));
            }
          } else {
            if (tag) tag.textContent = '欢迎远方的友人';
            if (heroCity) heroCity.textContent = '远方';
            fetchWeather(); // 不带 city，由天气接口按 IP 自动定位
          }
        })
        .catch(function () {
          if (tag) tag.textContent = '欢迎远方的友人';
          if (heroCity) heroCity.textContent = '远方';
          fetchWeather();
        });
    }, 1000);
  }

  /* 头像下状态条：地区后的天气段（uapis.cn 天气接口），失败则保持隐藏 */
  function fetchWeather(city) {
    var el = document.getElementById('heroWeather');
    var sep = document.querySelector('.hero-weather-sep');
    if (!el) return;
    var url = 'https://uapis.cn/api/v1/misc/weather';
    if (city) url += '?city=' + encodeURIComponent(city);
    fetch(url)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data || !data.weather || typeof data.temperature !== 'number') return;
        // 逐节点构建，API 文本走 textContent，避免 HTML 注入
        el.textContent = '';
        var icon = document.createElement('i');
        icon.className = weatherIcon(data.weather);
        el.appendChild(icon);
        el.appendChild(document.createTextNode(' ' + data.weather + ' · ' + data.temperature + '℃'));
        el.hidden = false;
        if (sep) sep.hidden = false;
      })
      .catch(function () { /* 接口不可用时静默隐藏，不影响时间/地点 */ });
  }

  /* 按天气现象文字匹配 Remix Icon，未命中用多云兜底 */
  function weatherIcon(w) {
    if (/晴/.test(w)) return 'ri-sun-line';
    if (/云|阴/.test(w)) return 'ri-cloud-line';
    if (/雷/.test(w)) return 'ri-flashlight-line';
    if (/雨/.test(w)) return 'ri-rainy-line';
    if (/雪/.test(w)) return 'ri-snowflake-line';
    if (/雾|霾/.test(w)) return 'ri-mist-line';
    if (/风/.test(w)) return 'ri-windy-line';
    return 'ri-cloud-line';
  }

  /* Hero 头像下状态条：实时时间（HH:MM），每分钟刷新 */
  function initHeroClock() {
    var el = document.getElementById('heroTime');
    if (!el) return;
    function tick() {
      var d = new Date();
      var hh = ('0' + d.getHours()).slice(-2);
      var mm = ('0' + d.getMinutes()).slice(-2);
      el.textContent = hh + ':' + mm;
    }
    tick();
    setInterval(tick, 60000);
  }

  /* ============================================================
     12. 今日诗词打字机效果（与首页风格一致）
     ============================================================ */
  function initPoemTypewriter() {
    var poemEl = document.getElementById('jinrishici-sentence');
    if (!poemEl) return;

    // 添加光标样式
    poemEl.classList.add('poem-typewriter');

    // 等待今日诗词 SDK 加载完成
    var checkInterval = setInterval(function () {
      var text = poemEl.textContent || '';
      if (text && text !== '正在加载今日诗词....' && text.length > 0) {
        clearInterval(checkInterval);
        // 清空内容，开始打字动画
        poemEl.textContent = '';
        typeOnce(text);
      }
    }, 300);

    // 超时保护
    setTimeout(function () { clearInterval(checkInterval); }, 5000);

    // 只打一遍：打完立刻收尾，不再回删轮播
    function typeOnce(poem) {
      var i = 0;
      function step() {
        if (i > poem.length) {
          poemEl.textContent = poem;
          // 移除光标，静置成一行普通诗词
          poemEl.classList.remove('poem-typewriter');
          return;
        }
        poemEl.textContent = poem.substring(0, i++);
        setTimeout(step, 100);
      }
      step();
    }
  }

  /* ============================================================
     11. 通用淡入动画 + 时间线滑入（DOM 就绪即观察，不等外链加载完）
     ============================================================ */
  var revealObserver = null;

  /* 共用淡入观察器：静态 HTML 与 JS 注入的卡片、时间线节点都走同一个实例 */
  function getRevealObserver() {
    if (revealObserver) return revealObserver;
    if (!('IntersectionObserver' in window)) return null;
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    return revealObserver;
  }

  function initRevealAnimations() {
    var observer = getRevealObserver();
    var targets = document.querySelectorAll('.reveal, .tl-item');
    console.info('[reveal] 入场动画挂载：目标 ' + targets.length + ' 个，观察器' + (observer ? '可用' : '不可用（降级直接显示）'));
    if (!observer) {
      // 无 IntersectionObserver 时直接显示，绝不允许内容保持隐藏
      targets.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    targets.forEach(function (el) { observer.observe(el); });

    // 兜底：异常情况下（观察器未回调、脚本被拦截）超时强制显示，避免区块永久空白
    setTimeout(function () {
      var forced = 0;
      targets.forEach(function (el) {
        if (!el.classList.contains('visible')) {
          el.classList.add('visible');
          observer.unobserve(el);
          forced++;
        }
      });
      if (forced) console.warn('[reveal] 兜底强制显示 ' + forced + ' 个元素（观察器未按时回调）');
    }, 2500);
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
    // 拉取 UptimeRobot 真实可用性数据后重绘热度竖条（失败静默，保留种子热度）
    if (window.ProjectHeat && window.ProjectHeat.load) {
      window.ProjectHeat.load().then(function (idx) {
        if (idx) renderProjects();
      });
    }
    renderTimeline();
    renderIntro();
    renderSocials();
    renderFooterContact();
    initSkillMeter();
    fetchLocation();
    initHeroClock();
    initPoemTypewriter();
    initGalleryLightbox();
    initGalleryNav();

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

    // 淡入动画：DOM 就绪即挂载，不等外链（CDN 脚本/字体）加载完成
    initRevealAnimations();

    // 窗口 resize 时重新定位指示条
    window.addEventListener('resize', function () {
      var active = document.querySelector('.nav-link.active');
      if (active) moveIndicator(active);
    });

    // load 后仅定位初始指示条
    window.addEventListener('load', function () {
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
    var lightboxArrowPrev = document.getElementById('lightboxArrowPrev');
    var lightboxArrowNext = document.getElementById('lightboxArrowNext');
    var galleryItems = document.querySelectorAll('.gallery-item');

    if (!lightbox || !lightboxImg) return;

    var currentIndex = 0;

    // 图片介绍数据
    var galleryData = [
      { title: '绿意镜影', desc: '我站在玻璃窗前，用手机记录下这美好的瞬间。透过玻璃，窗外的绿树倒影与我的身影重叠，形成了一种独特的双重曝光效果。阳光透过树叶洒下斑驳的光影，红白相间的校服在绿意中格外醒目。这是一个在户外休闲场所拍摄的日常片段，玻璃上的树影与人物相映成趣，展现了都市中难得的自然气息。', date: '2021·春', tag: '生活记录' },
      { title: '校园春景', desc: '晴朗的春日，红砖教学楼静静矗立在绿树环绕之中，前方池塘倒映着蓝天与绿意。这是在校园中捕捉到的宁静而美好的日常景象，展现了学习环境的和谐与自然之美。', date: '2024·春', tag: '校园风光' },
      { title: '黄昏校园', desc: '傍晚时分，红砖教学楼在橙黄色的天幕下静静矗立，建筑间的绿化区域与树木构成了一幅宁静的校园景象。这是在校园中捕捉到的黄昏美景，展现了学习环境的平和与自然之美。', date: '2024·春', tag: '校园风光' },
      { title: '知识殿堂', desc: '现代图书馆的圆形玻璃结构上，"探索思想的疆域，发现知识的奇迹"的文字与书架的倒影交织，形成独特的视觉效果。这是一个充满艺术感的阅读空间，展现了知识与文化的魅力。', date: '2024·春', tag: '文化空间' },
      { title: '乐园风光', desc: '透过茂密的绿树，远处的摩天轮在灰蓝色的天幕下静静矗立，绿色的座舱点缀其间。右侧可见其他游乐设施，整个场景充满了休闲与欢乐的氛围。这是在游乐园中捕捉到的轻松时刻，展现了娱乐空间的活力与魅力。', date: '2025·春', tag: '游乐园' },
      { title: '高达雕像', desc: '巨大的高达机器人雕像矗立在商业区，白色、蓝色和红色的配色方案十分醒目。背景中可见UNIQLO商店和其他现代建筑，这个动漫角色成为城市景观中引人注目的地标。这是在商业区拍摄的文化地标照片，展现了动漫文化与城市环境的融合。', date: '2025·春', tag: '动漫文化' },
      { title: '慈悲观音', desc: '巨大的观音雕像庄严矗立，灰色石材雕刻出细腻的衣纹和装饰，右手结印，左手持物，坐于莲花座上。背景是古建筑檐角，灰蒙的天空增添肃穆感。这是在宗教场所拍摄的佛教艺术作品，展现了信仰与艺术的融合。', date: '2026·春', tag: '宗教文化' },
      { title: '蓝天绿树', desc: '晴朗的蓝天下，一棵茂盛的绿树伸展枝叶，背景中可见城市建筑。这是在城市中捕捉到的自然与都市交融的景象，展现了城市中的绿色生机。', date: '2026·春', tag: '自然风光' }
    ];

    var totalImages = galleryData.length;

    // 大图直接取卡片 img 已解析的 src，与角标声明保持同源，不重复写死 img/ 路径
    var galleryFullSrcs = Array.prototype.slice.call(galleryItems).slice(0, totalImages).map(function (item) {
      var img = item && item.querySelector('img');
      return img ? img.src : '';
    });

    // 卡片角标（时间/名称）由 galleryData 注入，index.html 不再重复硬编码
    Array.prototype.slice.call(galleryItems).slice(0, totalImages).forEach(function (item, i) {
      var g = galleryData[i];
      if (!g || item.querySelector('.gi-name')) return;
      var img = item.querySelector('img');
      if (img && !img.getAttribute('alt')) img.setAttribute('alt', g.title);
      var time = document.createElement('span');
      time.className = 'gi-time';
      time.textContent = g.date;
      var name = document.createElement('span');
      name.className = 'gi-name';
      name.textContent = g.title;
      item.appendChild(time);
      item.appendChild(name);
    });

    // 更新全屏查看器内容
    function updateLightbox(index) {
      var data = galleryData[index];
      var fullSrc = galleryFullSrcs[index];

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

    // 打开全屏
    function openLightbox(index) {
      currentIndex = index % totalImages;
      updateLightbox(currentIndex);
      lightbox.classList.add('active');
      // 禁止页面滚动并固定位置
      var scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '-' + scrollY + 'px';
      document.body.dataset.scrollY = scrollY;
    }

    // 点击图片打开全屏
    galleryItems.forEach(function (item, index) {
      item.addEventListener('click', function () {
        openLightbox(index);
      });
    });

    // 关闭全屏
    function closeLightbox() {
      lightbox.classList.remove('active');
      // 恢复页面滚动
      var scrollY = document.body.dataset.scrollY || 0;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      // 恢复滚动位置
      window.scrollTo(0, parseInt(scrollY));
      lightboxImg.src = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // 上一张按钮（文字区域）
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        showPrev();
      });
    }

    // 下一张按钮（文字区域）
    if (lightboxNext) {
      lightboxNext.addEventListener('click', function (e) {
        e.stopPropagation();
        showNext();
      });
    }

    // 左右箭头按钮（图片区域）
    if (lightboxArrowPrev) {
      lightboxArrowPrev.addEventListener('click', function (e) {
        e.stopPropagation();
        showPrev();
      });
    }

    if (lightboxArrowNext) {
      lightboxArrowNext.addEventListener('click', function (e) {
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

  /* ============================================================
     12. 图展左右切换按钮（滚动 .gallery-strip 一张卡一步）
     ============================================================ */
  function initGalleryNav() {
    var strip = document.querySelector('#gallery .gallery-strip');
    var prev = document.getElementById('galleryPrev');
    var next = document.getElementById('galleryNext');
    if (!strip || !prev || !next) return;
    var track = strip.querySelector('.gallery-track');

    // 一步 = 一张卡宽 + gap
    function step() {
      var item = track && track.querySelector('.gallery-item');
      if (!item) return strip.clientWidth * 0.8;
      var st = window.getComputedStyle(track);
      var gap = parseFloat(st.columnGap || st.gap) || 16;
      return item.getBoundingClientRect().width + gap;
    }

    function update() {
      var max = strip.scrollWidth - strip.clientWidth;
      prev.disabled = strip.scrollLeft <= 1;
      next.disabled = strip.scrollLeft >= max - 1;
    }

    prev.addEventListener('click', function () {
      strip.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      strip.scrollBy({ left: step(), behavior: 'smooth' });
    });
    strip.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // 图片懒加载完成后宽度稳定，再校准按钮禁用态
    if (window.ResizeObserver && track) new ResizeObserver(update).observe(track);
    window.addEventListener('load', update);
    update();
  }

  // DOM 就绪后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
