(() => {
  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, maxWidth, maxLines = 2) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean);
    const lines = [];
    let line = '';

    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (!line || ctx.measureText(candidate).width <= maxWidth) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    });
    if (line) lines.push(line);

    if (lines.length > maxLines) {
      const visible = lines.slice(0, maxLines);
      let last = visible[maxLines - 1];
      while (last && ctx.measureText(`${last}...`).width > maxWidth) {
        last = last.replace(/\s+\S+$/, '');
      }
      visible[maxLines - 1] = `${last || ''}...`;
      return visible;
    }
    return lines;
  }

  function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
    const lines = wrapText(ctx, text, maxWidth, maxLines);
    lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
    return lines.length;
  }

  function drawCoverImage(ctx, image, x, y, width, height) {
    if (!image || !image.naturalWidth || !image.naturalHeight) return false;
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const sourceWidth = width / scale;
    const sourceHeight = height / scale;
    const sourceX = (image.naturalWidth - sourceWidth) / 2;
    const sourceY = (image.naturalHeight - sourceHeight) / 2;

    ctx.save();
    roundedRect(ctx, x, y, width, height, 20);
    ctx.clip();
    ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
    const gradient = ctx.createLinearGradient(x, y, x + width, y);
    gradient.addColorStop(0, 'rgba(6, 56, 26, 0.2)');
    gradient.addColorStop(0.58, 'rgba(6, 56, 26, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);
    ctx.restore();
    return true;
  }

  function createCard({
    width = 1080,
    height = 1350,
    title = 'BerlinWalk Game',
    subtitle = 'Daily result',
    score = '',
    meta = '',
    lines = [],
    footer = 'berlinwalk.com/games',
    cta = 'Play the next Berlin set tomorrow',
    image = null,
    palette = {},
  } = {}) {
    const colors = {
      background: palette.background || '#FAFAF5',
      panel: palette.panel || '#FFFFFF',
      ink: palette.ink || '#212121',
      muted: palette.muted || '#4E5A4E',
      green: palette.green || '#1B5E20',
      yellow: palette.yellow || '#FFE600',
      lime: palette.lime || '#7CB342',
    };

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(27, 94, 32, 0.14)';
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    ctx.fillStyle = colors.yellow;
    ctx.fillRect(0, 0, width * 0.62, 18);

    roundedRect(ctx, 64, 84, width - 128, height - 168, 36);
    ctx.fillStyle = colors.panel;
    ctx.shadowColor = 'rgba(18, 63, 22, 0.14)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = colors.green;
    ctx.font = '900 42px Montserrat, Arial, sans-serif';
    ctx.fillText(title, 112, 166);

    ctx.fillStyle = colors.muted;
    ctx.font = '700 28px Montserrat, Arial, sans-serif';
    drawWrappedText(ctx, subtitle, 112, 212, width - 224, 33, 2);

    const hasImage = drawCoverImage(ctx, image, 112, 274, width - 224, 365);
    const scoreY = hasImage ? 748 : 380;
    const metaY = hasImage ? 798 : 430;
    const reasonsStartY = hasImage ? 878 : 530;
    const reasonHeight = hasImage ? 76 : 82;
    const reasonGap = hasImage ? 88 : 98;

    ctx.fillStyle = colors.green;
    ctx.font = `900 ${hasImage ? 88 : 118}px "IBM Plex Mono", monospace`;
    ctx.fillText(String(score || ''), 112, scoreY);

    ctx.fillStyle = colors.muted;
    ctx.font = '800 26px Montserrat, Arial, sans-serif';
    drawWrappedText(ctx, meta, 112, metaY, width - 224, 31, 2);

    let y = reasonsStartY;
    lines.slice(0, 3).forEach((line, index) => {
      roundedRect(ctx, 112, y - 38, width - 224, reasonHeight, 18);
      ctx.fillStyle = index % 2 === 0 ? 'rgba(124, 179, 66, 0.11)' : 'rgba(255, 230, 0, 0.12)';
      ctx.fill();
      ctx.fillStyle = colors.green;
      ctx.font = `900 ${hasImage ? 21 : 24}px Montserrat, Arial, sans-serif`;
      drawWrappedText(ctx, line, 140, y - (hasImage ? 4 : 2), width - 280, hasImage ? 25 : 29, 2);
      y += reasonGap;
    });

    ctx.fillStyle = colors.green;
    ctx.font = '900 34px Montserrat, Arial, sans-serif';
    drawWrappedText(ctx, cta, 112, height - 160, width - 224, 40, 2);

    ctx.fillStyle = colors.muted;
    ctx.font = '800 26px Montserrat, Arial, sans-serif';
    ctx.fillText(footer, 112, height - 110);

    return canvas;
  }

  function download(canvas, filename = 'berlinwalk-share-card.png') {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
  }

  window.BerlinWalkShareCard = {
    createCard,
    download,
  };
})();
