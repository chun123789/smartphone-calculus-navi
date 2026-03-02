import fs from "node:fs/promises";
import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({
  gfm: true,
  breaks: false
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function protectMath(markdown) {
  const tokens = [];
  const pushToken = (snippet) => {
    const id = tokens.length;
    tokens.push(snippet);
    return `@@MATH_TOKEN_${id}@@`;
  };

  const withDisplayMath = markdown
    .replace(/\\\[[\s\S]*?\\\]/g, (match) => pushToken(match))
    .replace(/\$\$[\s\S]*?\$\$/g, (match) => pushToken(match));

  const withInlineMath = withDisplayMath
    .replace(/\\\([^\n]*?\\\)/g, (match) => pushToken(match))
    .replace(/\$(?!\$)([^$\n]+?)\$(?!\$)/g, (match) => pushToken(match));

  return { text: withInlineMath, tokens };
}

function restoreMath(html, tokens) {
  let restored = html;
  tokens.forEach((token, index) => {
    const escaped = escapeHtml(token);
    restored = restored.replaceAll(`@@MATH_TOKEN_${index}@@`, () => escaped);
  });
  return restored;
}

const sanitizeOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "p",
    "ul",
    "ol",
    "li",
    "strong",
    "em",
    "code",
    "pre",
    "blockquote",
    "a",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "hr"
  ],
  allowedAttributes: {
    a: ["href", "title"],
    code: ["class"]
  },
  allowedSchemes: ["http", "https", "mailto"]
};

export function markdownToSafeHtml(markdown) {
  const protectedMath = protectMath(markdown);
  const rawHtml = marked.parse(protectedMath.text);
  const sanitized = sanitizeHtml(rawHtml, sanitizeOptions);
  return restoreMath(sanitized, protectedMath.tokens);
}

export async function parseMarkdownFile(filePath, validator) {
  const source = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = validator ? validator(data, filePath) : data;
  return {
    frontmatter,
    content,
    html: markdownToSafeHtml(content)
  };
}
