export function setupSliderAnnouncer(root) {
  const inputs = root.querySelectorAll(".slider-input");

  const readValues = () => {
    const values = {};
    inputs.forEach((input) => {
      const key = input.id.replace("ctrl-", "");
      values[key] = Number(input.value);
    });
    return values;
  };

  inputs.forEach((input) => {
    const key = input.id.replace("ctrl-", "");
    const output = root.querySelector(`#value-${key}`);
    const sync = () => {
      const value = Number(input.value);
      const text = Number.isInteger(value) ? String(value) : value.toFixed(2);
      if (output) {
        output.textContent = text;
      }
      input.setAttribute("aria-valuetext", text);
    };
    input.addEventListener("input", sync);
    sync();
  });

  return readValues;
}

