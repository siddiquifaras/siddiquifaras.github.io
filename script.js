/* Faras Siddiqui — page behaviour: contents, footnotes, previews, search. */
(function () {
    'use strict';

    var FRAMES2PY_LOGO = 'https://siddiquifaras.github.io/frames2py/assets/frames2py-logo.svg';

    var PAGES = {
        'index.html': {
            title: 'Faras Siddiqui',
            desc: 'About me: agentic systems, LLM inference, GNNs, neuromorphic computing',
            thumb: 'images/profile.jpeg',
            extract: 'I build production AI systems: agentic workflows, LLM inference, graph neural networks and the GPU infrastructure they run on. Founding engineer at CVision; I wrote Frames2Py and built core pieces of TALON.'
        },
        'frames2py.html': {
            title: 'Frames2Py',
            desc: 'Python library for live, decoupled observation of event-camera state',
            thumb: FRAMES2PY_LOGO,
            contain: true,
            extract: 'My open-source Python library for watching an event camera live. A producer feeds events to an Engine that publishes immutable snapshots; any number of consumers read them at their own pace, and the producer never waits. Sustains over 20M events/s.'
        },
        'talon.html': {
            title: 'TALON',
            desc: 'Neuromorphic computing SDK by Type 1 Compute',
            extract: 'Tactical AI at Low-power On-device Nodes: an SDK that takes PyTorch models to neuromorphic hardware. I built its simulation engine, IR visualiser and a binary encoder that stores a ten-layer network in about 200 bytes instead of 200 KB.'
        },
        'contact.html': {
            title: 'Contact',
            desc: 'Email, book a call, LinkedIn, GitHub',
            extract: 'Email me or book a call directly on my calendar.'
        }
    };

    var ACTIONS = [
        { title: 'Book a call', desc: 'Pick a time on the calendar', url: 'contact.html#Book_a_call', icon: 'i-calendar', keywords: 'meeting schedule calendar interview chat' },
        { title: 'Email me', desc: 'siddiquifaras@gmail.com', url: 'mailto:siddiquifaras@gmail.com', icon: 'i-mail', keywords: 'contact email reach hire' },
        { title: 'Download CV', desc: 'PDF', url: 'files/Faras_Siddiqui_CV_AI_Engineer.pdf', icon: 'i-file', keywords: 'resume cv pdf download' },
        { title: 'GitHub', desc: 'github.com/siddiquifaras', url: 'https://github.com/siddiquifaras', icon: 'i-github', keywords: 'code repositories open source' },
        { title: 'LinkedIn', desc: 'muhammad-faras-siddiqui', url: 'https://www.linkedin.com/in/muhammad-faras-siddiqui/', icon: 'i-linkedin', keywords: 'profile social' },
        { title: 'GitLab', desc: 'gitlab.com/sidfaras', url: 'https://gitlab.com/sidfaras', icon: 'i-gitlab', keywords: 'code repositories' }
    ];

    var SECTIONS = [
        { title: 'Experience', page: 'index.html', id: 'Experience', keywords: 'work career cvision job role founding engineer intern' },
        { title: 'CVision', page: 'index.html', id: 'Experience', keywords: 'founding engineer agentic llm inference gpu devops infrastructure revenue' },
        { title: 'Selected projects', page: 'index.html', id: 'Projects', keywords: 'portfolio work frames2py talon neuromorphic computing' },
        { title: 'Open-source contributions', page: 'index.html', id: 'Open_source', keywords: 'nir hls4ml picolm pull request upstream' },
        { title: 'Skills', page: 'index.html', id: 'Skills', keywords: 'stack tools languages python pytorch docker kubernetes gnn gpu rag agents agentic llm' },
        { title: 'Education', page: 'index.html', id: 'Education', keywords: 'nust university degree school' },
        { title: 'Performance', page: 'frames2py.html', id: 'Performance', keywords: 'benchmark throughput events per second' },
        { title: 'Kernels', page: 'frames2py.html', id: 'Kernels', keywords: 'time surface voxel grid histogram' },
        { title: 'My work on TALON', page: 'talon.html', id: 'My_work', keywords: 'compression 200 bytes encoder visualiser simulation' }
    ];

    function $(sel, root) { return (root || document).querySelector(sel); }
    function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

    function el(tag, attrs, children) {
        var node = document.createElement(tag);
        Object.keys(attrs || {}).forEach(function (k) {
            if (k === 'text') node.textContent = attrs[k];
            else if (k === 'html') node.innerHTML = attrs[k];
            else node.setAttribute(k, attrs[k]);
        });
        (children || []).forEach(function (c) { if (c) node.appendChild(c); });
        return node;
    }

    function icon(id) {
        return '<svg class="icon" aria-hidden="true"><use href="#' + id + '"/></svg>';
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    var here = location.pathname.split('/').pop() || 'index.html';
    var canHover = window.matchMedia('(hover: hover)').matches;

    function headingText(h) {
        var clone = h.cloneNode(true);
        $all('.num', clone).forEach(function (n) { n.remove(); });
        return clone.textContent.trim();
    }

    /* ------------------------------------------------------------------
       Header: border, reading progress, current section
       ------------------------------------------------------------------ */

    function initHeader() {
        var header = $('.site-header');
        if (!header) return;
        var progress = $('.reading-progress', header);
        var context = $('.brand-context', header);
        var headings = $all('.article-body h2[id]');
        var ticking = false;

        function update() {
            ticking = false;
            var y = window.scrollY;
            header.classList.toggle('scrolled', y > 8);
            if (progress) {
                var max = document.documentElement.scrollHeight - window.innerHeight;
                progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
            }
            if (context) {
                var current = null;
                headings.forEach(function (h) { if (h.getBoundingClientRect().top < 120) current = h; });
                var text = current ? headingText(current) : '';
                if (context.textContent !== text) context.textContent = text;
            }
        }

        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        window.addEventListener('resize', update);
        update();

        var menuButton = $('.menu-button');
        var sheet = $('#menu-sheet');
        if (menuButton && sheet) {
            menuButton.addEventListener('click', function () {
                var open = sheet.hidden;
                sheet.hidden = !open;
                menuButton.setAttribute('aria-expanded', String(open));
            });
            sheet.addEventListener('click', function (e) {
                if (e.target.closest('a')) { sheet.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }
            });
        }
    }

    /* ------------------------------------------------------------------
       Contents
       ------------------------------------------------------------------ */

    function buildToc(headings) {
        var nav = el('nav', { 'class': 'toc', 'aria-label': 'Contents' });
        nav.appendChild(el('span', { 'class': 'toc-label', text: 'Contents' }));
        var root = el('ol');
        var lastH2 = null;
        headings.forEach(function (h) {
            var num = $('.num', h);
            var a = el('a', { href: '#' + h.id, 'data-target': h.id });
            if (h.tagName === 'H2') a.appendChild(el('span', { 'class': 'n', text: num ? num.textContent : '' }));
            a.appendChild(el('span', { text: headingText(h) }));
            var li = el('li', null, [a]);
            if (h.tagName === 'H2' || !lastH2) {
                root.appendChild(li);
                lastH2 = li;
            } else {
                var sub = $('ol', lastH2) || lastH2.appendChild(el('ol'));
                sub.appendChild(li);
            }
        });
        nav.appendChild(root);
        return nav;
    }

    function initToc() {
        var rail = $('.toc-rail');
        var headings = $all('.article-body h2[id], .article-body h3[id]');
        if (!rail || headings.length < 3) return;
        document.body.classList.add('has-toc');

        var actions = $('.toc-actions', rail);
        rail.insertBefore(buildToc(headings), actions);
        if (actions) $('.toc', rail).appendChild(actions);

        var sheet = $('.toc-sheet');
        var scrim = $('.scrim');
        var fab = $('.toc-fab');
        if (sheet && fab && scrim) {
            sheet.appendChild(buildToc(headings));
            var close = function () {
                sheet.hidden = true;
                scrim.hidden = true;
                fab.setAttribute('aria-expanded', 'false');
            };
            fab.addEventListener('click', function () {
                sheet.hidden = false;
                scrim.hidden = false;
                fab.setAttribute('aria-expanded', 'true');
                var active = $('a.active', sheet);
                if (active) active.scrollIntoView({ block: 'center' });
            });
            scrim.addEventListener('click', close);
            sheet.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
            document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
        }

        var ticking = false;
        function update() {
            ticking = false;
            var active = null;
            for (var i = 0; i < headings.length; i++) {
                if (headings[i].getBoundingClientRect().top < 140) active = headings[i];
                else break;
            }
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
                active = headings[headings.length - 1];
            }
            var id = active ? active.id : null;
            $all('.toc a').forEach(function (a) {
                a.classList.toggle('active', a.getAttribute('data-target') === id);
            });
        }
        window.addEventListener('scroll', function () {
            if (!ticking) { ticking = true; requestAnimationFrame(update); }
        }, { passive: true });
        update();
    }

    /* ------------------------------------------------------------------
       Footnotes: numbered by first use, back-links, hover cards
       ------------------------------------------------------------------ */

    function initFootnotes() {
        var list = $('ol.references');
        if (!list) return;

        var order = [];
        var uses = {};
        $all('sup.ref a[href^="#ref-"]').forEach(function (a) {
            var key = a.getAttribute('href').slice(5);
            if (!uses[key]) { uses[key] = []; order.push(key); }
            uses[key].push(a);
        });

        var letters = 'abcdefghijklmnopqrstuvwxyz';
        order.forEach(function (key, i) {
            var item = document.getElementById('ref-' + key);
            uses[key].forEach(function (a, j) {
                a.textContent = String(i + 1);
                a.setAttribute('aria-label', 'Source ' + (i + 1));
                a.parentNode.id = 'cite-' + key + '-' + j;
            });
            if (!item) return;
            list.appendChild(item);
            var back = el('span', { 'class': 'backlinks' });
            if (uses[key].length === 1) {
                back.appendChild(el('a', { href: '#cite-' + key + '-0', 'aria-label': 'Back to text', text: '↑' }));
            } else {
                back.appendChild(document.createTextNode('↑ '));
                uses[key].forEach(function (a, j) {
                    back.appendChild(el('a', { href: '#cite-' + key + '-' + j, 'aria-label': 'Back to citation ' + (j + 1), text: letters[j] }));
                    back.appendChild(document.createTextNode(' '));
                });
            }
            var body = el('div', null, [back]);
            while (item.firstChild) body.appendChild(item.firstChild);
            item.appendChild(body);
        });

        $all('li', list).forEach(function (item) {
            if (order.indexOf(item.id.slice(4)) === -1) list.appendChild(item);
        });

        $all('sup.ref a').forEach(function (a) {
            a.addEventListener('click', function () {
                var target = document.getElementById(a.getAttribute('href').slice(1));
                if (!target) return;
                $all('.references li.highlight').forEach(function (li) { li.classList.remove('highlight'); });
                target.classList.add('highlight');
                setTimeout(function () { target.classList.remove('highlight'); }, 2200);
            });
        });
    }

    /* ------------------------------------------------------------------
       Hover cards
       ------------------------------------------------------------------ */

    var card = null;
    var cardFor = null;
    var showTimer = null;
    var hideTimer = null;

    function removeCard() {
        if (card) card.remove();
        card = null;
        cardFor = null;
    }

    function scheduleHide() {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
        hideTimer = setTimeout(removeCard, 220);
    }

    function place(node, anchor) {
        var r = anchor.getBoundingClientRect();
        var vw = document.documentElement.clientWidth;
        var left = Math.max(12, Math.min(r.left - 20, vw - node.offsetWidth - 12));
        var top = r.bottom + 10;
        if (top + node.offsetHeight > window.innerHeight - 12 && r.top > node.offsetHeight + 22) {
            top = r.top - node.offsetHeight - 10;
        }
        node.style.left = (left + window.scrollX) + 'px';
        node.style.top = (top + window.scrollY) + 'px';
    }

    function showCard(anchor, node) {
        removeCard();
        card = node;
        cardFor = anchor;
        card.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
        card.addEventListener('mouseleave', scheduleHide);
        document.body.appendChild(card);
        place(card, anchor);
    }

    function hoverable(anchor, delay, build) {
        anchor.addEventListener('mouseenter', function () {
            clearTimeout(hideTimer);
            clearTimeout(showTimer);
            if (cardFor === anchor) return;
            showTimer = setTimeout(function () {
                Promise.resolve(build()).then(function (node) {
                    if (node) showCard(anchor, node);
                }).catch(function () {});
            }, delay);
        });
        anchor.addEventListener('mouseleave', scheduleHide);
        anchor.addEventListener('focus', function () {
            Promise.resolve(build()).then(function (node) { if (node) showCard(anchor, node); }).catch(function () {});
        });
        anchor.addEventListener('blur', scheduleHide);
    }

    var wikiCache = {};

    function wikiSummary(title) {
        if (!wikiCache[title]) {
            wikiCache[title] = fetch('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title))
                .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); });
            wikiCache[title].catch(function () { delete wikiCache[title]; });
        }
        return wikiCache[title];
    }

    function previewCard(data, source) {
        var node = el('div', { 'class': 'hovercard preview', role: 'tooltip' });
        if (data.thumb) {
            var thumb = el('div', { 'class': 'card-thumb' + (data.contain ? ' contain' : '') });
            thumb.style.backgroundImage = 'url("' + String(data.thumb).replace(/"/g, '%22') + '")';
            node.appendChild(thumb);
        }
        var body = el('div', { 'class': 'card-body' });
        body.appendChild(el('span', { 'class': 'card-title', text: data.title }));
        body.appendChild(el('p', { 'class': 'card-extract', text: data.extract }));
        node.appendChild(body);
        node.appendChild(el('div', { 'class': 'card-foot', text: source }));
        return node;
    }

    function initHoverCards() {
        if (!canHover) return;

        $all('sup.ref a').forEach(function (a) {
            hoverable(a, 120, function () {
                var target = document.getElementById(a.getAttribute('href').slice(1));
                var cite = target && $('cite', target);
                if (!cite) return null;
                var node = el('div', { 'class': 'hovercard ref-card', role: 'tooltip' });
                node.appendChild(el('span', { 'class': 'card-kicker', text: 'Source ' + a.textContent }));
                node.appendChild(cite.cloneNode(true));
                return node;
            });
        });

        $all('.prose :is(p, li, dd) a:not([class])').forEach(function (a) {
            if (a.closest('.references, sup.ref')) return;
            var href = a.getAttribute('href') || '';
            var wiki = href.match(/^https:\/\/en\.wikipedia\.org\/wiki\/([^#?]+)$/);
            if (wiki) {
                hoverable(a, 450, function () {
                    return wikiSummary(decodeURIComponent(wiki[1])).then(function (d) {
                        if (!d.extract) return null;
                        return previewCard({ title: d.title, extract: d.extract, thumb: d.thumbnail && d.thumbnail.source }, 'From Wikipedia');
                    });
                });
            } else if (PAGES[href] && href !== here) {
                hoverable(a, 350, function () { return previewCard(PAGES[href], 'Article on this site'); });
            }
        });
    }

    /* ------------------------------------------------------------------
       Search palette
       ------------------------------------------------------------------ */

    function initPalette() {
        var palette = $('#palette');
        if (!palette) return;
        var input = $('input', palette);
        var results = $('.palette-results', palette);
        var lastFocus = null;
        var selected = 0;
        var items = [];

        var entries = [];
        Object.keys(PAGES).forEach(function (url) {
            var p = PAGES[url];
            entries.push({ title: p.title, desc: p.desc, url: url, icon: 'i-doc', keywords: p.extract });
        });
        SECTIONS.forEach(function (s) {
            entries.push({ title: s.title, desc: 'Section · ' + PAGES[s.page].title, url: s.page + '#' + s.id, icon: 'i-hash', keywords: s.keywords });
        });
        ACTIONS.forEach(function (a) { entries.push(a); });

        function score(e, q) {
            var t = e.title.toLowerCase();
            if (t.indexOf(q) === 0) return 3;
            if (t.indexOf(q) !== -1) return 2;
            var hay = (t + ' ' + (e.desc || '') + ' ' + (e.keywords || '')).toLowerCase();
            return q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; }) ? 1 : 0;
        }

        function mark(title, q) {
            var i = q ? title.toLowerCase().indexOf(q) : -1;
            if (i === -1) return escapeHtml(title);
            return escapeHtml(title.slice(0, i)) + '<mark>' + escapeHtml(title.slice(i, i + q.length)) + '</mark>' + escapeHtml(title.slice(i + q.length));
        }

        function render() {
            var q = input.value.trim().toLowerCase();
            items = q
                ? entries.map(function (e, i) { return { e: e, s: score(e, q), i: i }; })
                    .filter(function (m) { return m.s > 0; })
                    .sort(function (a, b) { return b.s - a.s || a.i - b.i; })
                    .map(function (m) { return m.e; })
                    .slice(0, 8)
                : entries.filter(function (e) { return e.icon === 'i-doc' || e.icon === 'i-calendar' || e.icon === 'i-mail' || e.icon === 'i-file'; });
            results.innerHTML = '';
            if (!items.length) {
                results.appendChild(el('li', { 'class': 'palette-empty', text: 'Nothing matches “' + input.value.trim() + '”.' }));
                return;
            }
            items.forEach(function (e, i) {
                var a = el('a', { href: e.url, html: '<span class="p-icon">' + icon(e.icon) + '</span><span><span class="p-title">' + mark(e.title, q) + '</span><span class="p-desc">' + escapeHtml(e.desc || '') + '</span></span>' });
                results.appendChild(el('li', { role: 'option', id: 'p-opt-' + i, 'aria-selected': i === 0 ? 'true' : 'false' }, [a]));
            });
            selected = 0;
        }

        function select(i) {
            var opts = $all('li[role="option"]', results);
            if (!opts.length) return;
            selected = (i + opts.length) % opts.length;
            opts.forEach(function (o, j) { o.setAttribute('aria-selected', j === selected ? 'true' : 'false'); });
            opts[selected].scrollIntoView({ block: 'nearest' });
            input.setAttribute('aria-activedescendant', opts[selected].id);
        }

        function open() {
            lastFocus = document.activeElement;
            palette.hidden = false;
            input.value = '';
            render();
            input.focus();
        }

        function close() {
            palette.hidden = true;
            if (lastFocus && lastFocus.focus) lastFocus.focus();
        }

        $all('.search-trigger').forEach(function (b) { b.addEventListener('click', open); });
        palette.addEventListener('click', function (e) { if (e.target === palette) close(); });
        input.addEventListener('input', render);
        input.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); select(selected + 1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); select(selected - 1); }
            else if (e.key === 'Enter') {
                e.preventDefault();
                var item = items[selected];
                if (!item) return;
                close();
                location.href = item.url;
            }
        });
        results.addEventListener('click', function (e) { if (e.target.closest('a')) palette.hidden = true; });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !palette.hidden) { close(); return; }
            var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '');
            if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
                e.preventDefault();
                if (palette.hidden) open(); else close();
            }
        });

        var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
        $all('.search-trigger kbd').forEach(function (k) { k.textContent = isMac ? '⌘K' : 'Ctrl K'; });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initHeader();
        initFootnotes();
        initToc();
        initHoverCards();
        initPalette();
    });
})();
