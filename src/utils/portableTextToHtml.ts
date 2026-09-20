
export function portableTextToHtml(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';
  
  return blocks.map(block => {
    // Handle regular text blocks
    if (block._type === 'block' && block.children) {
      const text = renderChildren(block.children);
      
      // Handle lists
      if (block.listItem === 'bullet') {
        return `<li>${text}</li>`;
      }
      if (block.listItem === 'number') {
        return `<li>${text}</li>`;
      }
      
      // Handle text styles
      switch (block.style) {
        case 'h1': return `<h1>${text}</h1>`;
        case 'h2': return `<h2>${text}</h2>`;
        case 'h3': return `<h3>${text}</h3>`;
        case 'h4': return `<h4>${text}</h4>`;
        case 'blockquote': return `<blockquote>${text}</blockquote>`;
        default: return `<p>${text}</p>`;
      }
    }
    
    // Handle images
    if (block._type === 'image') {
      const src = block.asset?.url || '';
      const alt = block.alt || 'Image';
      return `<figure><img src="${src}" alt="${alt}" /></figure>`;
    }
    
    // Handle code blocks
    if (block._type === 'code') {
      const code = block.code || '';
      const language = block.language || 'javascript';
      return `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
    }
    
    // Handle callouts
    if (block._type === 'callout') {
      const type = block.type || 'info';
      const title = block.title || '';
      const message = block.message || '';
      return `<div class="callout callout-${type}"><strong>${title}</strong><p>${message}</p></div>`;
    }
    
    // Handle dividers
    if (block._type === 'divider') {
      return '<hr />';
    }
    
    // Handle video embeds
    if (block._type === 'videoEmbed') {
      const url = block.url || '';
      const caption = block.caption || '';
      const embedUrl = convertToEmbedUrl(url);
      return `<figure><iframe src="${embedUrl}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
    }
    
    // Handle quote blocks
    if (block._type === 'quoteBlock') {
      const text = block.text || '';
      const author = block.author || '';
      return `<blockquote><p>${text}</p>${author ? `<footer>${author}</footer>` : ''}</blockquote>`;
    }
    
    // Handle highlights
    if (block._type === 'highlight') {
      const text = block.text || '';
      const color = block.color || 'yellow';
      return `<mark class="highlight-${color}">${text}</mark>`;
    }
    
    // Handle preview blocks
    if (block._type === 'previewBlock') {
      const title = block.title || '';
      const description = block.description || '';
      const content = block.previewContent || '';
      const bgType = block.bgType || 'light';
      return `<div class="preview-block preview-${bgType}"><h4>${title}</h4>${description ? `<p>${description}</p>` : ''}<div class="preview-content">${content}</div></div>`;
    }
    
    return '';
  }).join('\n');
}

function renderChildren(children: any[]): string {
  return children.map(child => {
    let text = child.text || '';
    
    // Escape HTML
    text = escapeHtml(text);
    
    // Apply marks
    if (child.marks) {
      if (child.marks.includes('strong')) text = `<strong>${text}</strong>`;
      if (child.marks.includes('em')) text = `<em>${text}</em>`;
      if (child.marks.includes('code')) text = `<code>${text}</code>`;
      if (child.marks.includes('underline')) text = `<u>${text}</u>`;
      if (child.marks.includes('strike-through')) text = `<s>${text}</s>`;
    }
    
    // Apply annotations (links)
    if (child.marks && child.marks.includes('link')) {
      const link = child.marks.find((m: any) => typeof m === 'object' && m._type === 'link');
      if (link?.href) {
        text = `<a href="${link.href}" target="_blank" rel="noopener">${text}</a>`;
      }
    }
    
    // Apply internal links
    if (child.marks && child.marks.includes('internalLink')) {
      const link = child.marks.find((m: any) => typeof m === 'object' && m._type === 'internalLink');
      if (link?.reference) {
        const slug = link.reference.slug?.current || '#';
        text = `<a href="/notes/${slug}">${text}</a>`;
      }
    }
    
    return text;
  }).join('');
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

function convertToEmbedUrl(url: string): string {
  // Convert YouTube URL to embed format
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Convert Vimeo URL to embed format
  if (url.includes('vimeo.com')) {
    const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
    if (videoId) return `https://player.vimeo.com/video/${videoId}`;
  }
  
  return url;
}
