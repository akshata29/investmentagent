// Minimal markdown to HTML converter tailored for our pitch content
export function markdownToHtml(md: string): string {
  const lines = (md || '').split(/\r?\n/);
  let html: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) { html.push('</ul>'); inUl = false; }
    if (inOl) { html.push('</ol>'); inOl = false; }
  };

  for (let raw of lines) {
    let line = raw;

    // Horizontal rule
    if (/^\s*---\s*$/.test(line)) {
      closeLists();
      html.push('<hr />');
      continue;
    }

    // Headings
    if (/^#\s+/.test(line)) {
      closeLists();
      html.push(`<h1>${escapeHtml(line.replace(/^#\s+/, ''))}</h1>`);
      continue;
    }
    if (/^##\s+/.test(line)) {
      closeLists();
      html.push(`<h2>${escapeHtml(line.replace(/^##\s+/, ''))}</h2>`);
      continue;
    }
    if (/^###\s+/.test(line)) {
      closeLists();
      html.push(`<h3>${escapeHtml(line.replace(/^###\s+/, ''))}</h3>`);
      continue;
    }

    // Ordered list item
    if (/^\d+\.\s+/.test(line)) {
      if (!inOl) { closeLists(); html.push('<ol>'); inOl = true; }
      const item = line.replace(/^\d+\.\s+/, '');
      html.push(`<li>${inlineMd(escapeHtml(item))}</li>`);
      continue;
    }

    // Unordered list item (supports •, -, *)
    if (/^(•|-|\*)\s+/.test(line)) {
      if (!inUl) { closeLists(); html.push('<ul>'); inUl = true; }
      const item = line.replace(/^(•|-|\*)\s+/, '');
      html.push(`<li>${inlineMd(escapeHtml(item))}</li>`);
      continue;
    }

    // Blank line
    if (/^\s*$/.test(line)) {
      closeLists();
      html.push('<br/>');
      continue;
    }

    // Paragraph
    closeLists();
    html.push(`<p>${inlineMd(escapeHtml(line))}</p>`);
  }

  closeLists();
  return html.join('\n');
}

function inlineMd(text: string): string {
  // Bold **text**
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic *text*
  text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  return text;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function exportHtmlToPdf(html: string, title = 'Client Pitch'): void {
  const w = window.open('', '_blank');
  if (!w) return;
  const css = `
    @page { margin: 24mm; }
  body { font-family: Arial, sans-serif; color: var(--text-primary); }
  h1 { color: var(--color-primary); border-bottom: 2px solid var(--color-primary); padding-bottom: 8px; }
  h2, h3 { color: var(--color-primary); }
    p { line-height: 1.6; }
    ul, ol { margin: 0 0 12px 24px; }
  hr { border: 0; border-top: 1px solid var(--border-primary); margin: 16px 0; }
  `;
  w.document.write(`<!doctype html><html><head><meta charset='utf-8'><title>${title}</title><style>${css}</style></head><body>${html}</body></html>`);
  w.document.close();
  // Defer print to allow rendering
  setTimeout(() => { w.print(); }, 200);
}
