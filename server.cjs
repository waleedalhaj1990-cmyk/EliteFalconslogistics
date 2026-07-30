var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_multer = __toESM(require("multer"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_vite = require("vite");
var import_fs = __toESM(require("fs"), 1);
var DB_FILE = import_path.default.join(process.cwd(), "db.json");
var UPLOAD_DIR = import_path.default.join(process.cwd(), "uploads");
if (!import_fs.default.existsSync(UPLOAD_DIR)) {
  import_fs.default.mkdirSync(UPLOAD_DIR, { recursive: true });
}
function readDb() {
  if (!import_fs.default.existsSync(DB_FILE)) {
    return {
      news: [],
      services: [],
      team: [],
      settings: {
        phones: "+962 (0)6 4129494",
        email: "info@elitefalconslogistics.com",
        address: "Al Harrana Building 150, Mecca Street, 2nd Floor \u2013 Office 201, Amman \u2013 Jordan"
      }
    };
  }
  return JSON.parse(import_fs.default.readFileSync(DB_FILE, "utf-8"));
}
function writeDb(data) {
  import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use((0, import_cors.default)());
  app.use(import_express.default.json());
  app.use(import_express.default.static("public"));
  app.use("/uploads", import_express.default.static(UPLOAD_DIR));
  const upload = (0, import_multer.default)({ dest: UPLOAD_DIR });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.get("/api/settings", (req, res) => {
    const db = readDb();
    res.json(db.settings);
  });
  app.post("/api/settings", (req, res) => {
    const db = readDb();
    db.settings = { ...db.settings, ...req.body };
    writeDb(db);
    res.json({ success: true, settings: db.settings });
  });
  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });
  app.get("/api/news", (req, res) => {
    const db = readDb();
    res.json(db.news);
  });
  app.post("/api/news", (req, res) => {
    const db = readDb();
    const item = { id: Date.now().toString(), ...req.body, createdAt: /* @__PURE__ */ new Date() };
    db.news.push(item);
    writeDb(db);
    res.json(item);
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
