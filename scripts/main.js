function mulberry32(a) {
  return function() {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function noise2D(x, y, seed) {
  const rng = mulberry32(seed + (x * 374761393 + y * 668265263));
  return rng();
}

function smoothNoise(x, y, scale, seed) {
  const sx = x / scale;
  const sy = y / scale;
  const ix = Math.floor(sx);
  const iy = Math.floor(sy);
  const fx = sx - ix;
  const fy = sy - iy;
  const sfx = fx * fx * (3 - 2 * fx);
  const sfy = fy * fy * (3 - 2 * fy);

  return noise2D(ix, iy, seed) * (1 - sfx) * (1 - sfy) +
    noise2D(ix + 1, iy, seed) * sfx * (1 - sfy) +
    noise2D(ix, iy + 1, seed) * (1 - sfx) * sfy +
    noise2D(ix + 1, iy + 1, seed) * sfx * sfy;
}

function fbm(x, y, octaves, seed) {
  let val = 0;
  let amp = 0.5;
  let freq = 1;

  for (let i = 0; i < octaves; i++) {
    val += amp * smoothNoise(x * freq, y * freq, 1, seed + i * 1000);
    amp *= 0.5;
    freq *= 2;
  }

  return val;
}

function drawPanel1() {
  const c = document.getElementById('canvas1');
  const ctx = c.getContext('2d');
  const W = 512;
  const H = 512;
  const img = ctx.createImageData(W, H);
  const d = img.data;
  const rng = mulberry32(42);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      let v = (rng() * 6) | 0;
      const dx = (x - W / 2) / (W / 2);
      const dy = (y - H / 2) / (H / 2);
      v = Math.max(0, v * (1 - (dx * dx + dy * dy) * 0.3));
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
  }

  const cluster = [[82, 88, 28], [83, 88, 35], [82, 89, 30], [83, 89, 22], [81, 88, 12], [84, 89, 10], [82, 87, 8], [83, 90, 6]];
  for (const [px, py, b] of cluster) {
    const i = (py * W + px) * 4;
    d[i] = d[i + 1] = d[i + 2] = b;
  }

  ctx.putImageData(img, 0, 0);
  ctx.strokeStyle = '#e8312a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(68, 74, 28, 28);
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(68, 88);
  ctx.lineTo(20, 88);
  ctx.moveTo(82, 74);
  ctx.lineTo(82, 30);
  ctx.moveTo(96, 88);
  ctx.lineTo(140, 88);
  ctx.moveTo(82, 102);
  ctx.lineTo(82, 140);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(232,49,42,0.7)';
  ctx.font = '500 9px "IBM Plex Mono", monospace';
  ctx.fillText('TGT 01  0.94', 100, 87);
}

function drawPanel2() {
  const c = document.getElementById('canvas2');
  const ctx = c.getContext('2d');
  const W = 512;
  const H = 512;
  const img = ctx.createImageData(W, H);
  const d = img.data;
  const rng = mulberry32(137);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const qx = x < W / 2 ? 0 : 1;
      const qy = y < H / 2 ? 0 : 1;
      const quad = qy * 2 + qx;
      let v;

      if (quad === 0) {
        v = fbm(x, y, 5, 100) * 120 + 30 + rng() * 8;
        if (Math.abs(y - 180) < 2) v = Math.min(255, v + 40);
      } else if (quad === 1) {
        v = fbm(x, y, 4, 200) * 80 + 10 + rng() * 12;
        const bx = 380;
        const by = 120;
        const dist = Math.sqrt((x - bx) ** 2 + (y - by) ** 2);
        if (dist < 18) v = 180 + (18 - dist) * 4;
      } else if (quad === 2) {
        v = fbm(x, y, 3, 300) * 60 + 20 + rng() * 15;
      } else {
        v = fbm(x, y, 4, 400) * 50 + 15 + rng() * 10;
        const drX = 400;
        const drY = 380;
        const drDist = Math.sqrt((x - drX) ** 2 + ((y - drY) * 1.8) ** 2);
        if (drDist < 30) {
          v = 160 + (30 - drDist) * 3;
          const wo = Math.abs(x - drX);
          if (wo > 5 && wo < 28 && Math.abs(y - drY) < 4) v = 200;
        }
      }

      v = Math.max(0, Math.min(255, v));
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2, 0);
  ctx.lineTo(W / 2, H);
  ctx.moveTo(0, H / 2);
  ctx.lineTo(W, H / 2);
  ctx.stroke();

  const chX = 130;
  const chY = 140;
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(chX - 30, chY);
  ctx.lineTo(chX - 8, chY);
  ctx.moveTo(chX + 8, chY);
  ctx.lineTo(chX + 30, chY);
  ctx.moveTo(chX, chY - 30);
  ctx.lineTo(chX, chY - 8);
  ctx.moveTo(chX, chY + 8);
  ctx.lineTo(chX, chY + 30);
  ctx.stroke();

  ctx.strokeStyle = '#e8312a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(370, 354, 62, 52);
  ctx.lineWidth = 1.2;
  ctx.strokeRect(360, 102, 42, 36);
  ctx.fillStyle = 'rgba(232,49,42,0.7)';
  ctx.font = '500 8px "IBM Plex Mono", monospace';
  ctx.fillText('UAS  0.97', 370, 350);
  ctx.fillText('VEH  0.89', 360, 98);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = '400 8px "IBM Plex Mono", monospace';
  ctx.fillText('WFOV  1x', 10, 248);
  ctx.fillText('MWIR  4x', W / 2 + 10, 248);
  ctx.fillText('NV  I²', 10, H - 10);
  ctx.fillText('LWIR  THM', W / 2 + 10, H - 10);
}

function drawPanel3() {
  const c = document.getElementById('canvas3');
  const ctx = c.getContext('2d');
  const W = 512;
  const H = 512;
  const img = ctx.createImageData(W, H);
  const d = img.data;
  const rng = mulberry32(299);

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const v = fbm(x, y, 5, 500) * 40 + 15 + rng() * 6;
      d[i] = d[i + 1] = d[i + 2] = Math.max(0, Math.min(255, v));
      d[i + 3] = 255;
    }
  }

  function drawBranch(sx, sy, angle, len, thickness, depth) {
    if (depth <= 0 || len < 3) return;

    const ex = sx + Math.cos(angle) * len;
    const ey = sy + Math.sin(angle) * len;
    const steps = Math.ceil(len);

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const bx = Math.round(sx + (ex - sx) * t);
      const by = Math.round(sy + (ey - sy) * t);
      const r = Math.max(1, Math.round(thickness * (1 - t * 0.4)));

      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (dx * dx + dy * dy > r * r) continue;
          const px = bx + dx;
          const py = by + dy;
          if (px < 0 || px >= W || py < 0 || py >= H) continue;
          const idx = (py * W + px) * 4;
          d[idx] = d[idx + 1] = d[idx + 2] = Math.min(d[idx], 8 + (rng() * 10) | 0);
        }
      }
    }

    const spread = 0.35 + rng() * 0.3;
    const shrink = 0.6 + rng() * 0.2;
    drawBranch(ex, ey, angle - spread, len * shrink, thickness * 0.7, depth - 1);
    drawBranch(ex, ey, angle + spread, len * shrink, thickness * 0.7, depth - 1);
    if (rng() > 0.5) drawBranch(ex, ey, angle + (rng() - 0.5) * 0.5, len * shrink * 0.8, thickness * 0.5, depth - 1);
  }

  drawBranch(50, 500, -Math.PI / 2 + 0.15, 140, 8, 7);
  drawBranch(180, 510, -Math.PI / 2 - 0.1, 120, 7, 6);
  drawBranch(350, 505, -Math.PI / 2 + 0.05, 130, 7, 7);
  drawBranch(460, 510, -Math.PI / 2 - 0.12, 110, 6, 6);
  drawBranch(260, 500, -Math.PI / 2 + 0.2, 100, 5, 6);

  for (let y2 = 240; y2 <= 280; y2++) {
    for (let x2 = 276; x2 <= 304; x2++) {
      if (x2 < 0 || x2 >= W || y2 < 0 || y2 >= H) continue;
      const dx = (x2 - 290) / 14;
      const dy = (y2 - 260) / 20;
      const dist = dx * dx + dy * dy;
      if (dist > 1) continue;
      const idx = (y2 * W + x2) * 4;
      const heat = 180 + (1 - dist) * 75;
      d[idx] = d[idx + 1] = d[idx + 2] = Math.min(255, d[idx] < 15 ? d[idx] * 0.7 + heat * 0.3 : heat);
    }
  }

  for (let y2 = 226; y2 <= 242; y2++) {
    for (let x2 = 280; x2 <= 296; x2++) {
      if (x2 < 0 || x2 >= W || y2 < 0 || y2 >= H) continue;
      const dx = (x2 - 288) / 8;
      const dy = (y2 - 234) / 8;
      const dist = dx * dx + dy * dy;
      if (dist > 1) continue;
      const idx = (y2 * W + x2) * 4;
      const heat = 160 + (1 - dist) * 80;
      d[idx] = d[idx + 1] = d[idx + 2] = Math.min(255, d[idx] < 15 ? d[idx] * 0.5 + heat * 0.5 : heat);
    }
  }

  ctx.putImageData(img, 0, 0);
  ctx.strokeStyle = '#e8312a';
  ctx.lineWidth = 2;
  ctx.strokeRect(260, 218, 60, 70);
  ctx.fillStyle = 'rgba(232,49,42,0.7)';
  ctx.font = '500 9px "IBM Plex Mono", monospace';
  ctx.fillText('DISMOUNT  0.82', 262, 214);
  ctx.strokeStyle = 'rgba(255,255,255,0.02)';
  ctx.lineWidth = 1;
  for (let sl = 0; sl < H; sl += 4) {
    ctx.beginPath();
    ctx.moveTo(0, sl);
    ctx.lineTo(W, sl);
    ctx.stroke();
  }
}

function initLiveCanvas() {
  const c = document.getElementById('liveCanvas');
  const ctx = c.getContext('2d');
  const W = c.width;
  const H = c.height;

  const terrainData = ctx.createImageData(W, H);
  const td = terrainData.data;
  const trng = mulberry32(777);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      let v = fbm(x * 0.7, y * 0.7, 5, 600) * 50 + 8;
      v += trng() * 4;
      const hFactor = Math.max(0, 1 - y / (H * 0.35));
      v += hFactor * 15;
      td[i] = td[i + 1] = td[i + 2] = Math.max(0, Math.min(255, v | 0));
      td[i + 3] = 255;
    }
  }

  const targets = [];
  const targetRng = mulberry32(1234);
  for (let i = 0; i < 8; i++) {
    targets.push({
      x: targetRng() * W,
      y: H * 0.25 + targetRng() * H * 0.65,
      vx: (targetRng() - 0.5) * 1.2,
      vy: (targetRng() - 0.5) * 0.3,
      size: 3 + targetRng() * 6,
      brightness: 120 + targetRng() * 100,
      conf: (0.75 + targetRng() * 0.24).toFixed(2),
      label: ['UAS', 'VEH', 'DISMOUNT', 'UNK', 'VEH', 'UAS', 'VEH', 'DISMOUNT'][i],
      tracked: targetRng() > 0.3,
      trackAge: (targetRng() * 200) | 0
    });
  }

  let frame = 0;
  const countEl = document.getElementById('liveCount');
  const detectEl = document.getElementById('liveDetections');
  const timeEl = document.getElementById('liveTime');

  function animate() {
    ctx.putImageData(terrainData, 0, 0);

    ctx.strokeStyle = 'rgba(255,255,255,0.015)';
    ctx.lineWidth = 1;
    for (let sl = 0; sl < H; sl += 3) {
      ctx.beginPath();
      ctx.moveTo(0, sl);
      ctx.lineTo(W, sl);
      ctx.stroke();
    }

    let detCount = 0;
    for (const t of targets) {
      t.x += t.vx;
      t.y += t.vy;
      t.trackAge++;

      if (t.x < -20) t.x = W + 20;
      if (t.x > W + 20) t.x = -20;
      if (t.y < H * 0.15) t.vy = Math.abs(t.vy);
      if (t.y > H * 0.9) t.vy = -Math.abs(t.vy);

      const glow = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, t.size * 2);
      glow.addColorStop(0, `rgba(${t.brightness},${t.brightness},${t.brightness},0.8)`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(t.x - t.size * 2, t.y - t.size * 2, t.size * 4, t.size * 4);

      ctx.fillStyle = `rgb(${t.brightness},${t.brightness},${t.brightness})`;
      ctx.fillRect(t.x - t.size / 2, t.y - t.size / 2, t.size, t.size);

      if (t.tracked) {
        detCount++;
        const pulse = 0.6 + Math.sin(frame * 0.03 + targets.indexOf(t)) * 0.4;
        const boxPad = t.size + 8;
        ctx.strokeStyle = `rgba(232,49,42,${0.6 + pulse * 0.4})`;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(t.x - boxPad, t.y - boxPad, boxPad * 2, boxPad * 2);
        ctx.fillStyle = 'rgba(232,49,42,0.6)';
        ctx.font = '500 8px "IBM Plex Mono", monospace';
        ctx.fillText(`${t.label} ${t.conf}`, t.x - boxPad, t.y - boxPad - 4);
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.font = '400 7px "IBM Plex Mono", monospace';
        ctx.fillText(`T${String(t.trackAge).padStart(4, '0')}`, t.x + boxPad + 3, t.y);
      }
    }

    countEl.textContent = detCount;
    detectEl.textContent = `DETECTIONS: ${detCount}`;

    const sec = (frame / 60) | 0;
    const mm = String((sec / 60) | 0).padStart(2, '0');
    const ss = String(sec % 60).padStart(2, '0');
    const ff = String(frame % 60).padStart(2, '0');
    timeEl.textContent = `00:${mm}:${ss}:${ff}`;

    frame++;
    requestAnimationFrame(animate);
  }

  animate();
}

function drawArchCanvas() {
  const c = document.getElementById('archCanvas');
  const ctx = c.getContext('2d');
  const W = 700;
  const H = 540;

  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 35) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 35) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  function drawNode(x, y, w, h, label, sublabel, color) {
    ctx.fillStyle = color === 'red' ? 'rgba(232,49,42,0.08)' : 'rgba(255,255,255,0.03)';
    ctx.strokeStyle = color === 'red' ? 'rgba(232,49,42,0.4)' : 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color === 'red' ? 'rgba(232,49,42,0.8)' : 'rgba(255,255,255,0.6)';
    ctx.font = '500 11px "IBM Plex Mono", monospace';
    ctx.fillText(label, x + 12, y + (sublabel ? 20 : h / 2 + 4));
    if (sublabel) {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '400 9px "IBM Plex Mono", monospace';
      ctx.fillText(sublabel, x + 12, y + 36);
    }
  }

  function drawArrow(x1, y1, x2, y2) {
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    const angle = Math.atan2(y2 - y1, x2 - x1);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 6 * Math.cos(angle - 0.4), y2 - 6 * Math.sin(angle - 0.4));
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 6 * Math.cos(angle + 0.4), y2 - 6 * Math.sin(angle + 0.4));
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(232,49,42,0.5)';
  ctx.font = '500 8px "IBM Plex Mono", monospace';
  ctx.fillText('SENSOR LAYER', 20, 25);
  ctx.fillText('PROCESSING LAYER', 20, 185);
  ctx.fillText('FUSION LAYER', 20, 345);
  ctx.fillText('OUTPUT LAYER', 20, 465);

  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 0.5;
  [170, 330, 450].forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(680, y);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  drawNode(40, 50, 140, 48, 'EO DAYLIGHT', 'VIS 400-700nm', 'gray');
  drawNode(200, 50, 140, 48, 'MWIR', '3-5 μm', 'gray');
  drawNode(360, 50, 140, 48, 'LWIR', '8-14 μm', 'gray');
  drawNode(520, 50, 140, 48, 'SWIR / NV', '1-2.5 μm / I²', 'gray');

  drawNode(40, 200, 190, 48, 'PREPROCESS', 'NUC · DIS · AHE', 'gray');
  drawNode(260, 200, 190, 48, 'DETECT', 'Attn-FPN · 14ms', 'red');
  drawNode(480, 200, 190, 48, 'CLASSIFY', '200+ classes', 'red');

  drawArrow(110, 98, 135, 200);
  drawArrow(270, 98, 200, 200);
  drawArrow(430, 98, 355, 200);
  drawArrow(590, 98, 520, 200);
  drawArrow(230, 224, 260, 224);
  drawArrow(450, 224, 480, 224);

  drawNode(200, 360, 280, 48, 'MULTI-HYPOTHESIS TRACKER', 'IMM filter · 512 tracks', 'red');
  drawArrow(355, 248, 340, 360);
  drawArrow(575, 248, 450, 360);

  drawNode(60, 475, 130, 44, 'CoT / TAK', 'XML pub/sub', 'gray');
  drawNode(210, 475, 130, 44, 'LINK 16', 'J-series msg', 'gray');
  drawNode(360, 475, 130, 44, 'DISPLAY', 'Web / Native', 'gray');
  drawNode(510, 475, 150, 44, 'RECORDING', 'MISB 0601/0903', 'gray');
  drawArrow(280, 408, 125, 475);
  drawArrow(320, 408, 275, 475);
  drawArrow(360, 408, 425, 475);
  drawArrow(400, 408, 585, 475);

  ctx.shadowColor = 'rgba(232,49,42,0.15)';
  ctx.shadowBlur = 20;
  ctx.strokeStyle = 'rgba(232,49,42,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(258, 198, 194, 52, 6);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.15 });
  els.forEach((el) => observer.observe(el));
}

window.addEventListener('DOMContentLoaded', () => {
  drawPanel1();
  drawPanel2();
  drawPanel3();
  initLiveCanvas();
  drawArchCanvas();
  initScrollReveal();
});
