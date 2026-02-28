import { computeRiemannSum, exactIntegralX2 } from "../src/js/calc/index.js";

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
}

function randomInteger(min, max) {
  return Math.floor(randomInRange(min, max + 1));
}

function leftClosedForm({ k, n }) {
  return (4 * k * (n - 1) * (2 * n - 1)) / (3 * n * n);
}

describe("integral calculations", () => {
  test("randomized riemann sum matches closed form (>=200 cases)", () => {
    const cases = 260;
    for (let i = 0; i < cases; i += 1) {
      const k = randomInRange(0.1, 6);
      const n = randomInteger(1, 400);
      const computed = computeRiemannSum({ k, n, method: "left", a: 0, b: 2 });
      const exactClosed = leftClosedForm({ k, n });
      expect(Math.abs(computed - exactClosed)).toBeLessThan(1e-9);
    }
  });

  test("boundary value n=1", () => {
    const k = 3;
    const computed = computeRiemannSum({ k, n: 1, method: "left", a: 0, b: 2 });
    expect(computed).toBe(0);
    const exact = exactIntegralX2({ k, a: 0, b: 2 });
    expect(exact).toBeCloseTo(8, 10);
  });

  test("left sums converge from below with O(1/n) error", () => {
    const checks = 220;
    for (let i = 0; i < checks; i += 1) {
      const k = randomInRange(0.1, 5);
      const n = randomInteger(10, 200);
      const s1 = computeRiemannSum({ k, n, method: "left", a: 0, b: 2 });
      const s2 = computeRiemannSum({ k, n: n * 2, method: "left", a: 0, b: 2 });
      const exact = exactIntegralX2({ k, a: 0, b: 2 });
      expect(s1).toBeLessThan(exact + 1e-10);
      expect(s2).toBeLessThan(exact + 1e-10);
      expect(s2).toBeGreaterThan(s1 - 1e-10);

      const error = Math.abs(exact - s1);
      const looseBound = (4 * k) / n;
      expect(error).toBeLessThan(looseBound + 1e-10);
    }
  });
});

