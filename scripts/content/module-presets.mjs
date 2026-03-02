export const MODULE_PRESETS = {
  "secant-tangent": {
    controls: [
      { id: "k", label: "係数 k", min: -2, max: 4, step: 0.1, default: 1 },
      { id: "a", label: "注目点 a", min: -2, max: 2, step: 0.1, default: 1 },
      { id: "dx", label: "差分 dx", min: 0.05, max: 2, step: 0.05, default: 0.8 }
    ]
  },
  "riemann-sum": {
    controls: [
      { id: "N", label: "分割数 N", min: 2, max: 120, step: 1, default: 16 },
      { id: "k", label: "係数 k", min: 0.5, max: 4, step: 0.1, default: 1 }
    ]
  },
  "tangent-line": {
    controls: [
      { id: "k", label: "係数 k", min: -2, max: 4, step: 0.1, default: 1 },
      { id: "a", label: "接点 a", min: -3, max: 3, step: 0.1, default: 1 }
    ]
  },
  "derivative-sign": {
    controls: [
      { id: "p", label: "パラメータ p", min: 0.2, max: 3, step: 0.1, default: 1.2 },
      { id: "x", label: "確認点 x", min: -3, max: 3, step: 0.1, default: 0 }
    ]
  },
  "signed-area": {
    controls: [
      { id: "k", label: "係数 k", min: -3, max: 3, step: 0.1, default: 1 },
      { id: "absMode", label: "絶対値表示 0/1", min: 0, max: 1, step: 1, default: 0 }
    ]
  },
  "area-between-curves": {
    controls: [
      { id: "a", label: "一次係数 a", min: -1, max: 3, step: 0.1, default: 1 },
      { id: "b", label: "定数 b", min: -1, max: 2, step: 0.1, default: 0.5 }
    ]
  },
  "chain-rule-flow": {
    controls: [
      { id: "x", label: "入力 x", min: -2, max: 2, step: 0.1, default: 1 },
      { id: "p", label: "係数 p", min: 0.5, max: 3, step: 0.1, default: 1.5 }
    ]
  },
  "area-function-ftc": {
    controls: [
      { id: "k", label: "係数 k", min: 0.5, max: 4, step: 0.1, default: 1 },
      { id: "x", label: "上端 x", min: 0.1, max: 3, step: 0.1, default: 1.6 }
    ]
  },
  "integral-function-derivative": {
    controls: [
      { id: "k", label: "係数 k", min: 0.5, max: 4, step: 0.1, default: 1 },
      { id: "x", label: "上端 x", min: 0.2, max: 3, step: 0.1, default: 1.8 }
    ]
  },
  "substitution-map": {
    controls: [
      { id: "p", label: "係数 p", min: 0.5, max: 3, step: 0.1, default: 1.2 },
      { id: "x", label: "入力 x", min: -2, max: 2, step: 0.1, default: 1 }
    ]
  }
};

export function getInteractiveFromModule(moduleName) {
  if (!moduleName) {
    return null;
  }
  const preset = MODULE_PRESETS[moduleName];
  if (!preset) {
    throw new Error(`Unknown viz module in plan: ${moduleName}`);
  }
  return {
    module: moduleName,
    controls: preset.controls
  };
}
