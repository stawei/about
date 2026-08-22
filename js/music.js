/* ============================================================
   音乐模块 - 完整自定义播放器（参考 zhheo.com 风格）
   使用 APlayer API 直接控制，自定义 UI 覆盖默认样式
   依赖：data.js（musicConfig）、APlayer（CDN 引入）
   ============================================================ */

/** 全局播放器实例和状态 */
let ap = null;
let currentLyrics = [];
let isDragging = false;
let playMode = 'list'; // 'loop' | 'random' | 'list'

/** 判断当前是否深色模式 */
function isDark() {
  return document.documentElement.getAttribute('data-theme') === 'dark';
}

/** 格式化时间 mm:ss */
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** 解析 LRC 歌词，支持多种格式 */
function parseLRC(lrc) {
  if (!lrc || typeof lrc !== 'string') return [];

  // 如果是纯文本（没有时间标签），直接按行分割
  if (!lrc.includes('[')) {
    return lrc.split('\n')
      .filter(line => line.trim())
      .map((text, i) => ({ time: i * 5, text: text.trim() })); // 每行默认5秒
  }

  const lines = lrc.split('\n');
  const result = [];
  // 支持 [mm:ss.xx] 和 [mm:ss:xx] 格式
  const timeRegex = /\[(\d{2}):(\d{2})[:\.](\d{2,3})\]/;

  lines.forEach(line => {
    const match = timeRegex.exec(line);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const ms = parseInt(match[3].padEnd(3, '0'));
      const time = min * 60 + sec + ms / 1000;
      // 移除所有时间标签，保留纯文本
      const text = line.replace(/\[.*?\]/g, '').trim();
      if (text) result.push({ time, text });
    }
  });

  // 按时间排序
  return result.sort((a, b) => a.time - b.time);
}

/** 从网易云获取歌单数据 */
async function fetchPlaylist(id) {
  console.log('[Music] 开始获取歌单数据, ID:', id);
  try {
    const res = await fetch(`https://api.i-meto.com/meting/api?server=netease&type=playlist&id=${id}`);
    console.log('[Music] API 响应状态:', res.status);
    if (!res.ok) throw new Error('获取歌单失败: ' + res.status);
    const data = await res.json();
    console.log('[Music] 获取到歌曲数量:', data.length);
    return data.map(item => ({
      name: item.title || '未知歌曲',
      artist: item.author || '未知歌手',
      url: item.url,
      cover: item.pic,
      lrc: item.lrc || ''
    }));
  } catch (err) {
    console.error('[Music] 获取歌单失败:', err);
    return [];
  }
}

/** 更新播放按钮状态 */
function updatePlayButton() {
  const btn = document.getElementById('musicPlay');
  if (!btn || !ap) return;
  btn.textContent = ap.paused ? '▶' : '⏸';
}

/** 获取歌词内容（支持 URL 或文本） */
async function fetchLyrics(lrcUrl) {
  if (!lrcUrl) return '';
  // 如果已经是歌词文本（包含时间标签或纯文本），直接返回
  if (lrcUrl.includes('[') || lrcUrl.includes('\n')) {
    return lrcUrl;
  }
  // 如果是 URL，需要请求获取
  try {
    const res = await fetch(lrcUrl);
    if (!res.ok) throw new Error('获取歌词失败');
    return await res.text();
  } catch (err) {
    console.error('[Music] 获取歌词失败:', err);
    return '';
  }
}

/** 更新歌曲信息 */
async function updateSongInfo() {
  if (!ap) return;
  const song = ap.list.audios[ap.list.index] || {};
  const cover = document.getElementById('musicCover');
  const name = document.getElementById('musicSongName');
  const artist = document.getElementById('musicArtist');
  // 仅在有效 URL 时更新封面，避免空 src 触发加载错误
  if (cover && song.cover) cover.src = song.cover;
  if (name) name.textContent = song.name || '--';
  if (artist) artist.textContent = song.artist || '--';

  // 加载歌词
  console.log('[Music] 加载歌词:', song.lrc ? '有歌词数据' : '无歌词数据');
  const lyricsText = await fetchLyrics(song.lrc || '');
  if (lyricsText) {
    console.log('[Music] 歌词前100字符:', lyricsText.substring(0, 100));
  }
  currentLyrics = parseLRC(lyricsText);
  console.log('[Music] 解析后歌词行数:', currentLyrics.length);
  renderLyrics();

  // 更新播放列表高亮
  updatePlaylistHighlight();
}

/** 更新进度条 */
function updateProgress() {
  if (!ap || isDragging) return;
  const fill = document.getElementById('musicProgressFill');
  const current = document.getElementById('musicCurrentTime');
  const duration = document.getElementById('musicDuration');
  const percent = ap.duration ? (ap.audio.currentTime / ap.duration) * 100 : 0;
  if (fill) fill.style.width = percent + '%';
  if (current) current.textContent = formatTime(ap.audio.currentTime);
  if (duration) duration.textContent = formatTime(ap.duration);
}

/** 渲染歌词 */
function renderLyrics() {
  const container = document.getElementById('musicLyricsContent');
  if (!container) return;
  if (!currentLyrics.length) {
    container.innerHTML = `
      <div class="music-lyrics-empty">
        <div class="music-lyrics-empty-icon">🎵</div>
        <div class="music-lyrics-empty-text">暂无歌词</div>
        <div class="music-lyrics-empty-hint">享受音乐的美好</div>
      </div>
    `;
    return;
  }
  container.innerHTML = currentLyrics.map((line, i) =>
    `<div class="music-lyrics-line" data-index="${i}">${line.text}</div>`
  ).join('');
}

/** 更新歌词高亮 - 参考 zhheo.com 风格 */
function updateLyrics() {
  if (!ap || !currentLyrics.length) return;
  const currentTime = ap.audio.currentTime;
  let activeIndex = -1;
  for (let i = 0; i < currentLyrics.length; i++) {
    if (currentLyrics[i].time <= currentTime) {
      activeIndex = i;
    } else {
      break;
    }
  }
  const lines = document.querySelectorAll('.music-lyrics-line');
  const container = document.getElementById('musicLyricsContent');

  lines.forEach((line, i) => {
    const isActive = i === activeIndex;
    line.classList.toggle('active', isActive);

    // 非当前行添加模糊和透明效果
    if (isActive) {
      line.style.opacity = '1';
      line.style.filter = 'none';
      line.style.transform = 'scale(1.05)';
    } else {
      const distance = Math.abs(i - activeIndex);
      if (distance === 1) {
        line.style.opacity = '0.6';
        line.style.filter = 'blur(0.5px)';
        line.style.transform = 'scale(1)';
      } else {
        line.style.opacity = '0.3';
        line.style.filter = 'blur(1px)';
        line.style.transform = 'scale(0.95)';
      }
    }
  });

  // 平滑滚动到当前行（居中显示）
  if (activeIndex >= 0 && lines[activeIndex] && container) {
    const line = lines[activeIndex];
    const containerHeight = container.parentElement.clientHeight;
    const lineHeight = line.clientHeight;
    const lineTop = line.offsetTop;
    const scrollTop = lineTop - containerHeight / 2 + lineHeight / 2;

    container.parentElement.scrollTo({
      top: scrollTop,
      behavior: 'smooth'
    });
  }
}

/** 渲染播放列表 - 带封面小图 */
function renderPlaylist() {
  const container = document.getElementById('musicPlaylistItems');
  if (!container || !ap) return;
  const songs = ap.list.audios || [];
  container.innerHTML = songs.map((song, i) => `
    <div class="music-playlist-item" data-index="${i}">
      <img class="music-playlist-item-cover" src="${song.cover || 'https://picsum.photos/seed/music/100/100'}" alt="">
      <div class="music-playlist-item-info">
        <div class="music-playlist-item-title-wrapper">
          <span class="music-playlist-item-title">${song.name}</span>
        </div>
        <span class="music-playlist-item-artist">${song.artist}</span>
      </div>
    </div>
  `).join('');
  // 绑定点击
  container.querySelectorAll('.music-playlist-item').forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.index);
      ap.list.switch(idx);
      ap.play();
    });
  });
  updatePlaylistHighlight();
}

/** 更新播放列表高亮 */
function updatePlaylistHighlight() {
  if (!ap) return;
  const items = document.querySelectorAll('.music-playlist-item');
  items.forEach((item, i) => {
    item.classList.toggle('active', i === ap.list.index);
  });
}

/** 初始化进度条拖动 */
function initProgressDrag() {
  const bar = document.getElementById('musicProgressBar');
  const fill = document.getElementById('musicProgressFill');
  if (!bar || !ap) return;

  function seek(e) {
    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (ap.duration) {
      ap.seek(ap.duration * percent);
    }
  }

  bar.addEventListener('mousedown', e => {
    isDragging = true;
    seek(e);
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (fill) fill.style.width = (percent * 100) + '%';
  });
  document.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    seek(e);
  });
}

/** 初始化播放器 */
async function initMusicPlayer() {
  console.log('[Music] 开始初始化播放器...');
  let playlist = await fetchPlaylist(musicConfig.id);

  // 如果 API 失败，使用示例数据
  if (!playlist.length) {
    console.log('[Music] 使用示例数据');
    playlist = [
      {
        name: '示例歌曲',
        artist: '示例歌手',
        url: '',
        cover: 'https://picsum.photos/seed/music/400/400',
        lrc: '[00:00.00]暂无歌词\n[00:05.00]请配置有效的网易云歌单ID'
      }
    ];
  }

  // 创建 APlayer 实例（隐藏默认 UI）
  // preload: 'none' 避免初始化时立即加载音频源导致 NotSupportedError
  ap = new APlayer({
    container: document.createElement('div'),
    audio: playlist,
    autoplay: false,
    loop: 'all',
    order: 'list',
    preload: 'none',
    volume: 0.7,
    mutex: true,
    lrcType: 1
  });

  // 事件绑定
  ap.on('play', updatePlayButton);
  ap.on('pause', updatePlayButton);
  ap.on('timeupdate', () => {
    updateProgress();
    updateLyrics();
  });
  ap.on('loadedmetadata', () => {
    console.log('[Music] 触发 loadedmetadata 事件');
    updateSongInfo();
  });
  ap.on('listswitch', () => {
    console.log('[Music] 触发 listswitch 事件');
    updateSongInfo();
  });
  // 捕获音频加载失败，避免 NotSupportedError 冒泡为未捕获异常
  ap.on('error', (err) => {
    console.warn('[Music] 音频加载失败，可能是音频源不可用:', err);
  });
  // 播放结束时根据模式处理
  ap.on('ended', () => {
    console.log('[Music] 歌曲播放结束，当前模式:', playMode);
    if (playMode === 'loop') {
      ap.seek(0);
      ap.play();
    } else if (playMode === 'random') {
      const nextIndex = getNextIndex();
      ap.list.switch(nextIndex);
      ap.play();
    }
    // list 模式由 APlayer 自动处理
  });

  // 初始化 UI - 使用 setTimeout 确保 APlayer 完全初始化
  setTimeout(() => {
    console.log('[Music] 延迟初始化歌曲信息');
    updateSongInfo();
    updatePlayButton();
    updatePlayModeButton();
    renderPlaylist();
    initProgressDrag();
  }, 100);
  console.log('[Music] 播放器初始化完成');
}

/** 更新播放模式按钮显示 */
function updatePlayModeButton() {
  const btn = document.getElementById('musicMode');
  if (!btn) return;
  btn.setAttribute('data-mode', playMode);
  // 显示当前模式的图标
  btn.querySelectorAll('.mode-icon').forEach(icon => {
    icon.style.display = 'none';
  });
  const activeIcon = btn.querySelector(`.mode-${playMode}`);
  if (activeIcon) activeIcon.style.display = 'block';
}

/** 切换播放模式 */
function switchPlayMode() {
  const modes = ['list', 'random', 'loop'];
  const currentIndex = modes.indexOf(playMode);
  playMode = modes[(currentIndex + 1) % modes.length];
  updatePlayModeButton();
  console.log('[Music] 切换播放模式:', playMode);
}

/** 获取下一首索引（根据播放模式） */
function getNextIndex() {
  if (!ap) return 0;
  const total = ap.list.audios.length;
  const current = ap.list.index;
  switch (playMode) {
    case 'loop':
      return current; // 单曲循环，返回当前索引
    case 'random':
      return Math.floor(Math.random() * total); // 随机播放
    case 'list':
    default:
      return (current + 1) % total; // 顺序循环播放
  }
}

/** 绑定音乐模块事件 */
function bindMusicEvents() {
  // 绑定控制按钮
  document.getElementById('musicPrev')?.addEventListener('click', () => ap?.skipBack());
  document.getElementById('musicPlay')?.addEventListener('click', () => ap?.toggle());
  document.getElementById('musicNext')?.addEventListener('click', () => ap?.skipForward());
  // 绑定播放模式按钮
  document.getElementById('musicMode')?.addEventListener('click', switchPlayMode);
}

/** 监听深色模式变化 */
function watchThemeChange() {
  const observer = new MutationObserver(() => {
    const card = document.querySelector('.music-player-card');
    if (card) {
      // 深色模式样式通过 CSS 变量自动适配，无需额外处理
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}

/** 初始化音乐模块 */
async function initMusic() {
  console.log('[Music] 初始化音乐模块...');

  // 兜底：捕获未处理的 Promise rejection（如 APlayer 内部音频加载失败）
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason && (e.reason.name === 'NotSupportedError' ||
        (e.reason.message && e.reason.message.includes('no supported source')))) {
      console.warn('[Music] 已捕获音频加载异常，不影响页面运行');
      e.preventDefault();
    }
  });

  await initMusicPlayer();
  bindMusicEvents();
  watchThemeChange();
  console.log('[Music] 初始化完成');
}

// DOMContentLoaded 后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMusic);
} else {
  // DOM 已就绪，直接执行
  initMusic();
}
