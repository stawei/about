/* ============================================================
   深色模式星空背景（移植自 AnZhiYu 主题 dark.js，本地化改写）
   - 全屏 canvas #universe，粒子 = 大星(圆点) / 小星(方块) / 流星(拖尾)
   - 仅在 html[data-theme="dark"] 时绘制；浅色模式下由 CSS 隐藏
   - 尊重 prefers-reduced-motion，开启则完全不启动
   ============================================================ */
(function () {
  var canvas = document.getElementById('universe');
  if (!canvas) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var W, H, count;
  var ctx = canvas.getContext('2d');
  var stars = [];
  var T = 0.05; // 基础速度
  var COL_GIANT = '180,184,240'; // 大星：淡蓝紫
  var COL_STAR = '226,225,142';  // 小星：淡黄
  var COL_COMET = '226,225,224'; // 流星：近白
  var allowComet = true;
  setTimeout(function () { allowComet = false; }, 50); // 开场 50ms 内不出流星，避免突兀

  function resize() {
    // 预览 iframe 里 innerWidth 可能是小数，canvas 尺寸与数组长度都必须取整
    W = Math.max(1, Math.floor(window.innerWidth));
    H = Math.max(1, Math.floor(window.innerHeight));
    count = Math.max(0, Math.min(Math.floor(0.216 * W), 350)); // 上限 350，宽屏/移动端控开销
    canvas.width = W;
    canvas.height = H;
    var current = stars.length;
    if (count > current) {
      for (var i = current; i < count; i++) { stars.push(new Star()); }
    } else if (count < current) {
      stars.length = count;
    }
    console.debug('[Starfield] resize', W + 'x' + H, 'stars=' + stars.length, 'raw=' + window.innerWidth);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function chance(times) { return Math.floor(1000 * Math.random()) + 1 < 10 * times; }

  function Star() {
    this.reset();
  }
  Star.prototype.reset = function () {
    this.giant = chance(3);
    this.comet = !this.giant && !allowComet && chance(10);
    this.x = rand(0, W - 10);
    this.y = rand(0, H);
    this.r = rand(1.1, 2.6);
    this.dx = rand(T, 6 * T) + (this.comet ? T * rand(50, 120) : 0) + 2 * T;
    this.dy = -rand(T, 6 * T) - (this.comet ? T * rand(50, 120) : 0);
    this.fadingOut = false;
    this.fadingIn = true;
    this.opacity = 0;
    this.threshold = rand(0.2, 1 - (this.comet ? 0.4 : 0));
    this.delta = rand(0.0005, 0.002) + (this.comet ? 0.001 : 0);
  };
  Star.prototype.move = function () {
    this.x += this.dx;
    this.y += this.dy;
    if (this.x > W - W / 4 || this.y < 0) this.fadingOut = true;
    if (this.fadingOut && this.opacity <= 0) this.reset();
  };
  Star.prototype.fadeIn = function () {
    if (!this.fadingIn) return;
    this.fadingIn = !(this.opacity > this.threshold);
    this.opacity += this.delta;
  };
  Star.prototype.fadeOut = function () {
    if (!this.fadingOut) return;
    this.fadingOut = !(this.opacity < 0);
    this.opacity -= this.delta / 2;
  };
  Star.prototype.draw = function () {
    ctx.beginPath();
    if (this.giant) {
      ctx.fillStyle = 'rgba(' + COL_GIANT + ',' + this.opacity + ')';
      ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
    } else if (this.comet) {
      ctx.fillStyle = 'rgba(' + COL_COMET + ',' + this.opacity + ')';
      ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI);
      for (var t = 0; t < 30; t++) {
        ctx.fillStyle = 'rgba(' + COL_COMET + ',' + (this.opacity - this.opacity / 20 * t) + ')';
        ctx.rect(this.x - this.dx / 4 * t, this.y - this.dy / 4 * t - 2, 2, 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = 'rgba(' + COL_STAR + ',' + this.opacity + ')';
      ctx.rect(this.x, this.y, this.r, this.r);
    }
    ctx.closePath();
    ctx.fill();
  };

  function frame() {
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.move(); s.fadeIn(); s.fadeOut(); s.draw();
      }
    }
    window.requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);
  window.requestAnimationFrame(frame);
})();
