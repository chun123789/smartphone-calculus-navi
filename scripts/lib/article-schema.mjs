const VALID_SECTIONS = new Set([
  "basics",
  "differentiation",
  "integration",
  "fundamental",
  "mistakes"
]);
const VALID_TRACKS = new Set(["regular", "exam", "bridge"]);
const VALID_LEVELS = new Set(["基礎", "標準", "発展"]);
const VALID_PRIORITIES = new Set(["S", "A", "B"]);

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeDateLike(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (isNonEmptyString(value)) {
    return String(value).trim();
  }
  return "";
}

function validateControl(control, index, errors) {
  if (typeof control !== "object" || control === null) {
    errors.push(`interactive.controls[${index}] must be an object.`);
    return null;
  }
  const fields = ["id", "label", "min", "max", "step", "default"];
  for (const field of fields) {
    if (!(field in control)) {
      errors.push(`interactive.controls[${index}].${field} is required.`);
    }
  }
  if (!isNonEmptyString(control.id)) {
    errors.push(`interactive.controls[${index}].id must be a non-empty string.`);
  }
  if (!isNonEmptyString(control.label)) {
    errors.push(`interactive.controls[${index}].label must be a non-empty string.`);
  }
  for (const numericField of ["min", "max", "step", "default"]) {
    if (typeof control[numericField] !== "number" || Number.isNaN(control[numericField])) {
      errors.push(`interactive.controls[${index}].${numericField} must be a number.`);
    }
  }
  if (
    typeof control.min === "number" &&
    typeof control.max === "number" &&
    control.min >= control.max
  ) {
    errors.push(`interactive.controls[${index}] requires min < max.`);
  }
  return {
    id: control.id,
    label: control.label,
    min: control.min,
    max: control.max,
    step: control.step,
    default: control.default
  };
}

function validateUpdates(updates, errors) {
  if (!Array.isArray(updates) || updates.length === 0) {
    errors.push("updates must be a non-empty array.");
    return [];
  }
  return updates.map((entry, index) => {
    if (typeof entry !== "object" || entry === null) {
      errors.push(`updates[${index}] must be an object.`);
      return { date: "1970-01-01", note: "invalid entry" };
    }
    const normalizedDate = normalizeDateLike(entry.date);
    if (!isNonEmptyString(normalizedDate)) {
      errors.push(`updates[${index}].date must be a non-empty string.`);
    }
    if (!isNonEmptyString(entry.note)) {
      errors.push(`updates[${index}].note must be a non-empty string.`);
    }
    return {
      date: normalizedDate,
      note: String(entry.note)
    };
  });
}

function validateLinks(links, errors) {
  if (typeof links !== "object" || links === null) {
    errors.push("links must be an object.");
    return {
      prerequisitesCandidates: [],
      nextStep: "",
      mistakes: ""
    };
  }
  if (
    !Array.isArray(links.prerequisitesCandidates) ||
    links.prerequisitesCandidates.length < 2 ||
    !links.prerequisitesCandidates.every(isNonEmptyString)
  ) {
    errors.push("links.prerequisitesCandidates must include at least two slugs.");
  }
  if (!isNonEmptyString(links.nextStep)) {
    errors.push("links.nextStep must be a slug.");
  }
  if (!isNonEmptyString(links.mistakes)) {
    errors.push("links.mistakes must be a slug.");
  }
  return {
    prerequisitesCandidates: Array.isArray(links.prerequisitesCandidates)
      ? [...new Set(links.prerequisitesCandidates.map((slug) => String(slug).trim()))]
      : [],
    nextStep: String(links.nextStep ?? "").trim(),
    mistakes: String(links.mistakes ?? "").trim()
  };
}

export function validateArticleFrontmatter(rawData, filePath) {
  const errors = [];
  const requiredStrings = [
    "slug",
    "title",
    "description",
    "section",
    "track",
    "intent",
    "level",
    "examTag",
    "misconceptionPattern",
    "cta",
    "published"
  ];
  for (const field of requiredStrings.slice(0, 4)) {
    if (!isNonEmptyString(rawData[field])) {
      errors.push(`${field} must be a non-empty string.`);
    }
  }
  for (const field of requiredStrings.slice(4, requiredStrings.length - 1)) {
    if (!isNonEmptyString(rawData[field])) {
      errors.push(`${field} must be a non-empty string.`);
    }
  }
  const normalizedPublished = normalizeDateLike(rawData.published);
  if (!isNonEmptyString(normalizedPublished)) {
    errors.push("published must be a non-empty string.");
  }
  if (!VALID_SECTIONS.has(rawData.section)) {
    errors.push(`section must be one of: ${Array.from(VALID_SECTIONS).join(", ")}.`);
  }
  if (!Number.isInteger(rawData.order) || rawData.order < 0) {
    errors.push("order must be a non-negative integer.");
  }
  if (!Array.isArray(rawData.tags) || rawData.tags.length === 0 || !rawData.tags.every(isNonEmptyString)) {
    errors.push("tags must be a non-empty string array.");
  }
  if (!VALID_TRACKS.has(rawData.track)) {
    errors.push(`track must be one of: ${Array.from(VALID_TRACKS).join(", ")}.`);
  }
  if (!VALID_LEVELS.has(rawData.level)) {
    errors.push(`level must be one of: ${Array.from(VALID_LEVELS).join(", ")}.`);
  }
  if (!VALID_PRIORITIES.has(rawData.priority)) {
    errors.push(`priority must be one of: ${Array.from(VALID_PRIORITIES).join(", ")}.`);
  }
  if (!Number.isInteger(rawData.estimatedMinutes) || rawData.estimatedMinutes < 1) {
    errors.push("estimatedMinutes must be a positive integer.");
  }

  const interactive = rawData.interactive ?? null;
  let normalizedInteractive = null;
  if (interactive !== null) {
    if (typeof interactive !== "object") {
      errors.push("interactive must be an object when present.");
    } else {
      if (!isNonEmptyString(interactive.module)) {
        errors.push("interactive.module must be a non-empty string.");
      }
      if (!Array.isArray(interactive.controls) || interactive.controls.length === 0) {
        errors.push("interactive.controls must be a non-empty array.");
      }
      const controls = Array.isArray(interactive.controls)
        ? interactive.controls.map((control, index) => validateControl(control, index, errors))
        : [];
      normalizedInteractive = {
        module: String(interactive.module ?? ""),
        controls
      };
    }
  }

  const links = validateLinks(rawData.links, errors);
  const updates = validateUpdates(rawData.updates, errors);

  if (errors.length > 0) {
    const message = `Invalid frontmatter at ${filePath}\n- ${errors.join("\n- ")}`;
    throw new Error(message);
  }

  return {
    slug: rawData.slug.trim(),
    title: rawData.title.trim(),
    description: rawData.description.trim(),
    section: rawData.section,
    order: rawData.order,
    track: rawData.track,
    intent: rawData.intent.trim(),
    level: rawData.level,
    priority: rawData.priority,
    estimatedMinutes: rawData.estimatedMinutes,
    examTag: rawData.examTag.trim(),
    misconceptionPattern: rawData.misconceptionPattern.trim(),
    cta: rawData.cta.trim(),
    tags: rawData.tags.map((tag) => tag.trim()),
    interactive: normalizedInteractive,
    links,
    updates,
    published: normalizedPublished,
    conclusion: isNonEmptyString(rawData.conclusion) ? rawData.conclusion.trim() : "",
    example: isNonEmptyString(rawData.example) ? rawData.example.trim() : "",
    commonMistake: isNonEmptyString(rawData.commonMistake) ? rawData.commonMistake.trim() : ""
  };
}
