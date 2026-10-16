import zlib from "zlib";
/**
 * Formula injection sanitizer.
 * Disables dynamic formula execution in Microsoft Excel and Google Sheets
 * if cell text begins with =, +, -, @, or tabs.
 */
export function sanitizeCell(val) {
    if (val === null || val === undefined)
        return "";
    let str = String(val).trim();
    if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str;
    }
    return str;
}
function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case "<": return "&lt;";
            case ">": return "&gt;";
            case "&": return "&amp;";
            case "'": return "&apos;";
            case '"': return "&quot;";
            default: return c;
        }
    });
}
function getColumnLetter(colIndex) {
    let letter = "";
    while (colIndex >= 0) {
        letter = String.fromCharCode((colIndex % 26) + 65) + letter;
        colIndex = Math.floor(colIndex / 26) - 1;
    }
    return letter;
}
/**
 * Creates a raw OpenXML .xlsx document as a Node.js Buffer
 * using built-in zlib for standard ZIP container creation.
 */
export function buildXlsxBuffer(columnsOrRows, rowsOrSheetName, sheetNameParam = "Applications") {
    let columns = [];
    let rows = [];
    let sheetName = sheetNameParam;
    if (Array.isArray(columnsOrRows) && columnsOrRows.length > 0 && "header" in columnsOrRows[0]) {
        columns = columnsOrRows;
        rows = Array.isArray(rowsOrSheetName) ? rowsOrSheetName : [];
        sheetName = typeof sheetNameParam === "string" ? sheetNameParam : "Applications";
    }
    else if (Array.isArray(columnsOrRows)) {
        rows = columnsOrRows;
        sheetName = typeof rowsOrSheetName === "string" ? rowsOrSheetName : "Applications";
        const sample = rows[0] || {};
        columns = Object.keys(sample).map(k => ({
            header: k.charAt(0).toUpperCase() + k.slice(1),
            key: k,
            width: Math.max(k.length + 4, 16)
        }));
    }
    else {
        columns = [];
        rows = [];
    }
    const sanitizedSheetName = sheetName.replace(/[:\\/?*\[\]]/g, "_").substring(0, 31) || "Applications";
    // 1. Build sheet1.xml
    let sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n`;
    sheetXml += `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">\n`;
    // Column widths
    sheetXml += `  <cols>\n`;
    columns.forEach((col, idx) => {
        const width = col.width || Math.max(col.header.length + 4, 14);
        sheetXml += `    <col min="${idx + 1}" max="${idx + 1}" width="${width}" customWidth="1"/>\n`;
    });
    sheetXml += `  </cols>\n`;
    // Sheet Data
    sheetXml += `  <sheetData>\n`;
    // Header Row (Row 1) - style 1 (Bold Header)
    sheetXml += `    <row r="1" ht="26" customHeight="1">\n`;
    columns.forEach((col, colIdx) => {
        const cellRef = `${getColumnLetter(colIdx)}1`;
        const escapedVal = escapeXml(col.header);
        sheetXml += `      <c r="${cellRef}" t="inlineStr" s="1"><is><t>${escapedVal}</t></is></c>\n`;
    });
    sheetXml += `    </row>\n`;
    // Data Rows (Row 2 onwards) - style 2 (Regular cell)
    rows.forEach((row, rowIdx) => {
        const rNum = rowIdx + 2;
        sheetXml += `    <row r="${rNum}" ht="20" customHeight="1">\n`;
        columns.forEach((col, colIdx) => {
            const cellRef = `${getColumnLetter(colIdx)}${rNum}`;
            const rawVal = row[col.key];
            const sanitized = sanitizeCell(rawVal);
            const escapedVal = escapeXml(sanitized);
            sheetXml += `      <c r="${cellRef}" t="inlineStr" s="2"><is><t>${escapedVal}</t></is></c>\n`;
        });
        sheetXml += `    </row>\n`;
    });
    sheetXml += `  </sheetData>\n`;
    sheetXml += `</worksheet>`;
    // 2. Build styles.xml
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
    // 3. Build workbook.xml
    const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${escapeXml(sanitizedSheetName)}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`;
    // 4. Build _rels/.rels
    const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
    // 5. Build xl/_rels/workbook.xml.rels
    const workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;
    // 6. Build [Content_Types].xml
    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;
    // Files map for zip container
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
/**
 * Standard ZIP archiver in pure Node.js Buffer manipulation.
 * Implements standard PKZIP 2.0 format compatible with all spreadsheet readers.
 */
function createZipArchive(files) {
    const localHeaders = [];
    const centralDirectoryHeaders = [];
    let offset = 0;
    for (const file of files) {
        const fileNameBuf = Buffer.from(file.path, "utf-8");
        const uncompressedData = file.data;
        const uncompressedSize = uncompressedData.length;
        const crc = computeCrc32(uncompressedData);
        // Deflate with raw zlib
        const compressedData = zlib.deflateRawSync(uncompressedData, { level: 6 });
        const compressedSize = compressedData.length;
        // Local file header (30 bytes + filename + data)
        const localHeader = Buffer.alloc(30);
        localHeader.writeUInt32LE(0x04034b50, 0); // Local header signature
        localHeader.writeUInt16LE(20, 4); // Version needed: 2.0
        localHeader.writeUInt16LE(0, 6); // General purpose bit flag
        localHeader.writeUInt16LE(8, 8); // Compression method: 8 (Deflate)
        localHeader.writeUInt16LE(0, 10); // Last mod time
        localHeader.writeUInt16LE(0, 12); // Last mod date
        localHeader.writeUInt32LE(crc, 14); // CRC-32
        localHeader.writeUInt32LE(compressedSize, 18); // Compressed size
        localHeader.writeUInt32LE(uncompressedSize, 22); // Uncompressed size
        localHeader.writeUInt16LE(fileNameBuf.length, 26); // File name length
        localHeader.writeUInt16LE(0, 28); // Extra field length
        const fullLocalRecord = Buffer.concat([localHeader, fileNameBuf, compressedData]);
        localHeaders.push(fullLocalRecord);
        // Central directory header (46 bytes + filename)
        const centralHeader = Buffer.alloc(46);
        centralHeader.writeUInt32LE(0x02014b50, 0); // Central header signature
        centralHeader.writeUInt16LE(20, 4); // Version made by: 2.0
        centralHeader.writeUInt16LE(20, 6); // Version needed: 2.0
        centralHeader.writeUInt16LE(0, 8); // General purpose bit flag
        centralHeader.writeUInt16LE(8, 10); // Compression method: 8 (Deflate)
        centralHeader.writeUInt16LE(0, 12); // Last mod time
        centralHeader.writeUInt16LE(0, 14); // Last mod date
        centralHeader.writeUInt32LE(crc, 16); // CRC-32
        centralHeader.writeUInt32LE(compressedSize, 20); // Compressed size
        centralHeader.writeUInt32LE(uncompressedSize, 24); // Uncompressed size
        centralHeader.writeUInt16LE(fileNameBuf.length, 28); // File name length
        centralHeader.writeUInt16LE(0, 30); // Extra field length
        centralHeader.writeUInt16LE(0, 32); // File comment length
        centralHeader.writeUInt16LE(0, 34); // Disk number start
        centralHeader.writeUInt16LE(0, 36); // Internal file attributes
        centralHeader.writeUInt32LE(0, 38); // External file attributes
        centralHeader.writeUInt32LE(offset, 42); // Relative offset of local header
        const fullCentralRecord = Buffer.concat([centralHeader, fileNameBuf]);
        centralDirectoryHeaders.push(fullCentralRecord);
        offset += fullLocalRecord.length;
    }
    const centralDirBuf = Buffer.concat(centralDirectoryHeaders);
    const centralDirSize = centralDirBuf.length;
    const centralDirOffset = offset;
    // End of central directory record (22 bytes)
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0); // End of central dir signature
    eocd.writeUInt16LE(0, 4); // Number of this disk
    eocd.writeUInt16LE(0, 6); // Disk with start of central directory
    eocd.writeUInt16LE(files.length, 8); // Total entries on this disk
    eocd.writeUInt16LE(files.length, 10); // Total entries
    eocd.writeUInt32LE(centralDirSize, 12); // Size of central directory
    eocd.writeUInt32LE(centralDirOffset, 16); // Offset of central directory
    eocd.writeUInt16LE(0, 20); // ZIP comment length
    return Buffer.concat([...localHeaders, centralDirBuf, eocd]);
}
// CRC-32 table computation
const crc32Table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crc32Table[i] = c;
}
function computeCrc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
        crc = crc32Table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
}
//# sourceMappingURL=server-excel.js.map