import * as THREE from "three";

export function makePaintingTexture(
  title: string,
  subtitle: string,
  color: string,
): THREE.CanvasTexture {
  const w = 512;
  const h = 600;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#07070d";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let i = 1; i < 8; i++) {
    const y = (h / 8) * i;
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(w - 20, y);
    ctx.stroke();
  }

  ctx.shadowColor = color;
  ctx.shadowBlur = 34;
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.strokeRect(18, 18, w - 36, h - 36);

  ctx.textAlign = "center";
  ctx.fillStyle = color;
  ctx.font = "bold 58px system-ui, sans-serif";

  const words = title.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > w - 100 && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  const startY = h / 2 - ((lines.length - 1) * 70) / 2 - 20;
  lines.forEach((l, i) => {
    ctx.fillText(l, w / 2, startY + i * 70);
  });

  ctx.shadowBlur = 12;
  ctx.fillStyle = "rgba(255,255,255,0.65)";
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillText(subtitle.toUpperCase(), w / 2, h - 70);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function makeLabelTexture(
  text: string,
  color: string,
): THREE.CanvasTexture {
  const w = 320;
  const h = 96;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 30px system-ui, sans-serif";
  ctx.shadowColor = color;
  ctx.shadowBlur = 16;
  ctx.fillStyle = color;
  ctx.fillText(text, w / 2, h / 2);
  ctx.fillText(text, w / 2, h / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export function makeMiniArtTexture(
  seed: number,
  accent: string,
): THREE.CanvasTexture {
  const w = 256;
  const h = 320;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#17171c";
  ctx.fillRect(0, 0, w, h);

  let s = seed * 9301 + 49297;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  ctx.strokeStyle = accent;
  ctx.lineWidth = 5;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(w * (0.3 + rand() * 0.4), h * (0.25 + rand() * 0.2), 34 + rand() * 20, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(w * 0.15, h * 0.6);
  ctx.lineTo(w * (0.4 + rand() * 0.2), h * (0.45 + rand() * 0.15));
  ctx.lineTo(w * 0.85, h * 0.7);
  ctx.stroke();

  ctx.fillStyle = accent;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(w * (0.2 + rand() * 0.6), h * (0.78 + rand() * 0.12), 4 + rand() * 4, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
