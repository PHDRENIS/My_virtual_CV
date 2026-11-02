export interface Box2 {
  cx: number;
  cz: number;
  hx: number;
  hz: number;
}

export function collideCircle(
  p: { x: number; z: number },
  r: number,
  boxes: Box2[],
): void {
  for (const b of boxes) {
    const nx = Math.max(b.cx - b.hx, Math.min(p.x, b.cx + b.hx));
    const nz = Math.max(b.cz - b.hz, Math.min(p.z, b.cz + b.hz));
    const dx = p.x - nx;
    const dz = p.z - nz;
    const d2 = dx * dx + dz * dz;
    if (d2 < r * r) {
      if (d2 > 1e-9) {
        const d = Math.sqrt(d2);
        p.x = nx + (dx / d) * r;
        p.z = nz + (dz / d) * r;
      } else {
        const px = b.hx + r - Math.abs(p.x - b.cx);
        const pz = b.hz + r - Math.abs(p.z - b.cz);
        if (px < pz) {
          p.x = b.cx + (Math.sign(p.x - b.cx) || 1) * (b.hx + r);
        } else {
          p.z = b.cz + (Math.sign(p.z - b.cz) || 1) * (b.hz + r);
        }
      }
    }
  }
}
