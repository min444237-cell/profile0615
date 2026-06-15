// ============== 案例堆叠翻牌 ==============
// 交互流程（新）：
//   未翻牌：点击整摞卡区域 → 当前卡滑出、下一张卡滑入（动画，循环）
//             双击封面卡 / 点击「详情」按钮 → 进入翻牌详情
//             鼠标悬停扇形散开
//   已翻牌：详情面板内可直接「上一案例 / 下一案例」切换
//   ESC / 点击「返回」回到堆叠视图
//   防连点：动画期间（isAnimating[gIdx]）屏蔽点击
//   触摸兼容：使用 click 事件（移动端自动触发）

let activeGroupIndex = 0;    // 当前焦点案例组（0/1/2）
let activeCardIndex = {};   // 每组当前封面图索引：{ groupIdx: cardIdx }
let isFlipped = false;     // 是否处于翻牌详情模式
let isAnimating = {};      // 每组动画锁：{ groupIdx: boolean }

function renderCaseGroups() {
    const wrap = document.getElementById('caseGroups');
    if (!wrap) return;
    wrap.innerHTML = '';

    caseGroups.forEach((group, gIdx) => {
        activeCardIndex[gIdx] = 0;
        isAnimating[gIdx] = false;

        const stack = document.createElement('div');
        stack.className = 'card-stack';
        stack.setAttribute('data-group', gIdx);
        stack.setAttribute('role', 'group');
        stack.setAttribute('aria-label', `案例 ${group.groupNum}：${group.title}`);

        // 创建 .stack-deck 容器（容纳所有卡片，用于 hover 与点击区域）
        const deck = document.createElement('div');
        deck.className = 'stack-deck';

        // 该组的所有卡（错位叠放，放入 deck 内）
        group.images.forEach((img, i) => {
            const card = document.createElement('div');
            card.className = 'stack-card';
            card.style.setProperty('--stack-i', i + 1);
            if (i === 0) card.classList.add('is-cover');
            if (i > 0) card.classList.add('is-behind', `is-behind-${(i % 4) + 1}`);

            // 从 group.imageMeta 提取当前图片的标注信息(默认降级)
            const imgFileName = img.split('/').pop();
            const meta = (group.imageMeta && group.imageMeta[imgFileName]) || {
                caption: `${group.title} - 图 ${i + 1}`,
                hint: '1920×1080 · 16:9',
                tag: '案例图'
            };

            card.innerHTML = `
                <div class="card-front">
                    <img src="${img}" alt="${group.title} - 图 ${i + 1}" loading="lazy">
                    ${i === 0 ? `<div class="card-tag" style="background:${group.brandColor}">${group.groupNum} / ${group.brand}</div>` : ''}
                    ${i === 0 ? `<span class="card-indicator">1 / ${group.images.length}</span>` : ''}
                    ${i === 0 ? `<span class="card-switch-hint">点击切换下一张</span>` : ''}
                    ${i === 0 ? `<button class="card-detail-btn" data-action="detail" data-gidx="${gIdx}" aria-label="查看详情">&#x1F50D;</button>` : ''}
                </div>
            `;
            card.dataset.caption = meta.caption;
            card.dataset.hint = meta.hint;
            card.dataset.tag = meta.tag;
            card.dataset.tagColor = group.brandColor;
            deck.appendChild(card);
        });

        // 将 deck（含所有卡片）放入 stack
        stack.appendChild(deck);

        // 简介标注条（展示当前封面图的元数据简介 + 规格标注）
        const caption = document.createElement('div');
        caption.className = 'case-caption';
        const coverCard = deck.querySelector('.is-cover');
        const coverMeta = (coverCard && {
            caption: coverCard.dataset.caption,
            hint: coverCard.dataset.hint,
            tag: coverCard.dataset.tag,
            tagColor: coverCard.dataset.tagColor
        }) || { caption: group.title, hint: '1920×1080 · 16:9', tag: '案例图', tagColor: group.brandColor };
        caption.innerHTML = `
            <div class="case-caption-left">
                <span class="case-caption-tag" style="background:${coverMeta.tagColor}">${coverMeta.tag}</span>
                <span class="case-caption-text">${coverMeta.caption}</span>
            </div>
            <span class="case-caption-hint">${coverMeta.hint}</span>
        `;
        caption.dataset.gidx = gIdx;
        stack.appendChild(caption);

        // 组标题（未翻牌时显示，放在 deck 后面）
        const title = document.createElement('div');
        title.className = 'stack-title';
        title.innerHTML = `
            <div class="stack-title-row">
                <span class="stack-num">${group.groupNum}</span>
                <span class="stack-brand">${group.brand}</span>
            </div>
            <div class="stack-name">${group.title}</div>
            <div class="stack-meta">${group.period} · ${group.summary}</div>
        `;
        stack.appendChild(title);

        // 操作按钮栏（翻牌后显示）：返回 / 上一案例 / 下一案例
        const actions = document.createElement('div');
        actions.className = 'stack-actions';
        actions.innerHTML = `
            <button class="stack-btn secondary" data-action="back" aria-label="返回列表">&#x2039; 返回列表</button>
            <button class="stack-btn secondary" data-action="prev-group" aria-label="上一案例">&#x2039; ${caseGroups[(gIdx - 1 + caseGroups.length) % caseGroups.length].groupNum}</button>
            <button class="stack-btn primary" data-action="next-group" aria-label="下一案例">${caseGroups[(gIdx + 1) % caseGroups.length].groupNum} &#x203A;</button>
        `;
        stack.appendChild(actions);

        // 组大详情面板（翻牌后显示）
        const detail = document.createElement('div');
        detail.className = 'stack-detail';
        detail.innerHTML = buildGroupDetailHTML(group);
        stack.appendChild(detail);

        // ===== 绑定交互 =====

        // 点击整摞卡区域 → 切换下一张（防连点由 switchCard 内部处理）
        deck.addEventListener('click', (e) => {
                // 如果点击的是「详情」按钮，不触发切换
                if (e.target.closest('.card-detail-btn')) return;
                switchCard(gIdx);
            });

        // 「详情」按钮（悬停可见，点击进入详情）
        const detailBtn = stack.querySelector('.card-detail-btn');
        if (detailBtn) {
            detailBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isAnimating[gIdx]) return;  // 动画中不允许点详情
                if (!isFlipped) enterFlippedView(gIdx);
            });
        }

        // 绑定操作按钮
        actions.querySelector('[data-action="back"]').addEventListener('click', (e) => {
            e.stopPropagation();
            exitFlippedView();
        });
        actions.querySelector('[data-action="prev-group"]').addEventListener('click', (e) => {
            e.stopPropagation();
            switchCase(gIdx, -1);
        });
        actions.querySelector('[data-action="next-group"]').addEventListener('click', (e) => {
            e.stopPropagation();
            switchCase(gIdx, 1);
        });

        // 初始化 behind 卡的类名（is-behind-1~4）
        updateBehindClasses(stack, gIdx);

        wrap.appendChild(stack);
    });

    bindGroupNav();
    updateCaseNavLabels();
}

// 构建组的二级详情 HTML
function buildGroupDetailHTML(group) {
    const metricsHtml = group.metrics.map(m => `
        <div class="metric-box">
            <div class="label">${m.label}</div>
            <div class="value">${m.value}</div>
        </div>
    `).join('');

    const tableHtml = `
        <table class="data-table">
            <caption>${group.tableData.title}</caption>
            <thead><tr>${group.tableData.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>
                ${group.tableData.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
            </tbody>
        </table>
    `;

    return `
        <div class="detail-head">
            <div class="detail-tag" style="background:${group.brandColor}">${group.groupNum} / ${group.brand}</div>
            <h3>${group.title}</h3>
            <div class="detail-meta">${group.brand} · ${group.period} · ${group.role}</div>
        </div>
        <div class="metric-grid">${metricsHtml}</div>
        <div class="detail-grid">
            <div>
                <h4>挑战与目标</h4>
                <p>${group.challenge}</p>
                <h4>投放策略</h4>
                <p>${group.strategy}</p>
            </div>
            <div>
                <h4>最终成果</h4>
                <p>${group.results}</p>
            </div>
        </div>
        <h4>数据拆解</h4>
        ${tableHtml}
        <h4>执行要点</h4>
        <ul class="execution-list">${group.execution.map(i => `<li>${i}</li>`).join('')}</ul>
        <h4>经验总结</h4>
        <ul class="insight-list">${group.insights.map(i => `<li>${i}</li>`).join('')}</ul>
        <div class="detail-image-strip" id="strip-${group.id}">
            ${group.images.map((img, i) => `<img src="${img}" alt="图${i + 1}" class="strip-img" data-i="${i}">`).join('')}
        </div>
    `;
}

// ===== 卡片切换（核心动画）=====
function switchCard(gIdx) {
    if (isFlipped) return;
    if (isAnimating[gIdx]) return;
    if (!caseGroups[gIdx]) return;

    const group = caseGroups[gIdx];
    const stack = document.querySelector(`.card-stack[data-group="${gIdx}"]`);
    if (!stack) return;

    const cards = [...stack.querySelectorAll('.stack-card')];
    const n = cards.length;
    const currentIdx = activeCardIndex[gIdx];
    const nextIdx = (currentIdx + 1) % n;

    const currentCard = cards[currentIdx];
    const nextCard = cards[nextIdx];

    isAnimating[gIdx] = true;
    stack.querySelector('.stack-deck')?.classList.add('is-switching');

    // 当前卡：添加滑出动画类
    currentCard.classList.remove('is-cover');
    currentCard.classList.add('is-exiting');

    // 下一张卡：先移除 behind 类，强制回流确保 enter 动画从屏幕右侧开始
    nextCard.classList.remove('is-behind', 'is-behind-1', 'is-behind-2', 'is-behind-3', 'is-behind-4');
    nextCard.offsetHeight;
    nextCard.classList.add('is-entering');

    // 动画结束后清理（防重复执行）
    let cleanedUp = false;
    const cleanup = () => {
        if (cleanedUp) return;
        cleanedUp = true;

        // 移除动画类前禁用 transition，防止跳变
        currentCard.style.transition = 'none';
        nextCard.style.transition = 'none';

        currentCard.classList.remove('is-exiting');
        nextCard.classList.remove('is-entering');

        // 强制回流
        currentCard.offsetHeight;
        nextCard.offsetHeight;

        activeCardIndex[gIdx] = nextIdx;
        updateBehindClasses(stack, gIdx);
        moveCardTag(stack, group);
        updateCardIndicator(stack, gIdx);
        updateCaseCaption(stack, gIdx);

        // 下一帧恢复 transition
        requestAnimationFrame(() => {
            currentCard.style.transition = '';
            nextCard.style.transition = '';
        });

        isAnimating[gIdx] = false;
        stack.querySelector('.stack-deck')?.classList.remove('is-switching');
    };

    const onEnd = (e) => {
        e.stopPropagation();
        cleanup();
        nextCard.removeEventListener('animationend', onEnd);
        currentCard.removeEventListener('animationend', onEnd);
    };
    nextCard.addEventListener('animationend', onEnd);
    currentCard.addEventListener('animationend', onEnd);

    // 兜底：520ms 后强制清理
    setTimeout(() => {
        if (isAnimating[gIdx]) cleanup();
    }, 520);
}

// 更新 behind 卡的 is-behind-N 类名（N=1 最 visible，N=4 最 hidden）
function updateBehindClasses(stack, gIdx) {
    const cards = [...stack.querySelectorAll('.stack-card')];
    const n = cards.length;
    const activeIdx = activeCardIndex[gIdx];

    cards.forEach((card, i) => {
        // 移除所有状态类
        card.classList.remove('is-cover', 'is-behind', 'is-exiting', 'is-entering',
            'is-behind-1', 'is-behind-2', 'is-behind-3', 'is-behind-4');

        if (i === activeIdx) {
            card.classList.add('is-cover');
        } else {
            // 计算此卡在「叠放顺序」中的位置（1=最靠近封面，n-1=最底部）
            let pos = (i - activeIdx + n) % n;
            card.classList.add('is-behind', `is-behind-${pos}`);
        }
    });
}

// 将 card-tag 从小去的封面卡移到新的封面卡
function moveCardTag(stack, group) {
    // 删除所有现有的 card-tag
    stack.querySelectorAll('.card-tag').forEach(t => t.remove());
    // 在新的封面卡上新建
    const newCover = stack.querySelector('.is-cover .card-front');
    if (newCover) {
        const tag = document.createElement('div');
        tag.className = 'card-tag';
        tag.style.background = group.brandColor;
        tag.textContent = `${group.groupNum} / ${group.brand}`;
        newCover.appendChild(tag);
    }
}

// 更新卡片右下角的「当前/总数」指示器
function updateCardIndicator(stack, gIdx) {
    const indicator = stack.querySelector('.card-indicator');
    if (!indicator) return;
    const n = caseGroups[gIdx].images.length;
    const current = activeCardIndex[gIdx] + 1;
    indicator.textContent = `${current} / ${n}`;
}

// 更新案例简介标注(同步当前封面图的 caption / hint / tag)
function updateCaseCaption(stack, gIdx) {
    const caption = stack.querySelector('.case-caption');
    if (!caption) return;
    const group = caseGroups[gIdx];
    const coverCard = stack.querySelector('.stack-card.is-cover');
    if (!coverCard) return;

    const tagEl = caption.querySelector('.case-caption-tag');
    const textEl = caption.querySelector('.case-caption-text');
    const hintEl = caption.querySelector('.case-caption-hint');

    if (tagEl) {
        tagEl.textContent = coverCard.dataset.tag || '案例图';
        tagEl.style.background = coverCard.dataset.tagColor || group.brandColor;
    }
    if (textEl) textEl.textContent = coverCard.dataset.caption || group.title;
    if (hintEl) hintEl.textContent = coverCard.dataset.hint || '1920×1080 · 16:9';
}

// ============== About 区域:实习经历 / 校园经历 / 个人特质关键词 渲染 ==============
function renderTraitKeywords() {
    const mount = document.getElementById('traitKeywords');
    if (!mount || typeof traitKeywords === 'undefined') return;
    mount.innerHTML = traitKeywords.map(k => `<span class="trait-keyword">${k}</span>`).join('');
}

// =================== 数据卡片墙(实习/校园经历通用) ===================

/** 渲染顶部 tagline 数据条(数字徽章横排) */
function renderTaglineStats(stats) {
    if (!stats || !stats.length) return '';
    return `
        <div class="tagline-stats">
            ${stats.map(s => `
                <div class="tagline-stat">
                    <span class="tagline-stat-value">${s.value}</span>
                    <span class="tagline-stat-label">${s.label}</span>
                </div>
            `).join('')}
        </div>
    `;
}

/** 渲染 SVG 雷达图(六维能力图谱) */
function renderRadar(radar, size = 280) {
    if (!radar || radar.length < 3) return '';
    const cx = size / 2;
    const cy = size / 2;
    const maxR = size * 0.38;
    const n = radar.length;
    // 每个顶点的角度,从正上方开始
    const angleOf = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const pointAt = (i, r) => ({
        x: cx + r * Math.cos(angleOf(i)),
        y: cy + r * Math.sin(angleOf(i))
    });
    // 同心环:0.25 / 0.5 / 0.75 / 1.0
    const rings = [0.25, 0.5, 0.75, 1.0];
    const ringPolys = rings.map(scale => {
        const pts = radar.map((_, i) => {
            const p = pointAt(i, maxR * scale);
            return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        }).join(' ');
        return `<polygon points="${pts}" fill="none" stroke="rgba(50, 90, 130, 0.12)" stroke-width="1" stroke-dasharray="${scale === 1 ? '0' : '2 3'}"/>`;
    }).join('');
    // 轴线
    const axisLines = radar.map((_, i) => {
        const p = pointAt(i, maxR);
        return `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="rgba(50, 90, 130, 0.18)" stroke-width="1"/>`;
    }).join('');
    // 数据多边形(带动画 class)
    const dataPoints = radar.map((d, i) => {
        const r = maxR * (d.score / 100);
        const p = pointAt(i, r);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    }).join(' ');
    // 顶点小圆点
    const dots = radar.map((d, i) => {
        const r = maxR * (d.score / 100);
        const p = pointAt(i, r);
        return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3" fill="var(--accent)" class="radar-dot" style="animation-delay:${i * 0.12}s"/>`;
    }).join('');
    // 文字标签
    const labels = radar.map((d, i) => {
        const p = pointAt(i, maxR + 28);
        return `<text x="${p.x.toFixed(1)}" y="${p.y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" class="radar-label">
                    <tspan class="radar-label-score">${d.score}</tspan>
                    <tspan class="radar-label-name" x="${p.x.toFixed(1)}" dy="1.2em">${d.label}</tspan>
                </text>`;
    }).join('');

    return `
        <svg class="radar-svg" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            ${ringPolys}
            ${axisLines}
            <polygon points="${dataPoints}" class="radar-data"/>
            ${dots}
            ${labels}
        </svg>
    `;
}

/** 渲染单段经历的数据卡(品牌色 + headline + 数字徽章墙 + 精简文字) */
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return r + ', ' + g + ', ' + b;
}

/** 数据卡左上角印章装饰（品牌 → 插画素材 + 裁切方式） */
const CARD_DECOR_STAMPS = {
    champion: {
        src: 'assets/decor/flower-blue.png',
        alt: '蓝色牵牛花',
        bgMode: 'light',
        objectPosition: 'center center',
        rotate: -7
    },
    hbn: {
        src: 'assets/decor/flower-pink.png',
        alt: '粉色百合',
        bgMode: 'dark',
        objectPosition: 'center 35%',
        rotate: -5
    },
    oppo: {
        src: 'assets/decor/bubble-rainbow.png',
        alt: '彩虹肥皂泡',
        bgMode: 'dark',
        objectPosition: 'center center',
        rotate: 8
    },
    szu: {
        src: 'assets/decor/flower-blue.png',
        alt: '蓝色牵牛花',
        bgMode: 'light',
        objectPosition: 'center center',
        rotate: -4
    }
};

function renderCardCornerStamp(brandKey) {
    const stamp = CARD_DECOR_STAMPS[brandKey];
    if (!stamp) return '';
    return `
        <div class="data-card-corner-stamp data-card-corner-stamp--${stamp.bgMode}"
             style="--stamp-rotate:${stamp.rotate}deg"
             aria-hidden="true">
            <img src="${stamp.src}" alt="" loading="lazy"
                 style="object-position:${stamp.objectPosition}" />
        </div>
    `;
}

function renderDataCard(item, brandColors) {
    const brandColor = (brandColors && brandColors[item.brandKey]) || '#ff9a9e';
    const brandRgb = hexToRgb(brandColor);
    const metricsHtml = (item.metrics || []).map((m, i) => `
        <div class="metric-badge${m.highlight ? ' metric-highlight' : ''}" style="--metric-delay:${i * 0.06}s">
            <span class="metric-value">${m.value}</span>
            <span class="metric-label">${m.label}</span>
        </div>
    `).join('');
    // 文字部分:3 段精简「图标+标签+短句」(可选用 summary 数组,无则回退到 highlights)
    const summarySource = item.summary && item.summary.length ? item.summary : null;
    const summaryHtml = summarySource
        ? summarySource.map((s, i) => `
            <div class="summary-row" style="--row-delay:${i * 0.08}s">
                <span class="summary-icon" aria-hidden="true">${s.icon || '◆'}</span>
                <span class="summary-tag">${s.tag || '亮点'}</span>
                <span class="summary-text">${s.text}</span>
            </div>
        `).join('')
        : (item.highlights || []).map((h, i) => `
            <div class="summary-row" style="--row-delay:${i * 0.08}s">
                <span class="summary-icon" aria-hidden="true">◆</span>
                <span class="summary-tag">亮点</span>
                <span class="summary-text">${h}</span>
            </div>
        `).join('');
    return `
        <div class="data-card" style="--brand-color:${brandColor};--brand-color-rgb:${brandRgb};">
            <div class="data-card-stripe">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="data-card-head">
                <div class="data-card-head-text">
                    <div class="data-card-brand">${item.brand}</div>
                    <div class="data-card-role-line">
                        <span class="data-card-role">${item.role}</span>
                        <span class="data-card-period">${item.period}</span>
                    </div>
                </div>
            </div>
            <div class="data-card-headline">${item.headline || ''}</div>
            <div class="metric-grid">${metricsHtml}</div>
            <div class="summary-block">${summaryHtml}</div>
        </div>
    `;
}

/** 渲染「数据卡片墙」整块(实习:能力雷达 + tagline + 3 卡片;校园:tagline + 1 卡片) */
function renderExperienceWall(data, opts = {}) {
    const tagline = renderTaglineStats(data.taglineStats);
    const radar = opts.showRadar ? renderRadar(data.radar) : '';
    const cards = data.items.map(item => renderDataCard(item, data.brandColors)).join('');
    // 校园模块:独立容器,单卡占满整行;实习模块:沿用 3 列并排
    const wallClass = opts.showRadar ? 'exp-wall' : 'exp-wall exp-campus-wall';
    return `
        <div class="internship-section ${wallClass}">
            <div class="internship-header">
                <div class="internship-title-group">
                    <span class="internship-title">${data.title}</span>
                    <span class="internship-subtitle">${data.subtitle}</span>
                </div>
            </div>
            ${tagline}
            ${radar ? `<div class="radar-wrap">${radar}<div class="radar-caption">能力图谱 · 综合评估</div></div>` : ''}
            <div class="data-card-grid">${cards}</div>
        </div>
    `;
}

function renderAboutInternship() {
    const mount = document.getElementById('aboutInternshipMount');
    if (!mount || typeof internshipData === 'undefined') return;
    mount.innerHTML = renderExperienceWall(internshipData, { showRadar: true });
    // 进入视口时触发数据填充动画(从 0 升到目标值)
    requestAnimationFrame(() => animateRadarOnView(mount));
    requestAnimationFrame(() => animateMetricsOnView(mount));
}

function renderAboutCampus() {
    const mount = document.getElementById('aboutCampusMount');
    if (!mount || typeof campusData === 'undefined') return;
    mount.innerHTML = renderExperienceWall(campusData, { showRadar: false });
    requestAnimationFrame(() => animateMetricsOnView(mount));
}

/**
 * IntersectionObserver:雷达图/数字徽章进入视口时,触发一次填充动画
 * - .radar-data:stroke-dasharray 动画 + 透明度淡入
 * - .metric-badge:从 0 升到目标值(count-up)
 */
function animateRadarOnView(mount) {
    const radar = mount.querySelector('.radar-data');
    if (!radar) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                radar.classList.add('radar-data-animated');
                observer.disconnect();
            }
        });
    }, { threshold: 0.3 });
    observer.observe(radar);
}

function animateMetricsOnView(mount) {
    const badges = mount.querySelectorAll('.metric-badge');
    if (!badges.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const badge = entry.target;
                const valueEl = badge.querySelector('.metric-value');
                const target = valueEl.textContent.trim();
                // 解析数字部分(支持 3.65 / 1.63 / 70w+ / +20% / 4.2w)
                const match = target.match(/^([+\-]?)([\d.]+)(.*)$/);
                if (!match) { observer.disconnect(); return; }
                const sign = match[1] || '';
                const numStr = match[2];
                const suffix = match[3] || '';
                const targetNum = parseFloat(numStr);
                if (isNaN(targetNum) || targetNum === 0) { observer.disconnect(); return; }
                const decimals = (numStr.split('.')[1] || '').length;
                const duration = 1100; // ms
                const start = performance.now();
                const tick = (now) => {
                    const t = Math.min(1, (now - start) / duration);
                    // ease-out-cubic
                    const eased = 1 - Math.pow(1 - t, 3);
                    const cur = (targetNum * eased).toFixed(decimals);
                    valueEl.textContent = sign + cur + suffix;
                    if (t < 1) requestAnimationFrame(tick);
                    else valueEl.textContent = target; // 确保最终值精确
                };
                requestAnimationFrame(tick);
                observer.unobserve(badge);
            }
        });
    }, { threshold: 0.5 });
    badges.forEach(b => observer.observe(b));
}

// ===== 翻牌视图（详情面板）=====
function enterFlippedView(gIdx) {
    if (isAnimating[gIdx]) return;  // 动画中不能进入翻牌
    activeGroupIndex = gIdx;
    isFlipped = true;
    updateStackState();
    updateCaseNavLabels();
    setTimeout(() => {
        const stack = document.querySelector(`.card-stack[data-group="${gIdx}"]`);
        if (stack) stack.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

function exitFlippedView() {
    isFlipped = false;
    updateStackState();
    updateCaseNavLabels();
}

// 切换到上一个/下一个案例组（delta = -1 或 +1）
function switchCase(currentIdx, delta) {
    const nextIdx = (currentIdx + delta + caseGroups.length) % caseGroups.length;
    activeGroupIndex = nextIdx;
    isFlipped = true;
    updateStackState();
    updateCaseNavLabels();

    const nextStack = document.querySelector(`.card-stack[data-group="${nextIdx}"]`);
    if (nextStack) nextStack.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// 更新所有栈的可视状态 + 操作按钮文字
function updateStackState() {
    document.querySelectorAll('.card-stack').forEach((stack, gIdx) => {
        const isActive = (gIdx === activeGroupIndex && isFlipped);
        stack.classList.toggle('is-flipped', isActive);
        stack.classList.toggle('is-dimmed', isFlipped && gIdx !== activeGroupIndex);

        // 重置详情面板的动画样式
        const detail = stack.querySelector('.stack-detail');
        if (detail && !isActive) {
            detail.style.opacity = '';
            detail.style.transform = '';
            detail.style.transition = '';
        }
    });
}

// 更新操作按钮上的案例编号
function updateCaseNavLabels() {
    document.querySelectorAll('.card-stack').forEach((stack, gIdx) => {
        const prevBtn = stack.querySelector('[data-action="prev-group"]');
        const nextBtn = stack.querySelector('[data-action="next-group"]');
        if (prevBtn) {
            const prevIdx = (gIdx - 1 + caseGroups.length) % caseGroups.length;
            prevBtn.textContent = `\u2039 ${caseGroups[prevIdx].groupNum}`;
        }
        if (nextBtn) {
            const nextIdx = (gIdx + 1) % caseGroups.length;
            nextBtn.textContent = `${caseGroups[nextIdx].groupNum} \u203A`;
        }
    });
}

// 绑定 Virtual Space 顶部的左右箭头
function bindGroupNav() {
    const prev = document.getElementById('groupPrev');
    const next = document.getElementById('groupNext');
    if (prev) prev.onclick = () => {
        const target = (activeGroupIndex - 1 + caseGroups.length) % caseGroups.length;
        if (isFlipped) {
            switchCase(activeGroupIndex, -1);
        } else {
            activeGroupIndex = target;
            scrollToGroup(activeGroupIndex);
        }
    };
    if (next) next.onclick = () => {
        const target = (activeGroupIndex + 1) % caseGroups.length;
        if (isFlipped) {
            switchCase(activeGroupIndex, 1);
        } else {
            activeGroupIndex = target;
            scrollToGroup(activeGroupIndex);
        }
    };
}

function scrollToGroup(gIdx) {
    const stack = document.querySelector(`.card-stack[data-group="${gIdx}"]`);
    if (stack) stack.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============== 图片灯箱（点击大图放大） ==============
function bindLightbox() {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightboxImg');
    if (!lb || !lbImg) return;

    document.addEventListener('click', (e) => {
        const t = e.target;
        if (t.classList && (t.classList.contains('strip-img'))) {
            e.stopPropagation();
            lbImg.src = t.src;
            lb.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    const close = () => {
        lb.classList.remove('active');
        document.body.style.overflow = '';
    };
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lb.classList.contains('active')) close();
    });
}

// ============== 导航：滚动联动 + 锚点 ==============
function bindNavActive() {
    const navLinks = document.querySelectorAll('.nav-pill a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    const sections = ['home', 'about', 'space'];
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.35) {
                const id = entry.target.id;
                navLinks.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('data-section') === id);
                });
            }
        });
    }, { threshold: [0.35, 0.6] });

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
}

// ============== FAB 播放按钮 ==============
function bindFab() {
    const fab = document.getElementById('fabPlay');
    if (!fab) return;
    let playing = false;
    fab.addEventListener('click', () => {
        playing = !playing;
        fab.textContent = playing ? '\u276A\u276B' : '\u25B6';
        fab.title = playing ? '暂停' : '播放';
    });
}

// ============== 全局键盘 ==============
function bindGlobalKeys() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (isFlipped) {
                exitFlippedView();
            }
        }
        // 未翻牌时：左右键切换案例组
        if (e.key === 'ArrowRight' && !isFlipped) {
            activeGroupIndex = (activeGroupIndex + 1) % caseGroups.length;
            scrollToGroup(activeGroupIndex);
        }
        if (e.key === 'ArrowLeft' && !isFlipped) {
            activeGroupIndex = (activeGroupIndex - 1 + caseGroups.length) % caseGroups.length;
            scrollToGroup(activeGroupIndex);
        }
        // 未翻牌时：上下键切换当前组的图片
        if (e.key === 'ArrowDown' && !isFlipped) {
            // 找到当前可视的案例组
            const stacks = document.querySelectorAll('.card-stack');
            stacks.forEach((stack, gIdx) => {
                const rect = stack.getBoundingClientRect();
                if (rect.top >= 0 && rect.top < window.innerHeight * 0.6) {
                    switchCard(gIdx);
                }
            });
        }
    });
}

// ============== 生成海面上的星光 ==============
function createStars() {
    const starsLayer = document.getElementById('stars-layer');
    if (!starsLayer) return;
    
    const starCount = 40; // 星星数量
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // 随机位置（主要在海面上，即下半部分）
        const left = Math.random() * 100;
        const top = 40 + Math.random() * 55; // 40%到95%的高度
        
        // 随机大小
        const size = 2 + Math.random() * 4;
        
        // 随机动画延迟
        const delay = Math.random() * 5;
        
        // 随机透明度
        const opacity = 0.4 + Math.random() * 0.6;
        
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${delay}s`;
        star.style.opacity = opacity;
        
        starsLayer.appendChild(star);
    }
}

// ============== 生成波光粼粼的光斑 ==============
function createSparkles() {
    const sparkleLayer = document.getElementById('sparkle-layer');
    if (!sparkleLayer) return;
    
    const sparkleCount = 60; // 光斑数量
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        
        // 随机位置（主要在海面上）
        const left = Math.random() * 100;
        const top = 30 + Math.random() * 65; // 30%到95%的高度
        
        // 随机大小
        const size = 8 + Math.random() * 25;
        
        // 随机动画延迟
        const delay = Math.random() * 6;
        
        // 随机透明度
        const opacity = 0.5 + Math.random() * 0.5;
        
        sparkle.style.left = `${left}%`;
        sparkle.style.top = `${top}%`;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.animationDelay = `${delay}s`;
        sparkle.style.opacity = opacity;
        
        sparkleLayer.appendChild(sparkle);
    }
}

// ============== 初始化 ==============
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    createSparkles();
    renderCaseGroups();
    renderTraitKeywords();
    renderAboutInternship();
    renderAboutCampus();
    bindNavActive();
    bindFab();
    bindLightbox();
    bindGlobalKeys();
});
