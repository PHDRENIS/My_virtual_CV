export type QualityTier = "low" | "medium" | "high";

export async function detectInitialTier(): Promise<QualityTier> {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 8;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  try {
    const { getGPUTier } = await import("detect-gpu");
    const gpu = await getGPUTier();
    if (gpu.tier >= 3) return coarse ? "medium" : "high";
    if (gpu.tier >= 2) return "medium";
    return "low";
  } catch {
    if (cores <= 2 || mem <= 2) return "low";
    if (cores <= 4 || mem <= 4 || coarse) return "medium";
    return "high";
  }
}
