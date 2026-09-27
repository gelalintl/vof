export function excerpt(content: string, max = 220): string {
  const text = content.replace(/\s+/g, " ").trim();
  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max).replace(/\s+\S*$/, "")}…`;
}
