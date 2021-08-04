import { createHash } from "crypto";
import type { IncomingMessage } from "http";
import type { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

type App = Parameters<NonNullable<WebpackDevServerConfiguration["after"]>>[0];

const getHash = async (buffer: Buffer) =>
  createHash("sha256").update(buffer).digest("hex");

const readBody = (req: IncomingMessage) =>
  new Promise<Buffer>((resolve) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
  });

export const initServerStore = (
  app: App,
  cache = new Map<string, Buffer>()
) => {
  app.post("/upload", async (req, res) => {
    const buffer = await readBody(req);

    const key = await getHash(buffer);

    const u = new URL(`/get/${key}`, req.headers.origin || req.headers.referer);

    res.write(JSON.stringify({ url: u.toString() }));
    res.end();
  });

  app.get("/get/:key", (req, res) => {
    const key = req.params.key as string;

    if (!cache.has(key)) {
      res.writeHead(404);
      res.end();
    } else {
      res.writeHead(200, {
        "content-type": "application/octet-stream",
        "Access-Control-Allw-Origin": "*",
      });
      res.write(cache.get(key));
      res.end();
    }
  });
};
