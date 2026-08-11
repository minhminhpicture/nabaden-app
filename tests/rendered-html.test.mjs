import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the NABADEN mobile app", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>NABADEN · Mãng cầu Bà Đen<\/title>/i);
  assert.match(html, /Mãng cầu Bà Đen/);
  assert.match(html, /Tin tức/);
  assert.match(html, /Trải nghiệm/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("news route synchronizes articles from nabaden.vn", async () => {
  const [route, page] = await Promise.all([
    readFile(new URL("../app/api/news/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(route, /https:\/\/nabaden\.vn\/news-data\.js/);
  assert.match(route, /s-maxage=900/);
  assert.match(route, /\/tin-tuc\/\$\{article\.id\}\//);
  assert.match(page, /fetch\("\/api\/news"/);
  assert.match(page, /Tự động cập nhật từ nabaden\.vn/);
  assert.match(page, /fallbackStories/);
});
