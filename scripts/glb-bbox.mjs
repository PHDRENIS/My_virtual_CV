import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "public/models";

function measure(path) {
  const buf = readFileSync(path);
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString("utf8"));

  function nodeMatrix(node, parent) {
    let m;
    if (node.matrix) {
      m = node.matrix.map((v) => v);
    } else {
      const t = node.translation || [0, 0, 0];
      const r = node.rotation || [0, 0, 0, 1];
      const s = node.scale || [1, 1, 1];
      const [x, y, z, w] = r;
      const x2 = x + x, y2 = y + y, z2 = z + z;
      const xx = x * x2, xy = x * y2, xz = x * z2;
      const yy = y * y2, yz = y * z2, zz = z * z2;
      const wx = w * x2, wy = w * y2, wz = w * z2;
      m = [
        (1 - (yy + zz)) * s[0], (xy + wz) * s[0], (xz - wy) * s[0], 0,
        (xy - wz) * s[1], (1 - (xx + zz)) * s[1], (yz + wx) * s[1], 0,
        (xz + wy) * s[2], (yz - wx) * s[2], (1 - (xx + yy)) * s[2], 0,
        t[0], t[1], t[2], 1,
      ];
    }
    return multiply(parent, m);
  }

  function multiply(a, b) {
    const out = new Array(16);
    for (let c = 0; c < 4; c++)
      for (let r = 0; r < 4; r++)
        out[c * 4 + r] =
          a[r * 4] * b[c * 4] + a[1 + r * 4] * b[1 + c * 4] +
          a[2 + r * 4] * b[2 + c * 4] + a[3 + r * 4] * b[3 + c * 4];
    return out;
  }

  function apply(m, p) {
    return [
      m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
      m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
      m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
    ];
  }

  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];

  function walk(node, parentM) {
    const m = nodeMatrix(node, parentM);
    if (node.mesh !== undefined) {
      for (const prim of json.meshes[node.mesh].primitives) {
        const acc = json.accessors[prim.attributes.POSITION];
        for (const corner of [
          [acc.min[0], acc.min[1], acc.min[2]], [acc.max[0], acc.max[1], acc.max[2]],
        ]) {
          const p = apply(m, corner);
          for (let i = 0; i < 3; i++) {
            min[i] = Math.min(min[i], p[i]);
            max[i] = Math.max(max[i], p[i]);
          }
        }
      }
    }
    for (const child of node.children || []) walk(json.nodes[child], m);
  }

  for (const scene of json.scenes) {
    for (const rootIndex of scene.nodes) walk(json.nodes[rootIndex], [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  }

  return {
    size: max.map((v, i) => +(v - min[i]).toFixed(3)),
    min: min.map((v) => +v.toFixed(3)),
    max: max.map((v) => +v.toFixed(3)),
  };
}

for (const file of readdirSync(dir).filter((f) => f.endsWith(".glb"))) {
  const r = measure(join(dir, file));
  console.log(
    `${file}: size ${r.size.join(" x ")} | minY ${r.min[2] === undefined ? "?" : r.min[1]} | yMin ${r.min[1]} yMax ${r.max[1]} | x ${r.min[0]}..${r.max[0]} | z ${r.min[2]}..${r.max[2]}`,
  );
}
