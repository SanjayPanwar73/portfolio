const assert = require("node:assert/strict");
const { test } = require("node:test");
const { mkdtemp, mkdir, writeFile, rm } = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { createApp } = require("../app");

const contact = { name: " Test Visitor ", email: "visitor@example.com", message: " An integration test enquiry. " };
const project = { title: " Test project ", description: " A test-only project. ", techStack: [" React ", "Node.js"] };

async function serve(t, options = {}) {
  const calls = { finds: 0, sort: null, projects: [], messages: [], errors: [] };
  const connected = options.connected ?? false;
  const Project = options.Project || {
    find() {
      calls.finds += 1;
      return { async sort(value) { calls.sort = value; return [{ _id: "test-project", title: "Fixture" }]; } };
    },
    async create(value) { calls.projects.push(value); return { _id: "test-project", ...value }; },
  };
  const Message = options.Message || {
    async create(value) {
      calls.messages.push(value);
      return { _id: "test-message", createdAt: "2026-01-01T00:00:00.000Z" };
    },
  };
  const app = createApp({
    clientBuildPath: path.join(__dirname, "no-build"),
    allowedOrigins: "http://127.0.0.1:5173, https://portfolio.example/ ",
    projectAdminToken: "test-admin-token",
    ...options,
    Project,
    Message,
    database: {
      isDatabaseReady: () => connected,
      getDatabaseStatus: () => ({ connected, readyState: connected ? 1 : 0, error: connected ? null : "Test database offline" }),
    },
    logger: { error: value => calls.errors.push(value) },
  });
  const server = await new Promise((resolve, reject) => {
    const listening = app.listen(0, "127.0.0.1", () => resolve(listening));
    listening.once("error", reject);
  });
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  return {
    calls,
    request: (route, init) => fetch(origin + route, init),
    async json(route, init) {
      const response = await fetch(origin + route, init);
      return { response, body: await response.json() };
    },
    async post(route, value, headers = {}) {
      const response = await fetch(origin + route, {
        method: "POST", headers: {
          "Content-Type": "application/json",
          ...(route === "/api/projects" ? { Authorization: "Bearer test-admin-token" } : {}),
          ...headers,
        }, body: JSON.stringify(value),
      });
      return { response, body: await response.json() };
    },
  };
}

async function staticFixture(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "portfolio-http-test-"));
  t.after(async () => {
    // Only remove the directory allocated by this test.
    assert.equal(path.dirname(directory), os.tmpdir());
    assert.ok(path.basename(directory).startsWith("portfolio-http-test-"));
    await rm(directory, { recursive: true, force: true });
  });
  await mkdir(path.join(directory, "assets"));
  await writeFile(path.join(directory, "index.html"), "<!doctype html><title>Test portfolio</title><main>SPA fixture</main>");
  await writeFile(path.join(directory, "assets/app.js"), "console.log('fixture');");
  await writeFile(path.join(directory, "resume.pdf"), "%PDF-test-fixture");
  return directory;
}

test("API index and health respond accurately while the database is offline", async t => {
  const app = await serve(t);
  const index = await app.json("/api");
  assert.equal(index.response.status, 200);
  assert.deepEqual(index.body.endpoints, ["/api/health", "/api/projects", "/api/contact"]);
  const health = await app.json("/api/health");
  assert.equal(health.response.status, 503);
  assert.equal(health.body.status, "degraded");
  assert.equal(health.body.database.connected, false);
  assert.ok(Number.isFinite(Date.parse(health.body.timestamp)));
  assert.equal(app.calls.finds, 0);
});

test("healthy database status returns HTTP 200", async t => {
  const app = await serve(t, { connected: true });
  const { response, body } = await app.json("/api/health");
  assert.equal(response.status, 200);
  assert.equal(body.status, "ok");
  assert.equal(body.database.connected, true);
});

test("CORS accepts configured origins, trims configuration and supports preflight", async t => {
  const app = await serve(t);
  for (const origin of ["http://127.0.0.1:5173", "https://portfolio.example"]) {
    const response = await app.request("/api", { headers: { Origin: origin } });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("access-control-allow-origin"), origin);
    assert.ok(response.headers.get("vary").includes("Origin"));
  }
  const response = await app.request("/api/contact", {
    method: "OPTIONS",
    headers: { Origin: "http://127.0.0.1:5173", "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "Content-Type" },
  });
  assert.equal(response.status, 204);
  assert.ok(response.headers.get("access-control-allow-methods").includes("POST"));
  assert.equal(response.headers.get("access-control-allow-headers"), "Content-Type");
});

test("CORS rejects an unconfigured origin with 403 and no permission header", async t => {
  const app = await serve(t);
  const { response, body } = await app.json("/api", { headers: { Origin: "https://untrusted.example" } });
  assert.equal(response.status, 403);
  assert.equal(response.headers.get("access-control-allow-origin"), null);
  assert.deepEqual(body, { error: "Origin not allowed" });
  assert.equal(app.calls.errors.length, 0);
});

test("wildcard CORS configuration and requests without an Origin remain supported", async t => {
  const app = await serve(t, { allowedOrigins: "*" });
  const response = await app.request("/api", { headers: { Origin: "https://visitor.example" } });
  assert.equal(response.headers.get("access-control-allow-origin"), "https://visitor.example");
  assert.equal((await app.request("/api")).status, 200);
});

test("malformed JSON returns 400 instead of an internal server error", async t => {
  const app = await serve(t);
  const { response, body } = await app.json("/api/contact", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: '{"name":',
  });
  assert.equal(response.status, 400);
  assert.deepEqual(body, { error: "Invalid JSON request body" });
  assert.deepEqual(app.calls.messages, []);
});

test("oversized JSON returns 413 without invoking model writes", async t => {
  const app = await serve(t);
  const { response, body } = await app.post("/api/contact", { ...contact, message: "x".repeat(110_000) });
  assert.equal(response.status, 413);
  assert.deepEqual(body, { error: "Request body too large" });
  assert.deepEqual(app.calls.messages, []);
});

test("unsupported body encoding and charset retain HTTP 415", async t => {
  const app = await serve(t);
  for (const headers of [
    { "Content-Type": "application/json", "Content-Encoding": "compress" },
    { "Content-Type": "application/json; charset=iso-8859-1" },
  ]) {
    const { response, body } = await app.json("/api/contact", { method: "POST", headers, body: "{}" });
    assert.equal(response.status, 415);
    assert.deepEqual(body, { error: "Unsupported request encoding" });
  }
});

test("static assets and every portfolio deep link are served from the build", async t => {
  const app = await serve(t, { clientBuildPath: await staticFixture(t) });
  for (const route of ["/", "/skills", "/work", "/experience", "/about", "/about?source=test"]) {
    const response = await app.request(route);
    assert.equal(response.status, 200, route);
    assert.ok(response.headers.get("content-type").includes("text/html"));
    assert.match(await response.text(), /SPA fixture/);
  }
  const script = await app.request("/assets/app.js");
  assert.equal(script.status, 200);
  assert.match(script.headers.get("content-type"), /javascript/);
  assert.match(await script.text(), /fixture/);
  const pdf = await app.request("/resume.pdf");
  assert.equal(pdf.status, 200);
  assert.ok(pdf.headers.get("content-type").includes("application/pdf"));
  assert.match(await pdf.text(), /^%PDF-/);
  const head = await app.request("/about", { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
});

test("missing files and API routes retain 404 rather than returning SPA HTML", async t => {
  const app = await serve(t, { clientBuildPath: await staticFixture(t) });
  for (const route of ["/assets/missing.js", "/assets/missing", "/favicon.svg", "/missing.pdf", "/api/missing"]) {
    const { response, body } = await app.json(route);
    assert.equal(response.status, 404, route);
    assert.deepEqual(body, { error: "Route not found" });
  }
  assert.equal((await app.request("/about", { headers: { Accept: "application/json" } })).status, 404);
  assert.equal((await app.request("/work", { method: "POST" })).status, 404);
});

test("an absent build returns a clean 404 and does not break API routes", async t => {
  const app = await serve(t);
  assert.equal((await app.request("/about")).status, 404);
  assert.equal((await app.request("/api")).status, 200);
});

test("malformed URL escapes return HTTP 400", async t => {
  const app = await serve(t, { clientBuildPath: await staticFixture(t) });
  const response = await app.request("/%invalid");
  assert.equal(response.status, 400);
});

test("contact validation rejects missing, invalid, long and non-text values before model access", async t => {
  const app = await serve(t, { connected: true });
  for (const value of [
    {}, { ...contact, name: " " }, { ...contact, name: { injected: true } },
    { ...contact, name: ["visitor"] }, { ...contact, name: "x".repeat(101) },
    { ...contact, email: "invalid" }, { ...contact, email: ["visitor@example.com"] },
    { ...contact, email: "x".repeat(255) }, { ...contact, message: "too short" },
    { ...contact, message: { injected: true } }, { ...contact, message: "x".repeat(2001) },
  ]) {
    const { response, body } = await app.post("/api/contact", value);
    assert.equal(response.status, 400, JSON.stringify(value));
    assert.equal(body.success, false);
    assert.ok(body.errors.length > 0);
  }
  assert.deepEqual(app.calls.messages, []);
});

test("offline contact and project endpoints return 503 without touching models", async t => {
  const app = await serve(t);
  const contactResult = await app.post("/api/contact", contact);
  assert.equal(contactResult.response.status, 503);
  assert.equal(contactResult.body.success, false);
  const projectResult = await app.post("/api/projects", project);
  assert.equal(projectResult.response.status, 503);
  const projects = await app.json("/api/projects");
  assert.equal(projects.response.status, 503);
  assert.deepEqual(projects.body.data, []);
  assert.equal(app.calls.finds, 0);
  assert.deepEqual(app.calls.messages, []);
  assert.deepEqual(app.calls.projects, []);
});

test("successful contact requests save only validated fields and report the created record", async t => {
  const app = await serve(t, { connected: true });
  const { response, body } = await app.post("/api/contact", { ...contact, read: true, _id: "injected", createdAt: "injected" });
  assert.equal(response.status, 201);
  assert.equal(body.success, true);
  assert.deepEqual(body.data, { id: "test-message", createdAt: "2026-01-01T00:00:00.000Z" });
  assert.deepEqual(app.calls.messages, [{ name: "Test Visitor", email: "visitor@example.com", message: "An integration test enquiry." }]);
});

test("contact persistence failures report failure without exposing database details", async t => {
  for (const [name, expectedStatus] of [["Error", 500], ["ValidationError", 400]]) {
    const error = Object.assign(new Error("private-database-details"), { name });
    const app = await serve(t, { connected: true, Message: { async create() { throw error; } } });
    const { response, body } = await app.post("/api/contact", contact);
    assert.equal(response.status, expectedStatus);
    assert.equal(body.success, false);
    assert.ok(!JSON.stringify(body).includes("private-database-details"));
    assert.equal(app.calls.errors.length, 1);
  }
});

test("projects are returned newest first with the actual result count", async t => {
  const app = await serve(t, { connected: true });
  const { response, body } = await app.json("/api/projects");
  assert.equal(response.status, 200);
  assert.deepEqual(app.calls.sort, { createdAt: -1 });
  assert.equal(app.calls.finds, 1);
  assert.equal(body.count, body.data.length);
  assert.equal(body.data[0]._id, "test-project");
});

test("project writes remain disabled when no admin token is configured", async t => {
  const app = await serve(t, { connected: true, projectAdminToken: "" });
  const { response, body } = await app.post("/api/projects", project);
  assert.equal(response.status, 503);
  assert.deepEqual(body, { success: false, error: "Project updates are not configured" });
  assert.deepEqual(app.calls.projects, []);
  assert.equal((await app.request("/api/projects")).status, 200);
});

test("project writes require a matching bearer token while reads stay public", async t => {
  const app = await serve(t, { connected: true });
  for (const Authorization of ["", "Bearer wrong", "Bearer wrong-admin-tok", "Basic test-admin-token"]) {
    const { response, body } = await app.post("/api/projects", project, { Authorization });
    assert.equal(response.status, 401);
    assert.equal(response.headers.get("www-authenticate"), "Bearer");
    assert.deepEqual(body, { success: false, error: "Unauthorized" });
  }
  assert.deepEqual(app.calls.projects, []);
  assert.equal((await app.request("/api/projects")).status, 200);
  assert.equal((await app.post("/api/projects", project)).response.status, 201);
  assert.equal(app.calls.projects.length, 1);
});

test("project validation rejects empty arrays, non-text technologies and schema length violations", async t => {
  const app = await serve(t, { connected: true });
  for (const value of [
    {}, { ...project, title: { injected: true } }, { ...project, title: " " },
    { ...project, title: "x".repeat(101) }, { ...project, description: "x".repeat(501) },
    { ...project, description: ["description"] }, { ...project, techStack: [] },
    { ...project, techStack: "React" }, { ...project, techStack: ["React", {}] },
    { ...project, techStack: [" "] }, { ...project, githubUrl: { injected: true } },
  ]) {
    const { response, body } = await app.post("/api/projects", value);
    assert.equal(response.status, 400, JSON.stringify(value));
    assert.equal(body.success, false);
  }
  assert.deepEqual(app.calls.projects, []);
});

test("project creation trims validated data, preserves optional links and ignores extra fields", async t => {
  const app = await serve(t, { connected: true });
  const value = { ...project, githubUrl: " https://github.com/example/project ", liveUrl: "", imageUrl: "/assets/example.png", createdAt: "injected" };
  const { response, body } = await app.post("/api/projects", value);
  assert.equal(response.status, 201);
  assert.equal(body.success, true);
  assert.deepEqual(app.calls.projects, [{
    title: "Test project", description: "A test-only project.", techStack: ["React", "Node.js"],
    githubUrl: "https://github.com/example/project", liveUrl: "", imageUrl: "/assets/example.png",
  }]);
  assert.equal(body.data._id, "test-project");
});

test("project query and write failures return honest error responses", async t => {
  const Project = {
    find() { return { async sort() { throw new Error("private-database-details"); } }; },
    async create() { throw new Error("private-database-details"); },
  };
  const app = await serve(t, { connected: true, Project });
  for (const result of [await app.json("/api/projects"), await app.post("/api/projects", project)]) {
    assert.equal(result.response.status, 500);
    assert.equal(result.body.success, false);
    assert.ok(!JSON.stringify(result.body).includes("private-database-details"));
  }
  assert.equal(app.calls.errors.length, 2);
});

test("a project model validation failure is a client error", async t => {
  const app = await serve(t, {
    connected: true,
    Project: { async create() { throw Object.assign(new Error("invalid fixture"), { name: "ValidationError" }); } },
  });
  const { response, body } = await app.post("/api/projects", project);
  assert.equal(response.status, 400);
  assert.deepEqual(body, { success: false, error: "Invalid project details" });
});
