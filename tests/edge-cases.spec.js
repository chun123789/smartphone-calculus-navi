import {
  computeSecantSlope,
  computeTangentSlope,
  computeRiemannSum,
  exactIntegralX2
} from "../src/js/calc/index.js";

describe("edge cases and invalid inputs", () => {
  test("derivative functions reject non-finite numbers", () => {
    expect(() => computeSecantSlope({ k: Number.NaN, a: 1, dx: 0.1 })).toThrow(TypeError);
    expect(() => computeSecantSlope({ k: 1, a: Infinity, dx: 0.1 })).toThrow(TypeError);
    expect(() => computeTangentSlope({ k: 1, a: Number.NaN })).toThrow(TypeError);
  });

  test("integral functions reject invalid n and interval", () => {
    expect(() => computeRiemannSum({ k: 1, n: 0 })).toThrow(RangeError);
    expect(() => computeRiemannSum({ k: 1, n: 4.2 })).toThrow(RangeError);
    expect(() => computeRiemannSum({ k: 1, n: 4, a: 2, b: 1 })).toThrow(RangeError);
    expect(() => computeRiemannSum({ k: 1, n: 4, method: "bad" })).toThrow(RangeError);
  });

  test("exact integral validates inputs", () => {
    expect(() => exactIntegralX2({ k: 1, a: 3, b: 2 })).toThrow(RangeError);
    expect(() => exactIntegralX2({ k: Number.NaN, a: 0, b: 2 })).toThrow(TypeError);
  });
});

