function assertFiniteNumber(value, name) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
}

function assertPositiveInteger(value, name) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer.`);
  }
}

function evaluateX2({ k, x }) {
  return k * x * x;
}

export function exactIntegralX2({ k, a, b }) {
  assertFiniteNumber(k, "k");
  assertFiniteNumber(a, "a");
  assertFiniteNumber(b, "b");
  if (b < a) {
    throw new RangeError("b must be >= a.");
  }
  return (k / 3) * (b ** 3 - a ** 3);
}

export function computeRiemannSum({ k, n, method = "left", a = 0, b = 2 }) {
  assertFiniteNumber(k, "k");
  assertFiniteNumber(a, "a");
  assertFiniteNumber(b, "b");
  assertPositiveInteger(n, "n");
  if (b <= a) {
    throw new RangeError("b must be greater than a.");
  }
  if (!["left", "right", "midpoint"].includes(method)) {
    throw new RangeError("method must be left, right, or midpoint.");
  }

  const dx = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i += 1) {
    const x =
      method === "left"
        ? a + i * dx
        : method === "right"
          ? a + (i + 1) * dx
          : a + (i + 0.5) * dx;
    sum += evaluateX2({ k, x }) * dx;
  }
  return sum;
}

