// ── Digital Sunil — Contact Form → Google Sheets ──────────────────────────
// Paste this entire file into Apps Script (script.google.com → New project)
// then deploy as a Web App (Execute as: Me, Access: Anyone).

var SHEET_URL = 'PASTE_YOUR_GOOGLE_SHEET_URL_HERE';
var SHEET_NAME = 'Leads';   // Tab name — will be created automatically if missing

// ── Column headers (written on first run) ─────────────────────────────────
var HEADERS = ['Timestamp', 'Name', 'Email', 'Phone', 'Service', 'Message'];

// ── Entry point called by the fetch() in script.js ────────────────────────
function doPost(e) {
  try {
    var ss    = SpreadsheetApp.openByUrl(SHEET_URL);
    var sheet = getOrCreateSheet(ss, SHEET_NAME);

    // Write headers if the sheet is brand-new / empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length)
           .setFontWeight('bold')
           .setBackground('#1e293b')
           .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    // Pull values from form fields (names must match HTML name="" attributes)
    var p = e.parameter || {};
    sheet.appendRow([
      new Date(),
      p.Name    || '',
      p.Email   || '',
      p.Phone   || '',
      p.Service || '',
      p.Message || ''
    ]);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, HEADERS.length);

    return ok('Form submission saved.');

  } catch (err) {
    return fail(err.toString());
  }
}

// ── GET handler — lets you test the URL in a browser ──────────────────────
function doGet() {
  return ContentService
    .createTextOutput('Digital Sunil contact script is live ✓')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ── Helpers ───────────────────────────────────────────────────────────────
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function ok(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success', message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}

function fail(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'error', message: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
