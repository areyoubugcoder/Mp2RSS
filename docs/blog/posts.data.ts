import { createContentLoader } from "vitepress";

export interface BlogPost {
  title: string;
  description: string;
  date: string;
  tags: string[];
  url: string;
}

declare const data: BlogPost[];
export { data };

export default createContentLoader("blog/posts/*.md", {
  transform(raw): BlogPost[] {
    return raw
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title ?? "",
        description: frontmatter.description ?? "",
        date: formatDate(frontmatter.date),
        tags: frontmatter.tags ?? [],
        url,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  },
});

function formatDate(date: unknown): string {
  if (date instanceof Date) return date.toISOString().slice(0, 10);
  return String(date ?? "").slice(0, 10);
}
