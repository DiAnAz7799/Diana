/**
 * charts.js
 * Minimal, dependency-free SVG chart primitives matching the approved visual
 * language (soft gradient area charts, ring/donut charts, animated gauges).
 * No external charting library is used per the technology constraints.
 *
 * These are intentionally small and composable — enough for KPI dashboards
 * without pulling in a charting dependency. For deep analytics views with
 * heavy interactivity, that's a deliberate future decision, not an oversight.
 */

const NS = 'http://www.w3.org/2000/svg';

/** Renders a smooth-ish area chart (straight segments + soft gradient fill). */
export function renderAreaChart(container, { values, color = 'var(--primary-dark)', fillId }) {
  const width = 560, height = 220, padX = 20, padTop = 20, padBottom = 20;
  const max = Math.max(...values) * 1.15;
  const min = 0;
  const stepX = (width - padX * 2) / (values.length - 1);

  const points = values.map((v, i) => {
    const x = padX + i * stepX;
    const y = height - padBottom - ((v - min) / (max - min)) * (height - padTop - padBottom);
    return [x, y];
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const areaPath = `M${padX},${height - padBottom} L${linePath.slice(1)} L${width - padX},${height - padBottom} Z`;
  const gradId = fillId || `grad-${Math.random().toString(36).slice(2, 9)}`;

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="width:100%;height:220px;overflow:visible;">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${[0,1,2,3,4].map(i => {
        const y = padTop + i * (height - padTop - padBottom) / 4;
        return `<line x1="${padX}" y1="${y}" x2="${width - padX}" y2="${y}" stroke="var(--border)" stroke-width="1"/>`;
      }).join('')}
      <path d="${areaPath}" fill="url(#${gradId})"/>
      <path d="${linePath}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${points.map(([x, y], i) => i === points.length - 1
        ? `<circle cx="${x}" cy="${y}" r="5" fill="${color}" stroke="#fff" stroke-width="2"/>`
        : `<circle cx="${x}" cy="${y}" r="3.5" fill="var(--surface)" stroke="${color}" stroke-width="2"/>`
      ).join('')}
    </svg>
  `;
}

/** Renders a ring/donut chart from an array of { value, color, label }. */
export function renderDonut(container, { segments, centerValue, centerLabel, size = 168, thickness = 20 }) {
  const r = (size / 2) - thickness / 2 - 4;
  const circumference = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  let offset = 0;
  const circles = segments.map(seg => {
    const length = (seg.value / total) * circumference;
    const el = `<circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${seg.color}"
      stroke-width="${thickness}" stroke-dasharray="${length} ${circumference}" stroke-dashoffset="${-offset}"/>`;
    offset += length;
    return el;
  }).join('');

  container.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <g transform="rotate(-90 ${size/2} ${size/2})">
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--surface-alt)" stroke-width="${thickness}"/>
        ${circles}
      </g>
      <text x="${size/2}" y="${size/2 - 4}" text-anchor="middle" font-family="var(--font-display)" font-weight="800" font-size="20" fill="var(--text)">${centerValue}</text>
      <text x="${size/2}" y="${size/2 + 14}" text-anchor="middle" font-size="10.5" fill="var(--text-faint)">${centerLabel}</text>
    </svg>
  `;
}

/** Renders (and can animate) a single-value progress ring, e.g. for KPI cards. */
export function renderProgressRing(container, { percent, color = 'var(--primary)', size = 58, thickness = 6, animate = true }) {
  const r = (size / 2) - thickness / 2 - 1;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  container.innerHTML = `
    <svg width="${size}" height="${size}" style="transform:rotate(-90deg);">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" stroke="var(--surface-alt)" stroke-width="${thickness}" fill="none"/>
      <circle class="progress-ring-fill" cx="${size/2}" cy="${size/2}" r="${r}" stroke="${color}" stroke-width="${thickness}"
        fill="none" stroke-linecap="round" stroke-dasharray="${circumference}"
        stroke-dashoffset="${animate ? circumference : offset}"
        style="transition: stroke-dashoffset 900ms cubic-bezier(.4,0,.2,1);"/>
    </svg>
  `;
  if (animate){
    requestAnimationFrame(() => requestAnimationFrame(() => {
      container.querySelector('.progress-ring-fill').style.strokeDashoffset = offset;
    }));
  }
}

/** Auto-initializes any [data-chart] element found on the page from inline JSON config. */
export function initDeclarativeCharts(){
  document.querySelectorAll('[data-chart]').forEach(el => {
    let config;
    try { config = JSON.parse(el.dataset.chart); } catch { return; }
    if (config.type === 'area') renderAreaChart(el, config);
    if (config.type === 'donut') renderDonut(el, config);
    if (config.type === 'ring') renderProgressRing(el, config);
  });
}
