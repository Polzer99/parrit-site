import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import net from "node:net";
import { syncBuiltinESMExports } from "node:module";
import NextServerModule from "next/dist/server/next-server.js";
import { createRequestResponseMocks } from "next/dist/server/lib/mock-request.js";

/** Run the real production renderer, with every network transport forbidden. */
export async function withCompiledSite(run) {
  const attempts = [];
  const originals = [globalThis.fetch, http.request, http.get, https.request, https.get, net.Socket.prototype.connect];
  const deny = () => { attempts.push("unexpected network"); throw new Error("Network forbidden"); };
  globalThis.fetch = http.request = http.get = https.request = https.get = net.Socket.prototype.connect = deny;
  syncBuiltinESMExports();
  const conf = JSON.parse(readFileSync(".next/required-server-files.json", "utf8")).config;
  const server = new NextServerModule.default({ dir: process.cwd(), dev: false, conf, hostname: "localhost", port: 3210 });
  try {
    await server.prepare();
    await run(async (url, headers = {}) => {
      const chunks = [];
      const { req, res } = createRequestResponseMocks({ url, headers: { host: "localhost:3210", ...headers }, resWriter: chunk => { chunks.push(Buffer.from(chunk)); return true; } });
      await server.getRequestHandler()(req, res);
      if (!res.finished) await new Promise(resolve => res.once("finish", resolve));
      return { status: res.statusCode, headers: res.getHeaders(), html: Buffer.concat(chunks).toString() };
    });
  } finally {
    await server.close();
    [globalThis.fetch, http.request, http.get, https.request, https.get, net.Socket.prototype.connect] = originals;
    syncBuiltinESMExports();
  }
  assert.deepEqual(attempts, []);
}
