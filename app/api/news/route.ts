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

function sanitizeText(value: string): string {
  return value.replace(/<[^>]*>?/gm, "").trim();
}

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
  try {
    const url = new URL(value, base);
    // Anti-SSRF / Malicious Protocol check
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return new URL("/assets/nabaden-thumbnail.jpg", SITE_ORIGIN).toString();
    }
    return url.toString();
  } catch {
    return new URL("/assets/nabaden-thumbnail.jpg", SITE_ORIGIN).toString();
  }
}

const SECURITY_RESPONSE_HEADERS = {
  "Cache-Control": "public, s-maxage=900, stale-while-revalidate=86400",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
};

export async function GET() {
  try {
    const response = await fetch(NEWS_SOURCE, {
      headers: { accept: "text/javascript, application/javascript" },
    });
    if (!response.ok) throw new Error(`Nguồn tin phản hồi ${response.status}`);

    const articles = parseSource(await response.text())
      .filter((article) => article.id && article.title)
      .map((article) => ({
        id: sanitizeText(article.id as string),
        title: sanitizeText(article.title as string),
        text: sanitizeText(article.excerpt || "Đọc bài viết mới từ NABADEN."),
        category: sanitizeText(article.category || "Tin tức"),
        date: sanitizeText(article.date || ""),
        image: absoluteUrl(article.image || "/assets/nabaden-thumbnail.jpg"),
        href: absoluteUrl(`/tin-tuc/${article.id}/`),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));

    return Response.json(
      { articles, syncedAt: new Date().toISOString() },
      { headers: SECURITY_RESPONSE_HEADERS },
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể đồng bộ tin tức" },
      { status: 502, headers: { ...SECURITY_RESPONSE_HEADERS, "Cache-Control": "no-store" } },
    );
  }
}
