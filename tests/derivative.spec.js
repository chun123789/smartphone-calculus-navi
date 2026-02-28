import { computeSecantSlope, computeTangentSlope } from "../src/js/calc/index.js";

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

describe("derivative calculations", () => {
  test("randomized secant slope matches analytic form (>=200 cases)", () => {
    const cases = 240;
    for (let i = 0; i < cases; i += 1) {
      const k = randomInRange(-5, 5);
      const a = randomInRange(-10, 10);
      const dx = randomInRange(0.001, 3);
      const computed = computeSecantSlope({ k, a, dx });
      const exact = k * (2 * a + dx);
      expect(Math.abs(computed - exact)).toBeLessThan(1e-10);
    }
  });

  test("boundary values: k=0 and negative a", () => {
    expect(computeSecantSlope({ k: 0, a: -2, dx: 0.2 })).toBe(0);
    expect(computeTangentSlope({ k: 0, a: -2 })).toBe(0);
    expect(computeTangentSlope({ k: 3, a: -2 })).toBe(-12);
    expect(() => computeSecantSlope({ k: 2, a: 1, dx: 0 })).toThrow(RangeError);
  });

  test("secant converges to tangent as dx shrinks (>=200 checks)", () => {
    const checks = 220;
    for (let i = 0; i < checks; i += 1) {
      const k = randomInRange(-4, 4);
      const a = randomInRange(-6, 6);
      const secantLarge = computeSecantSlope({ k, a, dx: 0.2 });
      const secantSmall = computeSecantSlope({ k, a, dx: 0.0002 });
      const tangent = computeTangentSlope({ k, a });
      expect(Math.abs(secantSmall - tangent)).toBeLessThan(Math.abs(secantLarge - tangent));
    }
  });
});

