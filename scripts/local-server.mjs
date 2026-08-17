import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, normalize, resolve, sep } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const port = Number(process.env.PORT ?? 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".jfif": "image/jpeg",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://localhost");
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = resolve(root, `.${normalize(pathname)}`);

  if (!file.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end("Forbidden");
    return;
  }

  try {
    if (!statSync(file).isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": contentTypes[extname(file).toLowerCase()] ?? "application/octet-stream",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, { "Cache-Control": "no-store, max-age=0" }).end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`IHSAAN local preview: http://localhost:${port}`);
});
