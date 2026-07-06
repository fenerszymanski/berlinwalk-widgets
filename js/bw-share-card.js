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

  function createCard({
    width = 1080,
    height = 1350,
    title = 'BerlinWalk Game',
    subtitle = 'Daily result',
    score = '',
    meta = '',
    lines = [],
    footer = 'berlinwalk.com/games',
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
    ctx.fillText(title, 112, 180);

    ctx.fillStyle = colors.muted;
    ctx.font = '700 28px Montserrat, Arial, sans-serif';
    ctx.fillText(subtitle, 112, 226);

    ctx.fillStyle = colors.green;
    ctx.font = '900 118px "IBM Plex Mono", monospace';
    ctx.fillText(String(score || ''), 112, 380);

    ctx.fillStyle = colors.muted;
    ctx.font = '800 26px Montserrat, Arial, sans-serif';
    ctx.fillText(meta, 112, 430);

    ctx.fillStyle = colors.green;
    ctx.font = '900 26px Montserrat, Arial, sans-serif';
    let y = 530;
    lines.forEach((line, index) => {
      roundedRect(ctx, 112, y - 42, width - 224, 74, 18);
      ctx.fillStyle = index % 2 === 0 ? 'rgba(124, 179, 66, 0.11)' : 'rgba(255, 230, 0, 0.12)';
      ctx.fill();
      ctx.fillStyle = colors.green;
      ctx.fillText(String(line), 140, y);
      y += 94;
    });

    ctx.fillStyle = colors.green;
    ctx.font = '900 34px Montserrat, Arial, sans-serif';
    ctx.fillText('Play the next Berlin set tomorrow', 112, height - 160);

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
