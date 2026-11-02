import type { Box2 } from "./collisions";
import type { SectionId } from "@/content/sections";

export const ROOM = { width: 24, depth: 15, height: 4.6 };

export const WALLS: Box2[] = [
  { cx: 0, cz: -ROOM.depth / 2 - 0.3, hx: ROOM.width / 2 + 1, hz: 0.3 },
  { cx: 0, cz: ROOM.depth / 2 + 0.3, hx: ROOM.width / 2 + 1, hz: 0.3 },
  { cx: -ROOM.width / 2 - 0.3, cz: 0, hx: 0.3, hz: ROOM.depth / 2 + 1 },
  { cx: ROOM.width / 2 + 0.3, cz: 0, hx: 0.3, hz: ROOM.depth / 2 + 1 },
];

export interface PaintingSpot {
  x: number;
  y: number;
  z: number;
  /** Orientación del cuadro (radianes, rotación Y). 0 = mirando a +Z. */
  rotY: number;
}

export const PAINTING_SPOTS: Record<SectionId, PaintingSpot> = {
  skills: { x: -ROOM.width / 2 + 0.2, y: 2.1, z: -4.2, rotY: Math.PI / 2 },
  "soft-skills": { x: -ROOM.width / 2 + 0.2, y: 2.1, z: 4.2, rotY: Math.PI / 2 },
  resume: { x: 0, y: 2.1, z: -ROOM.depth / 2 + 0.2, rotY: 0 },
  projects: { x: ROOM.width / 2 - 0.2, y: 2.1, z: -4.4, rotY: -Math.PI / 2 },
  contact: { x: ROOM.width / 2 - 0.2, y: 2.1, z: 3.4, rotY: -Math.PI / 2 },
};

export const PLAYER_START = { x: 0, y: 1.6, z: 5.2 };

export interface FurnitureItem {
  model: string;
  position: [number, number, number];
  rotY?: number;
  scale?: number;
  offset?: [number, number, number];
  color?: string;
}

export const COLORS = {
  white: "#f4f2ec",
  oak: "#e6cfa8",
  mint: "#b7d6c2",
  black: "#26262a",
  rug: "#e9e5dc",
};

export const FURNITURE: FurnitureItem[] = [
  { model: "/models/rugRectangle.glb", position: [0, 0.005, 1.0], offset: [-0.785, 0, 0.46], color: COLORS.rug },
  { model: "/models/desk.glb", position: [0, 0, 1.0], offset: [-0.357, 0, 0.184], color: COLORS.white },
  { model: "/models/chairDesk.glb", position: [0, 0, 2.35], rotY: Math.PI, offset: [-0.1675, 0, 0.157], color: COLORS.mint },
  { model: "/models/computerScreen.glb", position: [0, 0.845, 0.75], rotY: Math.PI, offset: [-0.1965, 0, 0.052], color: COLORS.black },
  { model: "/models/computerKeyboard.glb", position: [0, 0.845, 1.35], rotY: Math.PI, offset: [-0.141, 0, 0.059], color: COLORS.white },
  { model: "/models/computerMouse.glb", position: [0.5, 0.845, 1.35], offset: [0, 0, 0.0425], color: COLORS.white },
  { model: "/models/lampRoundTable.glb", position: [-0.65, 0.845, 0.8], offset: [-0.06, 0, 0.06], color: COLORS.black },
  { model: "/models/bookcaseOpen.glb", position: [-11.7, 0, -1.5], rotY: Math.PI / 2, offset: [-0.2, 0, 0.125], color: COLORS.white },
  { model: "/models/sideTableDrawers.glb", position: [11.7, 0, -1.5], rotY: -Math.PI / 2, offset: [-0.257, 0, 0.099], color: COLORS.oak },
  { model: "/models/books.glb", position: [11.7, 0.845, -1.9], rotY: 0.3, offset: [-0.075, 0, 0.0475] },
  { model: "/models/plantSmall1.glb", position: [11.7, 0.845, -1.1] },
  { model: "/models/pottedPlant.glb", position: [-11.2, 0, -6.6] },
  { model: "/models/lampSquareFloor.glb", position: [-10.3, 0, 6.6], offset: [-0.06, 0, 0.06], color: COLORS.black },
  { model: "/models/trashcan.glb", position: [1.35, 0, 0.5], scale: 1.5, offset: [0, 0, -0.005], color: COLORS.white },
  { model: "/models/loungeChair.glb", position: [9.5, 0, -5.8], rotY: -2.35, offset: [-0.245, 0, 0.205], color: COLORS.mint },
  { model: "/models/sideTable.glb", position: [10.9, 0, -5.0], offset: [-0.257, 0, 0.1], color: COLORS.oak },
  { model: "/models/books.glb", position: [10.9, 0.845, -5.0], offset: [-0.075, 0, 0.0475] },
  { model: "/models/loungeSofa.glb", position: [-5.5, 0, 6.4], rotY: Math.PI, offset: [-0.49, 0, 0.205], color: COLORS.mint },
  { model: "/models/tableRound.glb", position: [-7.8, 0.594, 6.5], offset: [-0.3465, 0, 0.4], color: COLORS.oak },
  { model: "/models/pottedPlant.glb", position: [-2.6, 0, 6.7] },
  { model: "/models/radio.glb", position: [11.7, 0.845, -1.5], rotY: -Math.PI / 2, offset: [-0.1575, 0, 0.049] },
  { model: "/models/plantSmall2.glb", position: [0.75, 0.845, 0.8] },
  { model: "/models/pillowBlue.glb", position: [-6.3, 0.45, 6.05], rotY: Math.PI + 0.2, offset: [-0.115, 0, 0.0315] },
  { model: "/models/pillowBlue.glb", position: [-0.6, 0.45, 6.9], rotY: 0.2, offset: [-0.115, 0, 0.0315] },
  { model: "/models/pillowBlue.glb", position: [0.7, 0.45, 6.95], rotY: -0.15, offset: [-0.115, 0, 0.0315] },
  { model: "/models/rugRound.glb", position: [9.5, 0.005, -5.5], offset: [-0.46, 0, 0.46], color: COLORS.rug },
  { model: "/models/coatRackStanding.glb", position: [8.5, 0, 6.9] },
  { model: "/models/cardboardBoxClosed.glb", position: [10.9, 0, 6.6] },
  { model: "/models/cardboardBoxClosed.glb", position: [10.9, 0.618, 6.6], rotY: 0.45 },
  { model: "/models/cardboardBoxOpen.glb", position: [9.9, 0, 7.0], rotY: -0.3, offset: [-0.106, 0, 0.106] },
];

export const FURNITURE_COLLIDERS: Box2[] = [
  { cx: 0, cz: 1.0, hx: 0.82, hz: 0.45 },
  { cx: 0, cz: 2.35, hx: 0.38, hz: 0.36 },
  { cx: -11.7, cz: -1.5, hx: 0.32, hz: 1.0 },
  { cx: 11.7, cz: -1.5, hx: 0.32, hz: 0.62 },
  { cx: -11.2, cz: -6.6, hx: 0.26, hz: 0.28 },
  { cx: -10.3, cz: 6.6, hx: 0.16, hz: 0.16 },
  { cx: 1.35, cz: 0.5, hx: 0.18, hz: 0.18 },
  { cx: 9.5, cz: -5.8, hx: 0.55, hz: 0.47 },
  { cx: 10.9, cz: -5.0, hx: 0.32, hz: 0.26 },
  { cx: -5.5, cz: 6.4, hx: 1.1, hz: 0.5 },
  { cx: -7.8, cz: 6.5, hx: 0.75, hz: 0.85 },
  { cx: -2.6, cz: 6.7, hx: 0.26, hz: 0.28 },
  { cx: -3.4, cz: 4.6, hx: 0.58, hz: 0.58 },
  { cx: 0, cz: 6.95, hx: 1.6, hz: 0.4 },
  { cx: 8.5, cz: 6.9, hx: 0.16, hz: 0.16 },
  { cx: 10.5, cz: 6.8, hx: 1.1, hz: 0.75 },
];

export const COLLIDERS: Box2[] = [...WALLS, ...FURNITURE_COLLIDERS];
