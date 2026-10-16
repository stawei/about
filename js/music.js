/* ============================================================
   音乐模块 - 完整自定义播放器（参考 zhheo.com 风格）
   使用 APlayer API 直接控制，自定义 UI 覆盖默认样式
   依赖：main.js（musicConfig）、APlayer + Meting（CDN 引入）
   ============================================================ */

/** 全局播放器实例和状态 */
let ap = null;
let currentLyrics = [];
let isDragging = false;
let playMode = 'list';
let currentPlatform = 'netease'; // 'netease' | 'tencent'
let isRecovering = false; // 防止错误恢复重复触发
let skipFailCount = 0; // 连续播放失败计数
const MAX_SKIP_FAILS = 5; // 最大连续失败次数，超过后停止自动跳歌

/** 显示音乐错误提示（展开态写歌名，收起态写 mini 条，保证两种形态都可见） */
function showMusicError(message) {
  const float = document.getElementById('musicFloat');
  const target = float && float.getAttribute('data-state') === 'mini'
    ? document.getElementById('mcMiniName')
    : document.getElementById('musicSongName');
  if (!target) return;
  const originalText = target.textContent;
  target.textContent = message;
  target.style.color = '#ff6b6b';
  setTimeout(() => {
    target.textContent = originalText;
    target.style.color = '';
  }, 3000);
}

/** 格式化时间 mm:ss */
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** 解析 LRC 歌词 */
function parseLRC(lrc) {
  if (!lrc || typeof lrc !== 'string') return [];
  if (!lrc.includes('[')) {
    return lrc.split('\n').filter(line => line.trim()).map((text, i) => ({ time: i * 5, text: text.trim() }));
  }
  const lines = lrc.split('\n');
  const result = [];
  const timeRegex = /\[(\d{2}):(\d{2})[:\.](\d{2,3})\]/;
  for (const line of lines) {
    const match = timeRegex.exec(line);
    if (match) {
      const time = parseInt(match[1]) * 60 + parseInt(match[2]) + parseInt(match[3].padEnd(3, '0')) / 1000;
      const text = line.replace(/\[.*?\]/g, '').trim();
      if (text) result.push({ time, text });
    }
  }
  return result.sort((a, b) => a.time - b.time);
}

/** API 源配置 - 按平台区分 */
const API_SOURCES = {
  netease: ['https://met.api.xiaoguan.fit/api', 'https://api.moeyao.cn/meting/', 'https://api.qijieya.cn/meting/'],
  tencent: ['https://meting.mikus.ink/api', 'https://api.qijieya.cn/meting/']
};

/** 从指定平台获取歌单数据（带备用源） */
async function fetchPlaylist(server, type, id) {
  // 根据平台选择对应的 API 源
  const sources = API_SOURCES[server] || API_SOURCES.netease;
  for (let i = 0; i < sources.length; i++) {
    const apiUrl = sources[i];
    try {
      const res = await fetch(`${apiUrl}?server=${server}&type=${type}&id=${id}`);
      if (!res.ok) throw new Error(`获取${server}歌单失败: ${res.status}`);
      const data = await res.json();
      if (data && data.length > 0) {
        return data
          .filter(item => item.url && item.url.trim() !== '')
          .map(item => {
            // 从 URL 中提取歌曲 ID（兼容 api.qijieya.cn 等源）
            let rawId = item.id || item.songid || item.songmid || '';
            if (!rawId && item.url) {
              const match = item.url.match(/[?&]id=([^&]+)/);
              if (match) rawId = match[1];
            }
            return {
              name: item.title || item.name || '未知歌曲',
              artist: item.author || item.artist || '未知歌手',
              url: item.url,
              // 不同 Meting 源封面字段不一致：xiaoguan/qijieya 用 pic，moeyao 用 cover
              cover: item.pic || item.cover || '',
              lrc: item.lrc || '',
              server: server,
              rawId: rawId
            };
          });
      }
    } catch (err) {
      console.warn(`[Music] API 源 ${i + 1} 失败:`, apiUrl, err.message);
    }
  }
  console.error(`[Music] 所有 API 源均失败`);
  return [];
}

/** 按需重新获取歌曲的播放 URL（带缓存破坏和备用源） */
async function refreshSongUrl(song) {
  if (!song.rawId || !song.server) return null;
  // 根据平台选择对应的 API 源
  const sources = API_SOURCES[song.server] || API_SOURCES.netease;
  for (const apiUrl of sources) {
    try {
      const res = await fetch(`${apiUrl}?server=${song.server}&type=url&id=${song.rawId}&r=${Date.now()}`);
      if (!res.ok) continue;

      // 处理 302 重定向（如 meting.mikus.ink）
      if (res.redirected || res.status === 302) {
        return res.url;
      }

      // 处理 JSON 响应（如 api.qijieya.cn）
      const data = await res.json();
      const urlData = Array.isArray(data) ? data[0] : data;
      if (urlData?.url?.trim()) {
        return urlData.url;
      }
    } catch {
      // 继续尝试下一个源
    }
  }
  return null;
}

/** 统一的错误恢复：刷新 URL → 重试播放 → 失败则跳下一首 */
async function tryRecoverAndPlay() {
  if (!ap || isRecovering) return false;

  // 防止无限跳歌循环
  skipFailCount++;
  if (skipFailCount > MAX_SKIP_FAILS) {
    showMusicError('多首歌曲暂不可用，请稍后再试');
    isRecovering = false;
    return false;
  }

  isRecovering = true;

  try {
    const song = ap.list.audios[ap.list.index];
    if (song?.rawId) {
      const newUrl = await refreshSongUrl(song);
      if (newUrl && newUrl !== song.url) {
        song.url = newUrl;
        try {
          ap.audio.src = newUrl;
          await ap.play();
          skipFailCount = 0; // 播放成功，重置失败计数
          return true;
        } catch (err) {
          // AbortError 是正常行为，不算失败
          if (err.name === 'AbortError') {
            skipFailCount = 0;
            return true;
          }
          // 其他错误继续跳下一首
        }
      }
    }

    // 刷新失败或无 rawId，跳到下一首
    showMusicError('该歌曲暂不可用，正在切换...');
    const nextIndex = (ap.list.index + 1) % ap.list.audios.length;
    if (nextIndex !== ap.list.index) {
      // 确保跳到不同的歌曲
      await playSongWithRefresh(nextIndex);
    }
    return false;
  } finally {
    // 延迟释放锁，避免快速连续触发
    setTimeout(() => { isRecovering = false; }, 1000);
  }
}

/** 播放歌曲前主动刷新 URL */
async function playSongWithRefresh(index) {
  if (!ap) return;

  // 先暂停当前播放，避免冲突
  if (ap.audio) {
    ap.audio.pause();
  }

  const song = ap.list.audios[index];
  if (song?.rawId) {
    const newUrl = await refreshSongUrl(song);
    if (newUrl) song.url = newUrl;
  }

  ap.list.switch(index);

  // 立即更新歌曲信息，确保歌名和实际播放一致
  await updateSongInfo();

  // 设置超时保护，如果 5 秒内无法播放则自动跳过
  const timeoutId = setTimeout(() => {
    if (ap && !ap.playing && ap.list.index === index && skipFailCount < MAX_SKIP_FAILS) {
      console.warn('[Music] 播放超时，自动跳下一首');
      const nextIndex = (index + 1) % ap.list.audios.length;
      if (nextIndex !== index) {
        playSongWithRefresh(nextIndex);
      }
    }
  }, 5000);

  try {
    await ap.play();
    clearTimeout(timeoutId);
    skipFailCount = 0; // 播放成功，重置失败计数
  } catch (err) {
    clearTimeout(timeoutId);
    // AbortError 是正常行为（快速切歌时 play 被 pause 中断），静默忽略
    if (err.name === 'AbortError') return;
    await tryRecoverAndPlay();
  }
}

/** 获取所有配置的歌单并合并 */
async function fetchAllPlaylists() {
  const playlists = musicConfig.playlists || [];
  const allSongs = [];
  for (const playlist of playlists) {
    const songs = await fetchPlaylist(playlist.server, playlist.type, playlist.id);
    if (songs.length > 0) {
      allSongs.push(...songs);
    }
  }
  return allSongs;
}

/** 更新播放按钮状态（同时同步悬浮层 data-playing，驱动 mini 封面角标） */
function updatePlayButton() {
  const btn = document.getElementById('musicPlay');
  if (!btn || !ap) return;
  const playIcon = btn.querySelector('.play-icon');
  const pauseIcon = btn.querySelector('.pause-icon');
  if (playIcon && pauseIcon) {
    playIcon.style.display = ap.paused ? 'block' : 'none';
    pauseIcon.style.display = ap.paused ? 'none' : 'block';
  }
  const float = document.getElementById('musicFloat');
  if (float) float.setAttribute('data-playing', ap.paused ? 'false' : 'true');
  // 同步 Hero 头像呼吸灯节奏：播放时 data-music="playing" 光晕更快更亮
  const heroWrap = document.querySelector('.hero-avatar-wrap');
  if (heroWrap) heroWrap.setAttribute('data-music', ap.paused ? 'idle' : 'playing');
}

/** 获取歌词内容（支持 URL 或文本） */
async function fetchLyrics(lrcUrl) {
  if (!lrcUrl) return '';
  if (lrcUrl.includes('[') || lrcUrl.includes('\n')) return lrcUrl;
  try {
    const res = await fetch(lrcUrl);
    return res.ok ? await res.text() : '';
  } catch {
    return '';
  }
}

/** 封面兜底占位：图床失效或源未返回封面时回退首页头像。
 *  取 .hero-avatar 已解析的 src——Vite 构建后 img/ 相对路径会被哈希进 assets/，
 *  JS 里硬编码 'img/avatar.jpg' 在生产会 404，相对路径仅作极端兜底 */
function coverFallbackSrc() {
  const hero = document.querySelector('.hero-avatar');
  return hero && hero.src ? hero.src : 'img/avatar.jpg';
}

/** 更新歌曲信息 */
async function updateSongInfo() {
  if (!ap) return;
  const song = ap.list.audios[ap.list.index] || {};
  const cover = document.getElementById('musicCover');
  const name = document.getElementById('musicSongName');
  const artist = document.getElementById('musicArtist');
  if (cover) cover.src = song.cover || coverFallbackSrc();
  if (name) name.textContent = song.name || '--';
  if (artist) artist.textContent = song.artist || '--';

  // 收起态 mini 条同步（同一首歌的第二份显示）
  const coverMini = document.getElementById('musicCoverMini');
  const nameMini = document.getElementById('mcMiniName');
  const artistMini = document.getElementById('mcMiniArtist');
  if (coverMini) coverMini.src = song.cover || coverFallbackSrc();
  if (nameMini) nameMini.textContent = song.name || '音乐';
  // mini 条右侧栏用于显示当前歌词行，此处先给歌手名兜底，待歌词就绪后由 updateMiniLyric 覆盖
  if (artistMini) artistMini.textContent = song.artist ? '作曲：' + song.artist : '--';

  const lyricsText = await fetchLyrics(song.lrc || '');
  currentLyrics = parseLRC(lyricsText);
  renderLyrics();
  updateMiniLyric();
  updatePlaylistHighlight();
}

/**
 * mini 条右侧栏 = 当前歌词行（与面板歌词同步跟词）。
 * 未到第一句、无歌词或静音段时回退为「作曲：歌手」，避免出现空白栏。
 */
function updateMiniLyric() {
  const el = document.getElementById('mcMiniArtist');
  if (!el || !ap) return;
  let text = '';
  if (currentLyrics.length) {
    const t = ap.audio.currentTime;
    for (let i = 0; i < currentLyrics.length; i++) {
      if (currentLyrics[i].time <= t) text = currentLyrics[i].text;
      else break;
    }
  }
  if (!text) {
    const song = ap.list.audios[ap.list.index] || {};
    text = song.artist ? '作曲：' + song.artist : '--';
  }
  if (el.textContent !== text) {
    el.textContent = text;
  }
}

/** 更新进度条 */
function updateProgress() {
  if (!ap || isDragging) return;
  const fill = document.getElementById('musicProgressFill');
  const current = document.getElementById('musicCurrentTime');
  const duration = document.getElementById('musicDuration');
  const percent = ap.duration ? (ap.audio.currentTime / ap.duration) * 100 : 0;
  if (fill) fill.style.width = percent + '%';
  // mini 胶囊内部进度流光（参考站 #nav-music 的 played 覆盖层）
  const miniFill = document.getElementById('mcMiniProgressFill');
  if (miniFill) miniFill.style.width = percent + '%';
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
        <div class="music-lyrics-empty-icon"><i class="ri-music-2-line" aria-hidden="true"></i></div>
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

/** 更新歌词高亮 */
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
    if (isActive !== line.classList.contains('active')) {
      line.classList.toggle('active', isActive);
    }
  });

  if (activeIndex >= 0 && lines[activeIndex] && container) {
    const lineTop = lines[activeIndex].offsetTop;
    const scrollTop = lineTop - container.parentElement.clientHeight * 0.25;
    container.parentElement.scrollTo({ top: scrollTop, behavior: 'smooth' });
  }
}

/** 更新播放列表高亮 */
function updatePlaylistHighlight() {
  if (!ap) return;
  document.querySelectorAll('.music-playlist-item').forEach((item, i) => {
    item.classList.toggle('active', i === ap.list.index);
  });
}

/** 切换音乐平台（网易云 ↔ QQ音乐） */
function switchPlatform() {
  if (!ap) return;
  currentPlatform = currentPlatform === 'netease' ? 'tencent' : 'netease';
  updatePlatformButton();
  renderPlaylistWithFilter();
}

/** 更新平台按钮显示 */
function updatePlatformButton() {
  const btn = document.getElementById('musicPlatform');
  if (btn) btn.setAttribute('data-platform', currentPlatform);
}

/** 根据平台过滤并渲染播放列表 */
function renderPlaylistWithFilter() {
  const container = document.getElementById('musicPlaylistItems');
  if (!container || !ap) return;

  const songs = (ap.list.audios || []).filter(song => song.server === currentPlatform);

  if (songs.length === 0) {
    container.innerHTML = `
      <div class="music-playlist-empty">
        <div class="music-playlist-empty-icon"><i class="ri-music-2-line" aria-hidden="true"></i></div>
        <div class="music-playlist-empty-text">该平台暂无歌曲</div>
      </div>`;
    return;
  }

  container.innerHTML = songs.map((song, i) => {
    const originalIndex = ap.list.audios.indexOf(song);
    return songItemHTML(song, originalIndex, i + 1);
  }).join('');

  bindPlaylistClicks(container);
  updatePlaylistHighlight();
}

/** 生成单首歌曲的 HTML（胶囊列表：序号 + 歌名 + 右侧歌手） */
function songItemHTML(song, originalIndex, num) {
  return `
    <div class="music-playlist-item" data-index="${originalIndex}">
      <span class="mc-num">${num}</span>
      <span class="music-playlist-item-title">${song.name}</span>
      <span class="music-playlist-item-artist">${song.artist}</span>
    </div>`;
}

/** 绑定播放列表项点击事件 */
function bindPlaylistClicks(container) {
  container.querySelectorAll('.music-playlist-item').forEach(item => {
    item.addEventListener('click', async () => {
      const idx = parseInt(item.dataset.index);
      // 直接调用 playSongWithRefresh，它内部会处理暂停逻辑
      await playSongWithRefresh(idx);
    });
  });
}

/** 渲染播放列表 */
function renderPlaylist() {
  renderPlaylistWithFilter();
}

/** 初始化进度条拖动 */
function initProgressDrag() {
  const bar = document.getElementById('musicProgressBar');
  const fill = document.getElementById('musicProgressFill');
  if (!bar || !ap) return;

  function seek(e) {
    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (ap.duration) ap.seek(ap.duration * percent);
  }

  bar.addEventListener('mousedown', e => { isDragging = true; seek(e); });
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
  let playlist = await fetchAllPlaylists();

  if (!playlist.length) {
    playlist = [{
      name: '示例歌曲', artist: '示例歌手', url: '',
      cover: 'https://picsum.photos/seed/music/400/400',
      lrc: '[00:00.00]暂无歌词\n[00:05.00]请配置有效的歌单ID'
    }];
  }

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
  ap.on('timeupdate', () => { updateProgress(); updateLyrics(); updateMiniLyric(); });
  ap.on('loadedmetadata', () => updateSongInfo());
  ap.on('listswitch', () => {
    // 立即刷新封面/歌名/歌词：preload:'none' 下 loadedmetadata 要到播放后才触发，
    // 不在此更新会导致「切歌后图片不显示、必须等播放」。
    // 注意只更新 UI，不在此处修改 audio.src，避免中断正在进行的 play() Promise；
    // URL 刷新已在 playSongWithRefresh 中完成
    updateSongInfo();
  });

  // 统一错误处理：APlayer error 事件
  ap.on('error', () => {
    if (!isRecovering) tryRecoverAndPlay();
  });

  // 延迟绑定 audio 元素错误监听 + play() Promise 错误捕获
  setTimeout(() => {
    if (!ap?.audio) return;

    // audio 元素错误监听 - 捕获 NotSupportedError 等
    ap.audio.addEventListener('error', (e) => {
      const error = e.target?.error;
      if (!isRecovering && error) {
        // 阻止错误冒泡到全局
        e.preventDefault();
        e.stopPropagation();
        tryRecoverAndPlay();
      }
    });

    // play() Promise 错误捕获
    const originalPlay = ap.audio.play.bind(ap.audio);
    ap.audio.play = function() {
      return originalPlay().catch(async (err) => {
        // AbortError: 正常行为（快速切歌时 play 被 pause 中断），静默忽略
        if (err.name === 'AbortError') return;
        // NotSupportedError: 音频格式不支持，尝试恢复
        if (err.name === 'NotSupportedError' || err.message?.includes('no supported source')) {
          if (!isRecovering) await tryRecoverAndPlay();
          return;
        }
        // 其他错误尝试恢复
        if (!isRecovering) await tryRecoverAndPlay();
      });
    };
  }, 500);

  // 播放结束处理
  ap.on('ended', async () => {
    if (playMode === 'loop') {
      const song = ap.list.audios[ap.list.index];
      if (song?.rawId) {
        const newUrl = await refreshSongUrl(song);
        if (newUrl) { song.url = newUrl; ap.audio.src = newUrl; }
      }
      ap.seek(0);
      ap.play();
    } else if (playMode === 'random') {
      const nextIndex = Math.floor(Math.random() * ap.list.audios.length);
      await playSongWithRefresh(nextIndex);
    }
  });

  // 初始化 UI
  setTimeout(() => {
    updateSongInfo();
    updatePlayButton();
    updatePlayModeButton();
    updatePlatformButton();
    renderPlaylist();
    initProgressDrag();
  }, 100);
}

/** 更新播放模式按钮显示 */
function updatePlayModeButton() {
  const btn = document.getElementById('musicMode');
  if (!btn) return;
  btn.setAttribute('data-mode', playMode);
  btn.querySelectorAll('.mode-icon').forEach(icon => { icon.style.display = 'none'; });
  const activeIcon = btn.querySelector(`.mode-${playMode}`);
  if (activeIcon) activeIcon.style.display = 'block';
}

/** 切换播放模式 */
function switchPlayMode() {
  const modes = ['list', 'random', 'loop'];
  playMode = modes[(modes.indexOf(playMode) + 1) % modes.length];
  updatePlayModeButton();
}

/**
 * 面板宽度与 mini 胶囊实时同步（参考站 music-panel.js 的 syncPanelWidth）：
 * 胶囊按内容自适应且播放中会伸展带出歌词行，面板取胶囊 offsetWidth（下限 260px），
 * 由 ResizeObserver 驱动，展开/收起与伸展/收缩时面板始终与胶囊同宽。
 */
const MC_MIN_PANEL_WIDTH = 260;
function syncPanelWidth() {
  const mini = document.getElementById('mcMini');
  const panel = document.getElementById('musicCapsule');
  if (!mini || !panel) return;
  const w = Math.max(mini.offsetWidth, MC_MIN_PANEL_WIDTH);
  panel.style.width = w + 'px';
}

/** 绑定音乐模块事件 */
function bindMusicEvents() {
  // 封面图床加载失败 → 回退头像占位；src 已是占位图时不再赋值，防止 error 死循环
  ['musicCover', 'musicCoverMini'].forEach((id) => {
    const img = document.getElementById(id);
    img?.addEventListener('error', () => {
      const fb = coverFallbackSrc();
      if (img.src !== fb) {
        img.src = fb;
        console.warn('[Music] 封面加载失败，已回退头像占位:', id);
      }
    });
  });

  document.getElementById('musicPrev')?.addEventListener('click', async () => {
    if (!ap) return;
    const prevIndex = (ap.list.index - 1 + ap.list.audios.length) % ap.list.audios.length;
    await playSongWithRefresh(prevIndex);
  });

  // 播放/暂停（面板播放键与 mini 封面点击共用，参考站 .aplayer-button 行为）
  async function togglePlay() {
    if (!ap) return;
    if (ap.paused) {
      try {
        const result = ap.toggle();
        if (result?.then) {
          await result;
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (!(await tryRecoverAndPlay())) {
          showMusicError('播放失败，该歌曲可能暂不可用');
        }
      }
    } else {
      ap.pause();
    }
  }

  document.getElementById('musicPlay')?.addEventListener('click', togglePlay);

  document.getElementById('musicNext')?.addEventListener('click', async () => {
    if (!ap) return;
    const nextIndex = (ap.list.index + 1) % ap.list.audios.length;
    await playSongWithRefresh(nextIndex);
  });

  document.getElementById('musicMode')?.addEventListener('click', switchPlayMode);
  document.getElementById('musicPlatform')?.addEventListener('click', switchPlatform);

  // 悬浮层收起 / 展开两态
  const float = document.getElementById('musicFloat');
  const mini = document.getElementById('mcMini');
  const panelToggle = document.getElementById('mcListToggle');

  function setFloatState(state) {
    if (!float) return;
    float.setAttribute('data-state', state);
    const full = state === 'full';
    mini?.setAttribute('aria-expanded', String(full));
    mini?.setAttribute('aria-label', full ? '收起音乐播放器' : '展开音乐播放器');
    // 展开成完整胶囊时默认带出歌单面板；收起时一并复位
    if (panelToggle) {
      panelToggle.classList.toggle('active', full);
      panelToggle.setAttribute('aria-expanded', String(full));
    }
    document.getElementById('mcPanel')?.classList.toggle('open', full);
    if (full) updateLyrics();
  }

  // mini 在展开态依然保留在卡片下方，故点击它兼作「收起」
  mini?.addEventListener('click', () => {
    setFloatState(float.getAttribute('data-state') === 'full' ? 'mini' : 'full');
  });

  // 参考站 .aplayer-button pointer-events:all —— 点击 mini 封面（含播放角标）切换播放/暂停，
  // stopPropagation 避免冒泡到胶囊本体触发展开/收起
  mini?.querySelector('.mc-mini-cover')?.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlay();
  });

  // 面板宽度跟随胶囊（参考站同款 ResizeObserver）；先同步一次保证首帧正确
  syncPanelWidth();
  if (window.ResizeObserver && mini) {
    new ResizeObserver(syncPanelWidth).observe(mini);
  }
  /**
   * 收起方式：点击胶囊以外的空白处（原 #mcCollapse 按钮与封面收起入口均已移除）。
   * 用 pointerdown 而非 click——拖动进度条时指针可能在胶囊外抬起，click 会落在
   * 共同祖先（body）上被误判成「点击空白」，pointerdown 的起点在胶囊内则不受影响。
   */
  document.addEventListener('pointerdown', (e) => {
    if (!float || float.getAttribute('data-state') !== 'full') return;
    if (e.target.closest && e.target.closest('.music-float')) return;
    setFloatState('mini');
  });
  // 键盘可达性：Esc 同样收起
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && float && float.getAttribute('data-state') === 'full') setFloatState('mini');
  });

  // 面板展开/收起
  const listToggle = document.getElementById('mcListToggle');
  const panel = document.getElementById('mcPanel');
  listToggle?.addEventListener('click', () => {
    const open = panel?.classList.toggle('open');
    listToggle.classList.toggle('active', !!open);
    listToggle.setAttribute('aria-expanded', String(!!open));
  });

  // 歌单 / 歌词选项卡
  document.querySelectorAll('.mc-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const name = tab.dataset.tab;
      document.querySelectorAll('.mc-tab').forEach(t => {
        const on = t === tab;
        t.classList.toggle('active', on);
        t.setAttribute('aria-selected', String(on));
      });
      document.querySelectorAll('.mc-pane').forEach(p => {
        p.classList.toggle('active', p.dataset.pane === name);
      });
      // 面板隐藏期间歌词无法滚动，切回时立即跟一次
      if (name === 'lyrics') updateLyrics();
    });
  });

  // 音量控制
  const volume = document.getElementById('musicVolume');
  const muteBtn = document.getElementById('musicMute');
  const muteIcon = muteBtn?.querySelector('i');
  let lastVolume = 0.7;

  function paintVolume(v) {
    if (volume) volume.style.setProperty('--vol', Math.round(v * 100) + '%');
    if (muteIcon) muteIcon.className = v === 0 ? 'ri-volume-mute-fill' : 'ri-volume-up-fill';
  }

  volume?.addEventListener('input', () => {
    if (!ap) return;
    const v = parseInt(volume.value, 10) / 100;
    ap.volume(v);
    if (v > 0) lastVolume = v;
    paintVolume(v);
  });

  muteBtn?.addEventListener('click', () => {
    if (!ap || !volume) return;
    const cur = parseInt(volume.value, 10) / 100;
    const next = cur > 0 ? 0 : (lastVolume || 0.7);
    ap.volume(next);
    volume.value = String(Math.round(next * 100));
    paintVolume(next);
  });

  paintVolume(0.7);
}

/** 初始化音乐模块 */
async function initMusic() {
  window.addEventListener('unhandledrejection', (e) => {
    if (e.reason?.name === 'NotSupportedError' || e.reason?.message?.includes('no supported source')) {
      e.preventDefault();
    }
  });
  window.addEventListener('error', (e) => {
    if (e.message?.includes('no supported source')) e.preventDefault();
  });
  await initMusicPlayer();
  bindMusicEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMusic);
} else {
  initMusic();
}
