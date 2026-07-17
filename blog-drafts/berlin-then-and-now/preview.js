const bodyRoot = document.querySelector('#article-body');

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderInline(value) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function localImagePath(path) {
  return path.replace('blog-drafts/berlin-then-and-now/', '');
}

function markdownToHtml(markdown, summary) {
  const lines = markdown.split('\n');
  const html = [];
  let listType = null;
  let paragraph = [];
  let figureOpen = false;
  let rawAside = false;

  const closeParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (rawAside) {
      html.push(line);
      if (trimmed === '</aside>') rawAside = false;
      continue;
    }

    if (trimmed.startsWith('<aside')) {
      closeParagraph();
      closeList();
      html.push(line);
      rawAside = true;
      continue;
    }

    if (!trimmed) {
      closeParagraph();
      closeList();
      continue;
    }

    if (trimmed === '{{quick-summary}}') {
      closeParagraph();
      closeList();
      html.push(`<section class="quick-summary"><h2>${escapeHtml(summary.title)}</h2><dl>${summary.items.map((item) => `<div><dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.text)}</dd></div>`).join('')}</dl></section>`);
      continue;
    }

    if (trimmed === '{{widget:mehringplatz-time-layer-viewer}}') {
      closeParagraph();
      closeList();
      html.push('<iframe class="widget-frame" title="Mehringplatz Time-Layer Viewer" src="../../mehringplatz-time-layer-viewer/index.html" loading="lazy"></iframe>');
      continue;
    }

    const image = trimmed.match(/^!\[(.+?)\]\((.+?)\)$/);
    if (image) {
      closeParagraph();
      closeList();
      if (figureOpen) html.push('</figure>');
      html.push(`<figure><img src="${escapeHtml(localImagePath(image[2]))}" alt="${escapeHtml(image[1])}" loading="lazy">`);
      figureOpen = true;
      continue;
    }

    const caption = trimmed.match(/^_(.+)_$/);
    if (caption && figureOpen) {
      html.push(`<figcaption>${renderInline(caption[1])}</figcaption></figure>`);
      figureOpen = false;
      continue;
    }

    const heading = trimmed.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeList();
      if (figureOpen) {
        html.push('</figure>');
        figureOpen = false;
      }
      const level = heading[1].length;
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    const ordered = trimmed.match(/^\d+\.\s+(.+)$/);
    const unordered = trimmed.match(/^-\s+(.+)$/);
    if (ordered || unordered) {
      closeParagraph();
      const nextType = ordered ? 'ol' : 'ul';
      if (listType !== nextType) {
        closeList();
        listType = nextType;
        html.push(`<${listType}>`);
      }
      html.push(`<li>${renderInline((ordered || unordered)[1])}</li>`);
      continue;
    }

    paragraph.push(trimmed);
  }

  closeParagraph();
  closeList();
  if (figureOpen) html.push('</figure>');
  return html.join('\n');
}

async function renderPreview() {
  try {
    const [bodyResponse, summaryResponse, seoResponse] = await Promise.all([
      fetch('berlin-then-and-now.body.md'),
      fetch('quick-summary.json'),
      fetch('seo.json')
    ]);
    if (!bodyResponse.ok || !summaryResponse.ok || !seoResponse.ok) throw new Error('A preview source file could not be loaded.');
    const [body, summary, seo] = await Promise.all([
      bodyResponse.text(),
      summaryResponse.json(),
      seoResponse.json()
    ]);
    document.querySelector('#article-title').textContent = seo.title;
    document.querySelector('#article-excerpt').textContent = seo.excerpt;
    bodyRoot.innerHTML = markdownToHtml(body, summary);
    bodyRoot.setAttribute('aria-busy', 'false');
  } catch (error) {
    bodyRoot.innerHTML = `<p class="load-error"><strong>Preview error:</strong> ${escapeHtml(error.message)} Serve the berlinwalk-widgets directory over HTTP; file:// cannot load the package sources.</p>`;
    bodyRoot.setAttribute('aria-busy', 'false');
  }
}

window.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'bw:mehringplatz-resize') return;
  const frame = document.querySelector('.widget-frame');
  if (!frame || event.source !== frame.contentWindow) return;
  const height = Number(event.data.height);
  const currentHeight = Number.parseFloat(getComputedStyle(frame).height);
  if (Number.isFinite(height) && height > 400 && height < 5000 && Math.abs(currentHeight - height) >= 3) frame.style.height = `${height}px`;
});

renderPreview();
