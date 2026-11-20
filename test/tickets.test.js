const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const request = require("http");

const { DATA_FILE } = require("../src/store");

let server;
let testPort;

function httpRequest(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = request.request(
      {
        hostname: "127.0.0.1",
        port: testPort,
        path: urlPath,
        method,
        headers: body
          ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload) }
          : {},
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
        });
      }
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

before(async () => {
  if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
  process.env.HOST = "127.0.0.1";
  const app = require("../src/server");
  await new Promise((resolve, reject) => {
    server = app.listen(0, "127.0.0.1", (err) => (err ? reject(err) : resolve()));
  });
  testPort = server.address().port;
  process.env.PORT = String(testPort);
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    server = null;
  }
});

test("health endpoint responds", async () => {
  const res = await httpRequest("GET", "/api/health");
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
});

test("create and list tickets", async () => {
  const created = await httpRequest("POST", "/api/tickets", {
    subject: "Login issue",
    description: "Cannot sign in",
    priority: "high",
  });
  assert.equal(created.status, 201);
  assert.equal(created.body.subject, "Login issue");

  const listed = await httpRequest("GET", "/api/tickets");
  assert.equal(listed.status, 200);
  assert.equal(listed.body.length, 1);
  assert.equal(listed.body[0].id, created.body.id);
});