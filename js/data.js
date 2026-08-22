/* ============================================================
   个人主页 - 数据配置文件
   所有需要替换的占位内容集中在此文件
   ============================================================ */

// 【替换】个人信息
const profileData = {
  name: '浅小兮',
  avatar: '/img/avatar.jpg',
  logoAvatar: '/img/avatar.jpg',
  portrait: '/img/avatar.jpg',
  location: '中国',
  roles: ['一名开发者', '一名设计师', '一名终身学习者', '一名热爱生活的人'],
  socials: {
    github: 'https://github.com/stawei',
    bilibili: 'https://space.bilibili.com/516107164',
    email: 'mailto:2963286491@qq.com'
  }
};

// 【替换】自我介绍文本
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

// 【替换】项目数据，增删卡片在此修改
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
    tech: [ 'HTML','JavaScript', 'CSS'],
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

// 【替换】时间线数据，增删节点在此修改
const timelineData = [
  { year: '2022', title: '接触编程', desc: '写下第一行 Hello World，打开了新世界的大门。' },
  { year: '2023', title: '完成第一个项目', desc: '从零搭建了一个完整应用，理解了工程化的意义。' },
  { year: '2023.12.01', title: '开始写博客', desc: '互联网的编程小船启航，把学习笔记整理成文章分享，倒逼自己深入思考。' },
  { year: '2025', title: '持续学习中', desc: '探索全栈与 AI 应用，构建更有影响力的产品。' },
  { year: '2025.06-2626.06', title: '失踪人口', desc: '因为毕业找工作租房等，暂停了编程。' },
  { year: '2026.06-至今', title: '回归', desc: '开始朝花夕拾~' }
];

// 【替换】网易云歌单 ID
const musicConfig = {
  server: 'netease',
  type: 'playlist',
  id: '5314875708',  // 用户的网易云歌单 ID
  theme: '#1989fa',
  themeDark: '#4d8dff'
};
