function assertFiniteNumber(value, name) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
}

export function evaluateQuadratic({ k, x }) {
  assertFiniteNumber(k, "k");
  assertFiniteNumber(x, "x");
  return k * x * x;
}

export function computeSecantSlope({ k, a, dx }) {
  assertFiniteNumber(k, "k");
  assertFiniteNumber(a, "a");
  assertFiniteNumber(dx, "dx");
  if (dx === 0) {
    throw new RangeError("dx must not be 0.");
  }
  const y0 = evaluateQuadratic({ k, x: a });
  const y1 = evaluateQuadratic({ k, x: a + dx });
  return (y1 - y0) / dx;
}

export function computeTangentSlope({ k, a }) {
  assertFiniteNumber(k, "k");
  assertFiniteNumber(a, "a");
  const slope = 2 * k * a;
  return Object.is(slope, -0) ? 0 : slope;
}
