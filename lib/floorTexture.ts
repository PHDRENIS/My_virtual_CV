import * as THREE from "three";

export function makeFloorTexture(): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  const rows = 8;
  const rowHeight = size / rows;
  const tones = ["#ead9bd", "#e5d2b4", "#eedcbf", "#e2ceac"];

  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let row = 0; row < rows; row++) {
    let x = -rand() * 300;
    while (x < size) {
      const w = 220 + rand() * 260;
      ctx.fillStyle = tones[Math.floor(rand() * tones.length)];
      ctx.fillRect(x, row * rowHeight, w, rowHeight);
      ctx.strokeStyle = "rgba(120, 90, 55, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, row * rowHeight, w, rowHeight);
      for (let g = 0; g < 5; g++) {
        ctx.strokeStyle = `rgba(150, 115, 70, ${0.04 + rand() * 0.05})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const gy = row * rowHeight + rand() * rowHeight;
        ctx.moveTo(x + 8, gy);
        ctx.lineTo(x + w - 8, gy + (rand() - 0.5) * 6);
        ctx.stroke();
      }
      x += w;
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
