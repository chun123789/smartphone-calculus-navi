import fs from "node:fs/promises";
import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({
  gfm: true,
  breaks: false
});

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
  const rawHtml = marked.parse(markdown);
  return sanitizeHtml(rawHtml, sanitizeOptions);
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
