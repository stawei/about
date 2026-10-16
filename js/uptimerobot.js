/**
 * 项目维护热度 —— UptimeRobot 真实可用性数据
 *
 * 只读 API Key 会随前端源码公开，仅用于读取监控状态；切勿替换成有写权限的 Key。
 * 数据口径：拉取全部监控的事件日志，按日历月切分 up/down 时长，算出逐月可用率，
 * 再映射成 12 根竖条的强度；未匹配到监控的项目由 main.js 回落到占位热度。
 */
(function () {
  'use strict';

  var API_KEY = 'ur2576757-a37e6769411e94ef364d85b1';
  var API_URL = 'https://api.uptimerobot.com/v2/getMonitors';
  var CACHE_KEY = 'ur-monitors-v2';
  /* 5 分钟：热度变化很慢，但「刚在 UptimeRobot 加/改监控」要能较快反映到页面上，
     单次响应 gzip 仅约 16KB，代价可接受 */
  var CACHE_TTL = 5 * 60 * 1000;
  var MONTHS = 12;

  /* 近 12 个日历月的时间边界（旧 → 新） */
  function monthBounds() {
    var out = [];
    var now = new Date();
    for (var i = MONTHS - 1; i >= 0; i--) {
      var s = new Date(now.getFullYear(), now.getMonth() - i, 1);
      var e = new Date(s.getFullYear(), s.getMonth() + 1, 1);
      out.push({
        start: Math.floor(s.getTime() / 1000),
        end: Math.floor(e.getTime() / 1000),
        label: (s.getMonth() + 1) + '月'
      });
    }
    return out;
  }

  var BOUNDS = monthBounds();

  /** 主机名归一：小写、去 www. 前缀与尾点 */
  function normalizeHost(url) {
    if (!url) return '';
    var s = String(url).trim().toLowerCase();
    var m = s.match(/^(?:https?:)?\/\/([^/?#]+)/);
    if (m) s = m[1];
    s = s.replace(/:\d+$/, '').replace(/\.$/, '');
    return s.replace(/^www\./, '');
  }

  /** 事件日志 → 逐月可用率（0..1）；该月无任何记录时为 null */
  function monthlyUptime(logs) {
    var up = [], down = [], i;
    for (i = 0; i < MONTHS; i++) { up.push(0); down.push(0); }
    var nowSec = Math.floor(Date.now() / 1000);

    (logs || []).forEach(function (l) {
      if (!l || typeof l.datetime !== 'number') return;
      var start = l.datetime;
      var end = Math.min(start + Math.max(0, Number(l.duration) || 0), nowSec);
      if (end <= start) return;
      for (var m = 0; m < MONTHS; m++) {
        var s = Math.max(start, BOUNDS[m].start);
        var e = Math.min(end, BOUNDS[m].end);
        if (e <= s) continue;
        /* type: 2 = UP，其余（1/3/99…）按 DOWN 计 */
        if (l.type === 2) up[m] += e - s; else down[m] += e - s;
      }
    });

    return up.map(function (u, idx) {
      var total = u + down[idx];
      return total > 0 ? u / total : null;
    });
  }

  /**
   * 可用率 → 竖条强度。
   * 用「当月累计停机时长」做标尺而非线性差值：99.9% 与 100% 的差只有 43 分钟，
   * 线性映射会把所有正常月份挤成同一个满格，看不出节奏。
   * 停机 1 天 ≈ 0.5，停机 8 天 ≈ 0.11，正常月份自然落在高位并有区分度。
   */
  var MINUTES_PER_MONTH = 43200;
  function toStrength(u) {
    if (u === null) return null;
    var downMinutes = (1 - u) * MINUTES_PER_MONTH;
    var v = 1 / (1 + downMinutes / 1440); /* 1440 分钟 = 1 天 */
    return Math.max(0.05, Math.min(1, v));
  }

  var index = null;   /* host → 热度条目 */
  var loading = null;

  function buildIndex(monitors) {
    var map = {};
    (monitors || []).forEach(function (mo) {
      var host = normalizeHost(mo.url);
      if (!host) return;
      var uptime = monthlyUptime(mo.logs);
      var strengths = uptime.map(toStrength);
      var known = uptime.filter(function (u) { return u !== null; });
      var avg = known.length
        ? known.reduce(function (a, b) { return a + b; }, 0) / known.length
        : null;

      /* 无事件日志（刚建监控或长期无状态变化）时按当前状态兜底，
         否则整排竖条会被画成「全空」，与实际在线状态相反 */
      var online = mo.status === 2;
      var fallback = online ? 1 : 0.05;
      strengths = strengths.map(function (v) { return v === null ? fallback : v; });

      map[host] = {
        name: mo.friendly_name || host,
        values: strengths,
        uptimes: uptime,
        avg: avg,
        avgText: avg === null
          ? (online ? '当前在线' : '当前离线')
          : '可用率均值 ' + (Math.round(avg * 1000) / 10).toFixed(1) + '%',
        status: mo.status
      };
    });
    return map;
  }

  function readCache() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || Date.now() - obj.t > CACHE_TTL) return null;
      return obj.data;
    } catch (e) { return null; }
  }

  function writeCache(data) {
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data: data })); }
    catch (e) { /* 隐私模式或超额，忽略 */ }
  }

  function request() {
    return fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'api_key=' + API_KEY + '&format=json&logs=1&response_limit=50'
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (json) {
      if (!json || json.stat !== 'ok' || !Array.isArray(json.monitors)) {
        throw new Error((json && json.error && json.error.message) || 'bad payload');
      }
      return json.monitors;
    });
  }

  /** 拉取监控数据；失败时静默，调用方回落到占位热度 */
  function load() {
    if (index) return Promise.resolve(index);
    if (loading) return loading;

    var cached = readCache();
    if (cached) {
      index = cached;
      return Promise.resolve(index);
    }

    loading = request().then(function (monitors) {
      index = buildIndex(monitors);
      writeCache(index);
      loading = null;
      return index;
    }).catch(function () {
      loading = null;
      return null;
    });
    return loading;
  }

  /**
   * 取某项目的真实热度。
   * 优先 project.heatHost（demo 域名与监控域名不一致时手动指定），
   * 其次 project.demo，且只做主机名精确匹配，不做子域猜测——避免把
   * 主站监控错算到子路径项目上。未命中返回 null。
   */
  function get(project) {
    if (!index || !project) return null;
    var host = normalizeHost(project.heatHost || project.demo);
    var hit = host ? index[host] : null;
    if (!hit) return null;
    return {
      values: hit.values,
      uptimes: hit.uptimes,
      labels: BOUNDS.map(function (b) { return b.label; }),
      avgText: hit.avgText,
      monitor: hit.name
    };
  }

  window.ProjectHeat = {
    load: load,
    get: get,
    monthLabels: BOUNDS.map(function (b) { return b.label; })
  };
})();
