// /d:/ai_code/dashboard/src/gearbox.ts

/**
 * Compute speeds per gear scaled so the gear with the smallest positive ratio
 * corresponds to maxSpeed (default 329).
 *
 * Usage:
 *   const ratios = [3.133, 2.588, 1.880, 1.140, 0.898, 0.884, 0.653];
 *   const speeds = computeGearSpeeds(ratios); // speeds indexed 1..7
 */

export type GearSpeeds = Array<number | null>;

/**
 * Compute speed for a single gear given the smallest-ratio reference.
 */
export function computeGearSpeedForRatio(
  ratio: number | null,
  minPositiveRatio: number,
  maxSpeed = 329,
): number | null {
  if (ratio == null || ratio <= 0) return null;
  return +(maxSpeed * (minPositiveRatio / ratio));
}

/**
 * Compute speeds for all gears.
 * ratios: array of length N with numbers or null for missing gears (use 1-based gear indexing in results)
 * returns array of length N where index 0 -> gear 1, etc.
 */
export function computeGearSpeeds(ratios: Array<number | null>, maxSpeed = 329): GearSpeeds {
  const positive = ratios.filter((r): r is number => r != null && r > 0);
  if (positive.length === 0) return ratios.map(() => null);
  const minPositive = Math.min(...positive);
  return ratios.map((r) => (r == null || r <= 0 ? null : +(maxSpeed * (minPositive / r))));
}

export const crankSpeedToWheelSpeed = 0.06297856049004594180704;

/* Default ratios from prompt */
export const defaultRatios: Array<number | null> = [
  3.133, // 1
  2.588, // 2
  1.88, // 3
  1.14, // 4
  0.898, // 5
  0.884, // 6
  0.653, // 7
];

/* Example export: speeds for default ratios scaled to 329 */
export const defaultGearSpeeds = computeGearSpeeds(defaultRatios, 329);
