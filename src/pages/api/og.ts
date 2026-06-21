import type { APIRoute } from 'astro';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const clampText = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trim()}…`;
};

const wrapText = (value: string, maxLineLength: number, maxLines: number) => {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length > maxLineLength) {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = nextLine;
    }

    if (lines.length === maxLines) break;
  }

  if (currentLine && lines.length < maxLines) lines.push(currentLine);

  return lines.map((line, index) => {
    const isLastLine = index === maxLines - 1 && words.join(' ').length > lines.join(' ').length;
    return isLastLine ? clampText(line, maxLineLength) : line;
  });
};

export const GET: APIRoute = ({ url }) => {
  const title = clampText(url.searchParams.get('title') || 'Emmanuel Obiabo', 90);
  const description = clampText(
    url.searchParams.get('description') || 'Personal notes and thoughts from Emmanuel Obiabo.',
    180,
  );

  const titleLines = wrapText(title, 26, 3);
  const descriptionLines = wrapText(description, 70, 4);
  const titleStartY = titleLines.length > 2 ? 245 : 290;
  const descriptionStartY = titleStartY + titleLines.length * 74 + 58;

  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#f7f4ed"/>
      <rect x="40" y="40" width="1120" height="550" rx="28" fill="#ffffff"/>
      <text x="84" y="130" fill="#111111" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="700">Emmanuel Obiabo</text>
      <text x="84" y="220" fill="#666666" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="600" letter-spacing="9">NOTE</text>
      ${titleLines
        .map(
          (line, index) =>
            `<text x="84" y="${titleStartY + index * 74}" fill="#050505" font-family="Inter, Arial, sans-serif" font-size="68" font-weight="800">${escapeHtml(line)}</text>`,
        )
        .join('')}
      ${descriptionLines
        .map(
          (line, index) =>
            `<text x="84" y="${descriptionStartY + index * 40}" fill="#2f2f2f" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="400">${escapeHtml(line)}</text>`,
        )
        .join('')}
      <rect x="40" y="500" width="1120" height="90" fill="#183f30"/>
      <text x="84" y="555" fill="#d8eee3" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700">obiabo.com</text>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
