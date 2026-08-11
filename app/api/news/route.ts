type SourceArticle = {
  id?: string;
  title?: string;
  excerpt?: string;
  category?: string;
  date?: string;
  image?: string;
};

const NEWS_SOURCE = "https://nabaden.vn/news-data.js";
const SITE_ORIGIN = "https://nabaden.vn";

function parseSource(source: string): SourceArticle[] {
  const start = source.indexOf("[");
  const end = source.lastIndexOf("]");
  if (start < 0 || end <= start) throw new Error("Nguồn tin không đúng định dạng");

  const json = source
    .slice(start, end + 1)
    .replace(/([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/g, '$1"$2"$3')
    .replace(/,\s*([}\]])/g, "$1");

  return JSON.parse(json) as SourceArticle[];
}

function absoluteUrl(value: string, base = SITE_ORIGIN) {
  return new URL(value, base).toString();
}

export async function GET() {
  try {
    const response = await fetch(NEWS_SOURCE, {
      headers: { accept: "text/javascript, application/javascript" },
    });
    if (!response.ok) throw new Error(`Nguồn tin phản hồi ${response.status}`);

    const articles = parseSource(await response.text())
      .filter((article) => article.id && article.title)
      .map((article) => ({
        id: article.id as string,
        title: article.title as string,
        text: article.excerpt || "Đọc bài viết mới từ NABADEN.",
        category: article.category || "Tin tức",
        date: article.date || "",
        image: absoluteUrl(article.image || "/assets/nabaden-thumbnail.jpg"),
        href: absoluteUrl(`/tin-tuc/${article.id}/`),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    return Response.json(
      { articles, syncedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400" } },
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể đồng bộ tin tức" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
