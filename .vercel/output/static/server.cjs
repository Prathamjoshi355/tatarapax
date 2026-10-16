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
var import_express2 = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_vite = require("vite");

// api/_lib/app.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
var import_mongodb = require("mongodb");
var import_cloudinary = require("cloudinary");
var import_nodemailer = __toESM(require("nodemailer"), 1);

// src/server-excel.ts
var import_zlib = __toESM(require("zlib"), 1);
function sanitizeCell(val) {
  if (val === null || val === void 0) return "";
  let str = String(val).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return str;
}
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}
function getColumnLetter(colIndex) {
  let letter = "";
  while (colIndex >= 0) {
    letter = String.fromCharCode(colIndex % 26 + 65) + letter;
    colIndex = Math.floor(colIndex / 26) - 1;
  }
  return letter;
}
function buildXlsxBuffer(columnsOrRows, rowsOrSheetName, sheetNameParam = "Applications") {
  let columns = [];
  let rows = [];
  let sheetName = sheetNameParam;
  if (Array.isArray(columnsOrRows) && columnsOrRows.length > 0 && "header" in columnsOrRows[0]) {
    columns = columnsOrRows;
    rows = Array.isArray(rowsOrSheetName) ? rowsOrSheetName : [];
    sheetName = typeof sheetNameParam === "string" ? sheetNameParam : "Applications";
  } else if (Array.isArray(columnsOrRows)) {
    rows = columnsOrRows;
    sheetName = typeof rowsOrSheetName === "string" ? rowsOrSheetName : "Applications";
    const sample = rows[0] || {};
    columns = Object.keys(sample).map((k) => ({
      header: k.charAt(0).toUpperCase() + k.slice(1),
      key: k,
      width: Math.max(k.length + 4, 16)
    }));
  } else {
    columns = [];
    rows = [];
  }
  const sanitizedSheetName = sheetName.replace(/[:\\/?*\[\]]/g, "_").substring(0, 31) || "Applications";
  let sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
`;
  sheetXml += `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
`;
  sheetXml += `  <cols>
`;
  columns.forEach((col, idx) => {
    const width = col.width || Math.max(col.header.length + 4, 14);
    sheetXml += `    <col min="${idx + 1}" max="${idx + 1}" width="${width}" customWidth="1"/>
`;
  });
  sheetXml += `  </cols>
`;
  sheetXml += `  <sheetData>
`;
  sheetXml += `    <row r="1" ht="26" customHeight="1">
`;
  columns.forEach((col, colIdx) => {
    const cellRef = `${getColumnLetter(colIdx)}1`;
    const escapedVal = escapeXml(col.header);
    sheetXml += `      <c r="${cellRef}" t="inlineStr" s="1"><is><t>${escapedVal}</t></is></c>
`;
  });
  sheetXml += `    </row>
`;
  rows.forEach((row, rowIdx) => {
    const rNum = rowIdx + 2;
    sheetXml += `    <row r="${rNum}" ht="20" customHeight="1">
`;
    columns.forEach((col, colIdx) => {
      const cellRef = `${getColumnLetter(colIdx)}${rNum}`;
      const rawVal = row[col.key];
      const sanitized = sanitizeCell(rawVal);
      const escapedVal = escapeXml(sanitized);
      sheetXml += `      <c r="${cellRef}" t="inlineStr" s="2"><is><t>${escapedVal}</t></is></c>
`;
    });
    sheetXml += `    </row>
`;
  });
  sheetXml += `  </sheetData>
`;
  sheetXml += `</worksheet>`;
  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="10"/><color rgb="FF1F2937"/><name val="Segoe UI"/></font>
    <font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Segoe UI"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF071B4D"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/></border>
    <border>
      <left style="thin"><color rgb="FFE5E7EB"/></left>
      <right style="thin"><color rgb="FFE5E7EB"/></right>
      <top style="thin"><color rgb="FFE5E7EB"/></top>
      <bottom style="thin"><color rgb="FFE5E7EB"/></bottom>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="3">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/>
  </cellXfs>
</styleSheet>`;
  const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${escapeXml(sanitizedSheetName)}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;
  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
  const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;
  const files = [
    { path: "[Content_Types].xml", data: Buffer.from(contentTypesXml, "utf-8") },
    { path: "_rels/.rels", data: Buffer.from(rootRelsXml, "utf-8") },
    { path: "xl/_rels/workbook.xml.rels", data: Buffer.from(workbookRelsXml, "utf-8") },
    { path: "xl/workbook.xml", data: Buffer.from(workbookXml, "utf-8") },
    { path: "xl/styles.xml", data: Buffer.from(stylesXml, "utf-8") },
    { path: "xl/worksheets/sheet1.xml", data: Buffer.from(sheetXml, "utf-8") }
  ];
  return createZipArchive(files);
}
function createZipArchive(files) {
  const localHeaders = [];
  const centralDirectoryHeaders = [];
  let offset = 0;
  for (const file of files) {
    const fileNameBuf = Buffer.from(file.path, "utf-8");
    const uncompressedData = file.data;
    const uncompressedSize = uncompressedData.length;
    const crc = computeCrc32(uncompressedData);
    const compressedData = import_zlib.default.deflateRawSync(uncompressedData, { level: 6 });
    const compressedSize = compressedData.length;
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(67324752, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(8, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressedSize, 18);
    localHeader.writeUInt32LE(uncompressedSize, 22);
    localHeader.writeUInt16LE(fileNameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);
    const fullLocalRecord = Buffer.concat([localHeader, fileNameBuf, compressedData]);
    localHeaders.push(fullLocalRecord);
    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(33639248, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressedSize, 20);
    centralHeader.writeUInt32LE(uncompressedSize, 24);
    centralHeader.writeUInt16LE(fileNameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    const fullCentralRecord = Buffer.concat([centralHeader, fileNameBuf]);
    centralDirectoryHeaders.push(fullCentralRecord);
    offset += fullLocalRecord.length;
  }
  const centralDirBuf = Buffer.concat(centralDirectoryHeaders);
  const centralDirSize = centralDirBuf.length;
  const centralDirOffset = offset;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(101010256, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(centralDirOffset, 16);
  eocd.writeUInt16LE(0, 20);
  return Buffer.concat([...localHeaders, centralDirBuf, eocd]);
}
var crc32Table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
  }
  crc32Table[i] = c;
}
function computeCrc32(buf) {
  let crc = 4294967295;
  for (let i = 0; i < buf.length; i++) {
    crc = crc32Table[(crc ^ buf[i]) & 255] ^ crc >>> 8;
  }
  return (crc ^ 4294967295) >>> 0;
}

// api/_lib/app.ts
for (const envPath of [import_path.default.resolve(process.cwd(), ".env")]) {
  try {
    import_dotenv.default.config({ path: envPath });
  } catch (e) {
  }
}
async function sendEmail({
  to,
  toName,
  subject,
  html,
  text
}) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || `"TANTRA PEX" <${user || "no-reply@tantrapex.com"}>`;
  if (!host || !user || !pass) {
    console.warn("SMTP host, user, or pass environment variables are missing! Email sending skipped.");
    return { success: false, msg: "SMTP credentials not configured in environment variables." };
  }
  try {
    const transporter = import_nodemailer.default.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      },
      connectionTimeout: 6e3,
      greetingTimeout: 6e3,
      socketTimeout: 6e3
    });
    const info = await transporter.sendMail({
      from,
      to: `"${toName}" <${to}>`,
      subject,
      text,
      html
    });
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("Failed to send email via SMTP:", err);
    return { success: false, error: err.message };
  }
}
if (process.env.CLOUDINARY_CLOUD_NAME) {
  import_cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}
var app = (0, import_express.default)();
var uri = process.env.MONGODB_URI;
var client = null;
var db = null;
var lastAttemptTime = 0;
var connectionError = null;
function checkUriIssues(uriToCheck) {
  try {
    if (!uriToCheck.startsWith("mongodb://") && !uriToCheck.startsWith("mongodb+srv://")) {
      return "Invalid connection scheme. MONGODB_URI must start with 'mongodb://' or 'mongodb+srv://'.";
    }
    const parts = uriToCheck.split("@");
    if (parts.length > 2) {
      return "Your MONGODB_URI contains multiple '@' characters. If your database password contains an '@' character, you MUST replace it with its percent-encoded equivalent '%40' in the connection string (e.g., p%40ssword instead of p@ssword).";
    }
    const authAndScheme = parts[0];
    const schemeIndex = authAndScheme.indexOf("://");
    if (schemeIndex !== -1) {
      const auth = authAndScheme.substring(schemeIndex + 3);
      const colonIndex = auth.indexOf(":");
      if (colonIndex !== -1) {
        const password = auth.substring(colonIndex + 1);
        const rawSpecialChars = ["#", "?", ":", "/", "+", " "];
        const found = rawSpecialChars.filter((char) => password.includes(char));
        if (found.length > 0) {
          const encodings = {
            "#": "%23",
            "?": "%3F",
            ":": "%3A",
            "/": "%2F",
            "+": "%2B",
            " ": "%20"
          };
          const suggestions = found.map((char) => `'${char}' with '${encodings[char]}'`).join(", ");
          return `Your database password contains unencoded special characters. Please replace ${suggestions} in your MONGODB_URI password segment to ensure proper authentication.`;
        }
      }
    }
  } catch (e) {
  }
  return null;
}
async function createRazorpayOrder({
  amount,
  currency = "INR",
  receipt = "tantrapex-order",
  notes = {}
}) {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!keyId || !keySecret) {
    return {
      success: false,
      mock: false,
      error: "Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment.",
      keyId: "",
      order: null
    };
  }
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`
    },
    body: JSON.stringify({
      amount: Math.round(amount * 100),
      currency,
      receipt,
      notes
    })
  });
  const data = await response.json();
  if (!response.ok || !data.id) {
    return {
      success: false,
      mock: false,
      error: data.error?.description || "Failed to create Razorpay order",
      keyId,
      order: null
    };
  }
  return {
    success: true,
    mock: false,
    keyId,
    order: {
      id: data.id,
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt
    }
  };
}
async function getDb() {
  if (!uri) {
    connectionError = "MONGODB_URI is not defined in environment variables.";
    return null;
  }
  const uriIssue = checkUriIssues(uri);
  if (uriIssue) {
    connectionError = uriIssue;
    return null;
  }
  if (db) {
    return db;
  }
  const now = Date.now();
  if (connectionError && now - lastAttemptTime < 15e3) {
    return null;
  }
  lastAttemptTime = now;
  try {
    console.log("Connecting to MongoDB...");
    client = new import_mongodb.MongoClient(uri, {
      connectTimeoutMS: 5e3,
      serverSelectionTimeoutMS: 5e3
    });
    await client.connect();
    db = client.db("tatrapax");
    connectionError = null;
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    connectionError = err.message || String(err);
    if (connectionError && (connectionError.includes("bad auth") || connectionError.includes("Authentication failed"))) {
      connectionError = "Authentication failed: Your MONGODB_URI has an incorrect username, password, or contains unencoded special characters in the password. Please verify and update your credentials in Settings.";
    }
    db = null;
  }
  return db;
}
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});
app.use(import_express.default.json({ limit: "15mb" }));
app.use((req, _res, next) => {
  const matchedPath = req.headers["x-matched-path"];
  if ((req.url === "/" || req.url === "/api" || req.url === "/api/") && matchedPath && matchedPath !== "/api" && matchedPath !== "/api/") {
    req.url = matchedPath;
  }
  if (req.url && !req.url.startsWith("/api")) {
    req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
  }
  next();
});
app.all(["/api", "/api/", "/api/health"], async (_req, res) => {
  const database = await getDb();
  res.json({
    status: "ok",
    message: "Tantrapex API is online and operational.",
    mongodb: database ? "connected" : "disconnected",
    connectionError,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get(["/api/razorpay-key", "/api/razorpay/key"], (_req, res) => {
  res.json({
    keyId: process.env.RAZORPAY_KEY_ID || ""
  });
});
app.post(["/api/razorpay/create-order", "/api/razorpay-create-order"], async (req, res) => {
  try {
    const { amount = 0, currency = "INR", receipt = "tantrapex-order", notes = {} } = req.body || {};
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }
    const order = await createRazorpayOrder({
      amount: numericAmount,
      currency,
      receipt,
      notes
    });
    if (!order.success) {
      return res.status(500).json(order);
    }
    res.json(order);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to create order" });
  }
});
app.post("/api/upload-image", async (req, res) => {
  try {
    const { data, folder = "Tantrapex" } = req.body || {};
    if (!data) {
      return res.status(400).json({ success: false, message: "Missing image data" });
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Cloudinary is not configured properly. Missing CLOUDINARY env vars.");
      return res.status(500).json({
        success: false,
        message: "Cloudinary is not configured on this server. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
      });
    }
    const result = await import_cloudinary.v2.uploader.upload(data, {
      folder,
      overwrite: false,
      resource_type: "image"
    });
    res.json({ success: true, url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error("Upload to Cloudinary failed:", err);
    res.status(500).json({ success: false, message: err.message || String(err) });
  }
});
app.get("/api/load-all", async (_req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.json({
        success: false,
        msg: "MongoDB disconnected. Falling back to browser cache/local state.",
        connectionError,
        data: null
      });
    }
    const collections = [
      "pages",
      "settings",
      "media",
      "placed_students",
      "hiring_partners",
      "courses",
      "blogs",
      "services",
      "leads",
      "plan_purchases",
      "workshop_registrations",
      "emails",
      "placement_drives",
      "placement_applications"
    ];
    const data = {};
    for (const colName of collections) {
      const col = database.collection(colName);
      const items = await col.find({}).toArray();
      data[colName] = items.map(({ _id, ...rest }) => rest);
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error("Error loading all data:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/save-all", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.status(503).json({
        success: false,
        msg: "MongoDB is not connected. Cannot write to database.",
        connectionError
      });
    }
    const payload = req.body || {};
    const protectedCollections = ["placement_drives", "placement_applications", "plan_purchases", "workshop_registrations", "emails"];
    for (const [colName, items] of Object.entries(payload)) {
      if (protectedCollections.includes(colName)) continue;
      if (!items) continue;
      const col = database.collection(colName);
      await col.deleteMany({});
      if (Array.isArray(items)) {
        if (items.length > 0) {
          await col.insertMany(items);
        }
      } else if (typeof items === "object") {
        await col.insertOne(items);
      }
    }
    res.json({ success: true, msg: "Successfully synchronized database state with MongoDB!" });
  } catch (error) {
    console.error("Error saving CMS datasets:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/save-page", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.json({ success: true, offline: true, msg: "Database offline. Saved locally." });
    }
    const { page } = req.body || {};
    if (!page || !page.id) {
      return res.status(400).json({ success: false, msg: "Page data missing" });
    }
    const col = database.collection("pages");
    await col.updateOne({ id: page.id }, { $set: page }, { upsert: true });
    res.json({ success: true, msg: "Page updated in MongoDB" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/update-admin-password", async (req, res) => {
  try {
    const { newPassword, developerMasterPassword } = req.body || {};
    if (!newPassword) {
      return res.status(400).json({ success: false, msg: "New admin password is required." });
    }
    const expectedMasterPassword = process.env.DEVELOPER_MASTER_PASSWORD || "devmaster123";
    if (developerMasterPassword !== expectedMasterPassword) {
      return res.status(403).json({
        success: false,
        msg: "Incorrect Developer Master Password! Only developers with access to the environment file can change this."
      });
    }
    const database = await getDb();
    if (!database) {
      return res.json({
        success: true,
        offline: true,
        msg: "Saved successfully to local storage (MongoDB is currently disconnected, connect MongoDB to persist permanently)."
      });
    }
    const col = database.collection("settings");
    const existing = await col.findOne({});
    if (existing) {
      await col.updateOne({}, { $set: { adminPassword: newPassword } });
    } else {
      await col.insertOne({
        logoText: "TANTRA PEX",
        logoSubText: "ELEVATE YOUR SKILLS",
        adminPassword: newPassword,
        menuItems: [
          { id: "menu-home", label: "Home", pageId: "home", order: 1, isVisible: true },
          { id: "menu-courses", label: "Courses", pageId: "courses", order: 2, isVisible: true },
          { id: "menu-contact", label: "Contact Us", pageId: "contact", order: 3, isVisible: true }
        ],
        socialMedia: {
          facebook: "https://facebook.com",
          twitter: "https://twitter.com",
          linkedin: "https://linkedin.com",
          instagram: "https://instagram.com",
          youtube: "https://youtube.com"
        }
      });
    }
    res.json({ success: true, msg: "Admin password updated and permanently saved on the MongoDB database!" });
  } catch (error) {
    console.error("Error updating admin password:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/leads/add", async (req, res) => {
  try {
    const database = await getDb();
    const lead = req.body;
    if (database) {
      const col = database.collection("leads");
      await col.insertOne(lead);
      return res.json({ success: true, msg: "Lead stored in MongoDB", data: lead });
    }
    res.json({
      success: false,
      msg: "MongoDB is disconnected. Saved locally on frontend.",
      data: lead
    });
  } catch (error) {
    console.error("Error adding lead:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/workshop-registrations/add", async (req, res) => {
  try {
    const database = await getDb();
    const reg = req.body;
    const { id, name, email, phone, college, branch, year, workshopTitle, pricePaid, transactionId } = reg;
    if (database) {
      const col = database.collection("workshop_registrations");
      await col.insertOne(reg);
    }
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(id || "TPX-REG-TEMP")}`;
    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #0b1329; color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #10b981; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: 800;">TANTRA PEX</h1>
          <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; font-weight: 600; tracking-wider: 1px;">Official Entry Pass & Admit Card</p>
        </div>
        
        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${name}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.5; color: #cbd5e1;">Your seat has been officially reserved for the upcoming masterclass. Below are your verification details and entry pass QR code.</p>
        
        <div style="background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(255,255,255,0.08);">
          <h3 style="color: #10b981; margin: 0 0 15px 0; font-size: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">Registration Details</h3>
          <table style="width: 100%; font-size: 13px; color: #e2e8f0; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; width: 40%;"><strong>Workshop:</strong></td>
              <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${workshopTitle}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Ticket ID:</strong></td>
              <td style="padding: 6px 0; font-family: monospace; font-weight: bold; color: #10b981;">${id}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Transaction ID:</strong></td>
              <td style="padding: 6px 0; font-family: monospace;">${transactionId || "FREE-BYPASS"}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>College:</strong></td>
              <td style="padding: 6px 0;">${college}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Branch & Year:</strong></td>
              <td style="padding: 6px 0;">${branch} (${year})</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Amount Paid:</strong></td>
              <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${pricePaid === 0 ? "FREE" : `\u20B9${pricePaid}`}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 35px 0; padding: 20px; background-color: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.1);">
          <p style="font-weight: bold; font-size: 12px; margin: 0 0 15px 0; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase;">SCAN THIS QR AT THE ENTRANCE</p>
          <img src="${qrUrl}" alt="Ticket QR Code" style="border: 8px solid #ffffff; border-radius: 12px; background-color: #ffffff; width: 180px; height: 180px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);" />
          <p style="font-size: 11px; color: #94a3b8; margin: 15px 0 0 0; font-family: monospace; tracking: 1px;">VERIFIABLE SECURITY QR CODE</p>
        </div>
        
        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; margin-top: 20px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
          <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 12px;">IMPORTANT CANDIDATE INSTRUCTIONS:</h4>
          <ol style="margin: 0; padding-left: 15px;">
            <li style="margin-bottom: 5px;">Please carry a copy of this email or keep your Admit Card PNG handy on your smartphone.</li>
            <li style="margin-bottom: 5px;">Entrance gate closes 15 minutes prior to the scheduled masterclass start time.</li>
            <li style="margin-bottom: 5px;">All workshop assets, templates, and certificates will be unlocked instantly post-session.</li>
          </ol>
        </div>
      </div>
    `;
    const mailResult = await sendEmail({
      to: email,
      toName: name,
      subject: `Admit Card Entry Pass: ${workshopTitle}`,
      html: htmlBody
    });
    const emailLog = {
      id: `EML-${1e4 + Math.floor(Math.random() * 9e4)}`,
      recipientName: name,
      recipientEmail: email,
      subject: `Admit Card Entry Pass: ${workshopTitle}`,
      bodyPreview: `Dear ${name}, your enrollment for ${workshopTitle} is confirmed. Attached is your official Admit Card details. Ticket ID: ${id}. Verification QR enclosed.`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (database) {
      const emailCol = database.collection("emails");
      await emailCol.insertOne(emailLog);
    }
    res.json({
      success: true,
      dbStored: !!database,
      emailSent: mailResult.success,
      emailError: mailResult.error || null,
      emailLog
    });
  } catch (error) {
    console.error("Error creating workshop registration:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.post("/api/plan-purchases/add", async (req, res) => {
  try {
    const database = await getDb();
    const purchase = req.body;
    const { paymentId, orderId, date, planName, amount, studentName, studentEmail } = purchase;
    if (database) {
      const col = database.collection("plan_purchases");
      await col.insertOne(purchase);
    }
    const qrPayload = `Plan: ${planName}
Buyer: ${studentName}
Email: ${studentEmail}
ID: ${paymentId}
Amt: \u20B9${amount}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrPayload)}`;
    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #071b4d; color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
        <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 20px; margin-bottom: 20px;">
          <h1 style="color: #f7c400; margin: 0; font-size: 24px; letter-spacing: 1px; font-weight: 800;">TANTRA PEX</h1>
          <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; font-weight: 600; tracking-wider: 1px;">Subscription Purchase Confirmation</p>
        </div>
        
        <p style="font-size: 15px; line-height: 1.5;">Dear <strong>${studentName}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.5; color: #cbd5e1;">Welcome to Tantra Pex! We are excited to inform you that your purchase of the <strong>${planName}</strong> plan has been confirmed. Your subscription is now fully active.</p>
        
        <div style="background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(255,255,255,0.08);">
          <h3 style="color: #f7c400; margin: 0 0 15px 0; font-size: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">Order Details</h3>
          <table style="width: 100%; font-size: 13px; color: #e2e8f0; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #94a3b8; width: 40%;"><strong>Selected Plan:</strong></td>
              <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">${planName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Payment ID:</strong></td>
              <td style="padding: 6px 0; font-family: monospace; font-weight: bold; color: #f7c400;">${paymentId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Order ID:</strong></td>
              <td style="padding: 6px 0; font-family: monospace;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Amount Paid:</strong></td>
              <td style="padding: 6px 0; font-weight: bold; color: #ffffff;">\u20B9${amount}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;"><strong>Purchase Date:</strong></td>
              <td style="padding: 6px 0;">${date}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 35px 0; padding: 20px; background-color: rgba(255,255,200,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.15);">
          <p style="font-weight: bold; font-size: 12px; margin: 0 0 15px 0; color: #cbd5e1; letter-spacing: 1px; text-transform: uppercase;">OFFICIAL SUBSCRIPTION VERIFICATION QR</p>
          <img src="${qrUrl}" alt="Subscription QR" style="border: 8px solid #ffffff; border-radius: 12px; background-color: #ffffff; width: 180px; height: 180px; box-shadow: 0 4px 10px rgba(0,0,0,0.3);" />
          <p style="font-size: 11px; color: #94a3b8; margin: 15px 0 0 0; font-family: monospace; tracking: 1px;">VERIFIABLE PURCHASE CONFIRMATION</p>
        </div>
        
        <p style="font-size: 13px; line-height: 1.5; color: #cbd5e1;">Your payment grants you full access to our comprehensive placements portal, premium mock assessments, and direct connections with over 250+ hiring partners.</p>
        
        <div style="border-top: 1px solid rgba(255,255,255,0.15); padding-top: 20px; margin-top: 20px; font-size: 12px; color: #94a3b8; text-align: center;">
          Thank you for trusting Tantra Pex to elevate your professional skills! <br/>
          If you have any questions, please reach out to <strong style="color: #ffffff;">support@tantrapex.com</strong>.
        </div>
      </div>
    `;
    const mailResult = await sendEmail({
      to: studentEmail,
      toName: studentName,
      subject: `Plan Purchase Confirmed: ${planName}`,
      html: htmlBody
    });
    const emailLog = {
      id: `EML-${1e4 + Math.floor(Math.random() * 9e4)}`,
      recipientName: studentName,
      recipientEmail: studentEmail,
      subject: `Plan Purchase Confirmed: ${planName}`,
      bodyPreview: `Dear ${studentName}, your purchase of ${planName} plan for \u20B9${amount} is confirmed. Payment ID: ${paymentId}. Confirmation QR enclosed.`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (database) {
      const emailCol = database.collection("emails");
      await emailCol.insertOne(emailLog);
    }
    res.json({
      success: true,
      dbStored: !!database,
      emailSent: mailResult.success,
      emailError: mailResult.error || null,
      emailLog
    });
  } catch (error) {
    console.error("Error creating plan purchase registration:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/api/placement-drives", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.json({ success: true, drives: [], offline: true });
    }
    const driveCol = database.collection("placement_drives");
    const { all } = req.query;
    let filter = {};
    if (all !== "true") {
      const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      filter = {
        status: "published",
        $or: [
          { deadline: { $exists: false } },
          { deadline: "" },
          { deadline: { $gte: todayStr } }
        ]
      };
    }
    const drives = await driveCol.find(filter).sort({ createdAt: -1 }).toArray();
    res.json({
      success: true,
      drives: drives.map(({ _id, ...rest }) => rest)
    });
  } catch (err) {
    console.error("Error fetching placement drives:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/placement-drives/save", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.status(503).json({ success: false, msg: "Database offline. Connect MongoDB to save drives." });
    }
    const drive = req.body;
    if (!drive || !drive.title || !drive.companyId) {
      return res.status(400).json({ success: false, msg: "Drive title and Company ID are required." });
    }
    const driveCol = database.collection("placement_drives");
    const driveId = drive.id || `drive-${Date.now()}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const driveDoc = {
      ...drive,
      driveType: drive.driveType === "on-campus" ? "on-campus" : "off-campus",
      id: driveId,
      updatedAt: now,
      createdAt: drive.createdAt || now
    };
    await driveCol.updateOne(
      { id: driveId },
      { $set: driveDoc },
      { upsert: true }
    );
    res.json({ success: true, msg: "Placement drive saved successfully!", drive: driveDoc });
  } catch (err) {
    console.error("Error saving placement drive:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.delete(["/api/placement-drives/:id", "/api/placement-drives"], async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.status(503).json({ success: false, msg: "Database offline." });
    }
    const id = req.params?.id || req.query?.id || req.body?.id;
    if (!id) {
      return res.status(400).json({ success: false, msg: "Drive ID is required" });
    }
    const driveCol = database.collection("placement_drives");
    await driveCol.deleteOne({ id: String(id) });
    res.json({ success: true, msg: "Placement drive deleted successfully." });
  } catch (err) {
    console.error("Error deleting placement drive:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/placement-applications/submit", async (req, res) => {
  try {
    const database = await getDb();
    const appData = req.body;
    const {
      driveId,
      companyId,
      fullName,
      phone,
      email,
      college,
      degree,
      branch,
      passingYear,
      cgpa,
      tenthMarks,
      twelfthMarks,
      resumeUrl,
      agreedToTerms
    } = appData;
    if (!agreedToTerms) {
      return res.status(400).json({
        success: false,
        msg: "Candidate consent and declaration agreement is required to submit application."
      });
    }
    if (!driveId) {
      return res.status(400).json({ success: false, msg: "Target placement drive ID is missing." });
    }
    const normEmail = (email || appData.dynamicResponses?.email || "").trim().toLowerCase();
    const normPhone = (phone || appData.dynamicResponses?.phone || "").trim().replace(/\D/g, "");
    let drive = null;
    let company = null;
    if (database) {
      const driveCol = database.collection("placement_drives");
      drive = await driveCol.findOne({ id: driveId });
      if (drive) {
        if (drive.status === "closed" || drive.status === "archived") {
          return res.status(400).json({
            success: false,
            msg: "This placement drive has closed and is no longer accepting new applications."
          });
        }
        if (drive.driveType === "on-campus") {
          return res.status(403).json({
            success: false,
            msg: "This placement drive is an On-Campus recruitment drive exclusive to enrolled/partner students. Direct public web applications are not accepted for this drive."
          });
        }
        if (drive.deadline) {
          const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
          if (today > drive.deadline) {
            return res.status(400).json({
              success: false,
              msg: "The application deadline for this placement drive has passed."
            });
          }
        }
      }
      const appCol = database.collection("placement_applications");
      const existing = await appCol.findOne({
        driveId,
        $or: [{ email: normEmail }, { phone: normPhone }]
      });
      if (existing) {
        return res.status(409).json({
          success: false,
          duplicate: true,
          msg: "You have already submitted an application for this placement drive.",
          existingRefId: existing.id
        });
      }
      const targetCompanyId = drive?.companyId || companyId;
      if (targetCompanyId) {
        const partnerCol = database.collection("hiring_partners");
        company = await partnerCol.findOne({ id: targetCompanyId });
      }
    }
    if (drive && Array.isArray(drive.formFields) && drive.formFields.length > 0) {
      for (const field of drive.formFields) {
        if (field.enabled !== false && field.required) {
          if (field.type === "file") {
            const hasFile = field.id === "resume" && (resumeUrl || appData.resumeUrl) || field.id === "photo" && (appData.photoUrl || appData.photoFile) || Array.isArray(appData.uploadedFiles) && appData.uploadedFiles.some((f) => (f.fieldId === field.id || f.label === field.label) && f.url);
            if (!hasFile) {
              return res.status(400).json({
                success: false,
                msg: `Please upload the required file: ${field.label}`
              });
            }
          } else {
            let val = appData[field.id];
            if (val === void 0 || val === null || String(val).trim() === "") {
              val = appData.dynamicResponses?.[field.id] ?? appData.dynamicResponses?.[field.label];
            }
            if (val === void 0 || val === null || String(val).trim() === "") {
              return res.status(400).json({
                success: false,
                msg: `Required field missing: ${field.label}`
              });
            }
          }
        }
      }
    } else {
      if (!fullName || !phone || !email || !college || !degree || !branch || !passingYear || !tenthMarks || !twelfthMarks || !cgpa || !resumeUrl) {
        return res.status(400).json({
          success: false,
          msg: "All required academic, contact, and resume fields must be provided."
        });
      }
    }
    const appId = `TPX-APP-${Date.now().toString(36).toUpperCase()}-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const applicationRecord = {
      id: appId,
      companyId: drive?.companyId || companyId || "",
      driveId,
      companyName: company?.name || drive?.companyName || "",
      driveTitle: drive?.title || appData.driveTitle || "",
      fullName: fullName || appData.dynamicResponses?.fullName || "Candidate",
      phone: normPhone,
      email: normEmail,
      city: appData.city || appData.dynamicResponses?.city || "",
      photoUrl: appData.photoUrl || "",
      photoPublicId: appData.photoPublicId || "",
      college: college || appData.dynamicResponses?.college || "",
      degree: degree || appData.dynamicResponses?.degree || "",
      branch: branch || appData.dynamicResponses?.branch || "",
      passingYear: passingYear || appData.dynamicResponses?.passingYear || "",
      cgpa: cgpa || appData.dynamicResponses?.cgpa || "",
      sgpa: appData.sgpa || appData.dynamicResponses?.sgpa || "",
      tenthMarks: tenthMarks || appData.dynamicResponses?.tenthMarks || "",
      twelfthMarks: twelfthMarks || appData.dynamicResponses?.twelfthMarks || "",
      resumeUrl: resumeUrl || "",
      resumeFileName: appData.resumeFileName || "Candidate_Resume.pdf",
      resumePublicId: appData.resumePublicId || "",
      experienceStatus: appData.experienceStatus || appData.dynamicResponses?.experienceStatus || "fresher",
      experienceDuration: appData.experienceDuration || appData.dynamicResponses?.experienceDuration || "",
      experienceUnit: appData.experienceUnit || "years",
      designation: appData.designation || appData.dynamicResponses?.designation || "",
      previousOrganization: appData.previousOrganization || appData.dynamicResponses?.previousOrganization || "",
      experienceSummary: appData.experienceSummary || appData.dynamicResponses?.experienceSummary || "",
      skills: appData.skills || appData.dynamicResponses?.skills || "",
      dynamicResponses: appData.dynamicResponses || {},
      uploadedFiles: Array.isArray(appData.uploadedFiles) ? appData.uploadedFiles : [],
      agreedToTerms: true,
      status: "Submitted",
      emailDeliveryStatus: "skipped",
      emailDeliveryError: null,
      createdAt: now,
      updatedAt: now
    };
    if (database) {
      const appCol = database.collection("placement_applications");
      await appCol.insertOne(applicationRecord);
    }
    let emailDeliveryStatus = "skipped";
    let emailDeliveryError = null;
    const emailNotificationsEnabled = company ? company.emailNotificationsEnabled !== false : true;
    if (!emailNotificationsEnabled) {
      emailDeliveryStatus = "skipped";
      console.log(`[Email Control] Automated email skipped for company "${company?.name || companyId}" (Notifications Disabled by Admin).`);
    } else {
      const companyDisplayName = company?.name || drive?.companyName || "Corporate Placement Partner";
      const driveRoleName = drive?.title || appData.driveTitle || "Placement Drive";
      const confirmationHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 28px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #111111;">
          <div style="border-bottom: 2px solid #2e6c00; padding-bottom: 16px; margin-bottom: 20px;">
            <h1 style="color: #2e6c00; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.02em;">TANTRAPEX TECHNOLOGIES</h1>
            <p style="color: #64748b; margin: 4px 0 0 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">India's 1st Private Placement Cell \u2022 Free Application Confirmation</p>
          </div>

          <p style="font-size: 15px; line-height: 1.5; color: #111111;">Dear <strong>${fullName}</strong>,</p>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Your application for the <strong>${driveRoleName}</strong> placement drive at <strong>${companyDisplayName}</strong> has been successfully received and registered in our placement network.
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <table style="width: 100%; font-size: 13px; color: #334155; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 42%;"><strong>Reference ID:</strong></td>
                <td style="padding: 6px 0; font-weight: bold; font-family: monospace; color: #2e6c00; font-size: 14px;">${appId}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Hiring Partner:</strong></td>
                <td style="padding: 6px 0; font-weight: bold; color: #111111;">${companyDisplayName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Applied Role:</strong></td>
                <td style="padding: 6px 0; font-weight: bold; color: #111111;">${driveRoleName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>College / Batch:</strong></td>
                <td style="padding: 6px 0;">${college} (${passingYear})</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;"><strong>Application Fee:</strong></td>
                <td style="padding: 6px 0; font-weight: bold; color: #16a34a;">\u20B90 (100% Free Application)</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #475569;">
            <strong>Next Steps:</strong> The hiring team will screen applications based on academic criteria and role competencies. Further evaluation rounds, aptitude links, or interview schedules will be dispatched via email and WhatsApp.
          </p>

          <div style="margin: 22px 0; padding: 16px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold; color: #166534;">Join the Official TantraPex Placement Updates Community (Optional)</p>
            <a href="https://chat.whatsapp.com/tantrapex-placements" style="display: inline-block; background-color: #2e6c00; color: #ffffff; padding: 9px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: bold;">
              Join WhatsApp Updates Channel
            </a>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #94a3b8; text-align: center; line-height: 1.5;">
            TantraPex Technologies Pvt Ltd \u2022 Institutional Placement Desk<br/>
            Email: contact@tantrapex.com \u2022 Bangalore / Bhopal HQ
          </div>
        </div>
      `;
      try {
        const mailRes = await sendEmail({
          to: normEmail,
          toName: fullName,
          subject: `Placement Application Received: ${driveRoleName} - ${companyDisplayName}`,
          html: confirmationHtml
        });
        if (mailRes.success) {
          emailDeliveryStatus = "sent";
        } else {
          emailDeliveryStatus = "failed";
          emailDeliveryError = mailRes.error || mailRes.msg || null;
        }
      } catch (mailErr) {
        console.error("Non-fatal email delivery error:", mailErr.message);
        emailDeliveryStatus = "failed";
        emailDeliveryError = mailErr.message;
      }
    }
    if (database) {
      const appCol = database.collection("placement_applications");
      await appCol.updateOne({ id: appId }, { $set: { emailDeliveryStatus, emailDeliveryError } });
      const emailCol = database.collection("emails");
      await emailCol.insertOne({
        id: `EML-APP-${Date.now().toString(36)}`,
        recipientName: fullName,
        recipientEmail: normEmail,
        subject: `Placement Application Confirmation: ${appId}`,
        companyId: applicationRecord.companyId,
        driveId,
        status: emailDeliveryStatus,
        error: emailDeliveryError,
        timestamp: now
      });
    }
    res.json({
      success: true,
      applicationReferenceId: appId,
      emailDeliveryStatus,
      emailError: emailDeliveryError,
      application: {
        ...applicationRecord,
        emailDeliveryStatus,
        emailDeliveryError
      }
    });
  } catch (err) {
    console.error("Error submitting placement application:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.get("/api/placement-applications", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.json({ success: true, applications: [], offline: true });
    }
    const { companyId, driveId, status, search } = req.query;
    const query = {};
    if (companyId) query.companyId = String(companyId);
    if (driveId) query.driveId = String(driveId);
    if (status && status !== "all") query.status = String(status);
    if (search) {
      const regex = new RegExp(String(search), "i");
      query.$or = [
        { fullName: regex },
        { email: regex },
        { phone: regex },
        { college: regex },
        { id: regex }
      ];
    }
    const appCol = database.collection("placement_applications");
    const applications = await appCol.find(query).sort({ createdAt: -1 }).toArray();
    res.json({
      success: true,
      total: applications.length,
      applications: applications.map(({ _id, ...rest }) => rest)
    });
  } catch (err) {
    console.error("Error querying placement applications:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/placement-applications/update-status", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.status(503).json({ success: false, msg: "Database offline." });
    }
    const { id, applicationId, status } = req.body || {};
    const targetId = id || applicationId;
    if (!targetId || !status) {
      return res.status(400).json({ success: false, msg: "Application ID and new status required." });
    }
    const appCol = database.collection("placement_applications");
    const result = await appCol.updateOne(
      { id: targetId },
      { $set: { status, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } }
    );
    res.json({ success: true, msg: "Application status updated successfully!", matched: result.matchedCount });
  } catch (err) {
    console.error("Error updating application status:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/companies/toggle-email", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.status(503).json({ success: false, msg: "Database offline." });
    }
    const { companyId, enabled } = req.body;
    if (!companyId) {
      return res.status(400).json({ success: false, msg: "Company ID is required." });
    }
    const partnerCol = database.collection("hiring_partners");
    await partnerCol.updateOne(
      { id: companyId },
      { $set: { emailNotificationsEnabled: Boolean(enabled), updatedAt: (/* @__PURE__ */ new Date()).toISOString() } }
    );
    res.json({
      success: true,
      companyId,
      emailNotificationsEnabled: Boolean(enabled),
      msg: `Automated candidate email notifications for company ${enabled ? "ENABLED" : "DISABLED"} successfully.`
    });
  } catch (err) {
    console.error("Error updating company email settings:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.get("/api/export-applications-excel", async (req, res) => {
  try {
    const database = await getDb();
    if (!database) {
      return res.status(503).json({ success: false, msg: "Database offline. Cannot export." });
    }
    const { companyId, driveId } = req.query;
    const query = {};
    if (companyId) query.companyId = String(companyId);
    if (driveId) query.driveId = String(driveId);
    const appCol = database.collection("placement_applications");
    const apps = await appCol.find(query).sort({ createdAt: -1 }).toArray();
    let targetName = "TantraPex";
    if (companyId) {
      const partnerCol = database.collection("hiring_partners");
      const comp = await partnerCol.findOne({ id: String(companyId) });
      if (comp && comp.name) targetName = comp.name.replace(/[^a-zA-Z0-9]/g, "_");
    }
    const columns = [
      { header: "Application ID", key: "id", width: 22 },
      { header: "Company ID", key: "companyId", width: 18 },
      { header: "Company Name", key: "companyName", width: 24 },
      { header: "Drive ID", key: "driveId", width: 18 },
      { header: "Job Role", key: "driveTitle", width: 26 },
      { header: "Candidate Name", key: "fullName", width: 24 },
      { header: "Phone", key: "phone", width: 16 },
      { header: "Email", key: "email", width: 28 },
      { header: "Current City", key: "city", width: 18 },
      { header: "College", key: "college", width: 30 },
      { header: "Degree", key: "degree", width: 16 },
      { header: "Branch", key: "branch", width: 20 },
      { header: "Passing Batch", key: "passingYear", width: 16 },
      { header: "Current CGPA", key: "cgpa", width: 14 },
      { header: "Semester SGPA", key: "sgpa", width: 14 },
      { header: "10th Marks / %", key: "tenthMarks", width: 16 },
      { header: "12th Marks / %", key: "twelfthMarks", width: 16 },
      { header: "Experience Status", key: "experienceStatus", width: 18 },
      { header: "Total Experience", key: "totalExperience", width: 18 },
      { header: "Organization", key: "previousOrganization", width: 22 },
      { header: "Designation", key: "designation", width: 20 },
      { header: "Skills", key: "skills", width: 32 },
      { header: "Application Status", key: "status", width: 20 },
      { header: "Applied Date", key: "appliedDate", width: 22 },
      { header: "Resume Download URL", key: "resumeUrl", width: 36 },
      { header: "Photo URL", key: "photoUrl", width: 36 }
    ];
    const dynamicFieldKeys = /* @__PURE__ */ new Set();
    apps.forEach((app2) => {
      if (app2.dynamicResponses && typeof app2.dynamicResponses === "object") {
        Object.keys(app2.dynamicResponses).forEach((k) => {
          if (!["fullName", "phone", "email", "college", "degree", "branch", "passingYear", "cgpa", "tenthMarks", "twelfthMarks"].includes(k)) {
            dynamicFieldKeys.add(k);
          }
        });
      }
      if (Array.isArray(app2.uploadedFiles)) {
        app2.uploadedFiles.forEach((f) => {
          if (f.label) dynamicFieldKeys.add(`File: ${f.label}`);
        });
      }
    });
    dynamicFieldKeys.forEach((k) => {
      columns.push({ header: k, key: `dyn_${k}`, width: 26 });
    });
    const formattedRows = apps.map((app2) => {
      const baseRow = {
        id: app2.id || "",
        companyId: app2.companyId || "",
        companyName: app2.companyName || "",
        driveId: app2.driveId || "",
        driveTitle: app2.driveTitle || "",
        fullName: app2.fullName || "",
        phone: app2.phone || "",
        email: app2.email || "",
        city: app2.city || "",
        college: app2.college || "",
        degree: app2.degree || "",
        branch: app2.branch || "",
        passingYear: app2.passingYear || "",
        cgpa: app2.cgpa || "",
        sgpa: app2.sgpa || "",
        tenthMarks: app2.tenthMarks || "",
        twelfthMarks: app2.twelfthMarks || "",
        experienceStatus: app2.experienceStatus || "fresher",
        totalExperience: app2.experienceStatus === "experienced" ? `${app2.experienceDuration || ""} ${app2.experienceUnit || ""}`.trim() : "Fresher",
        previousOrganization: app2.previousOrganization || "",
        designation: app2.designation || "",
        skills: app2.skills || "",
        status: app2.status || "Submitted",
        appliedDate: app2.createdAt ? new Date(app2.createdAt).toLocaleString("en-IN") : "",
        resumeUrl: app2.resumeUrl || "",
        photoUrl: app2.photoUrl || ""
      };
      dynamicFieldKeys.forEach((k) => {
        if (k.startsWith("File: ")) {
          const label = k.replace("File: ", "");
          const file = app2.uploadedFiles?.find((f) => f.label === label);
          baseRow[`dyn_${k}`] = file?.url || "";
        } else {
          baseRow[`dyn_${k}`] = app2.dynamicResponses?.[k] || "";
        }
      });
      return baseRow;
    });
    const xlsxBuffer = buildXlsxBuffer(columns, formattedRows, `${targetName}_Applicants`);
    const fileName = `TantraPex_${targetName}_Applications_${Date.now()}.xlsx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.send(xlsxBuffer);
  } catch (err) {
    console.error("Error exporting applications to Excel:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.post("/api/upload-document", async (req, res) => {
  try {
    const { data, fileName = "document.pdf", folder = "Tantrapex/Applications" } = req.body || {};
    if (!data) {
      return res.status(400).json({ success: false, message: "Missing file payload." });
    }
    if (data.length > 14 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: "File exceeds 10MB maximum allowed upload limit." });
    }
    const isPdf = data.startsWith("data:application/pdf") || typeof fileName === "string" && fileName.toLowerCase().endsWith(".pdf");
    const isImage = data.startsWith("data:image/") || typeof fileName === "string" && /\.(png|jpe?g|webp|gif)$/i.test(fileName);
    const isOtherDoc = typeof fileName === "string" && /\.(docx?|zip|txt|csv)$/i.test(fileName);
    if (!isPdf && !isImage && !isOtherDoc) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file format. Only PDF, Images (PNG, JPG, WEBP), DOC/DOCX, and ZIP documents (up to 10MB) are allowed."
      });
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.json({
        success: true,
        offline: true,
        url: data,
        public_id: `local-${Date.now()}`,
        fileName
      });
    }
    const cleanName = (fileName || `doc_${Date.now()}`).replace(/[^a-zA-Z0-9.-]/g, "_");
    const uploadOptions = {
      folder,
      overwrite: false,
      resource_type: isImage ? "image" : "raw",
      public_id: `${Date.now()}_${cleanName}`
    };
    const result = await import_cloudinary.v2.uploader.upload(data, uploadOptions);
    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      fileName
    });
  } catch (err) {
    console.error("Upload to Cloudinary failed:", err);
    res.status(500).json({ success: false, message: err.message || String(err) });
  }
});
var app_default = app;

// server.ts
var PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app_default.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app_default.use(import_express2.default.static(distPath));
    app_default.get("*all", (_req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app_default.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
