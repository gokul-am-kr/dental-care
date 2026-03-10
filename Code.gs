// ═══════════════════════════════════════════════════════
//  Chempakasseril Dental Care — Google Apps Script
//  Paste this entire file into your Apps Script editor
//  and deploy it as a Web App.
// ═══════════════════════════════════════════════════════

// ── CONFIG ──────────────────────────────────────────────
// Replace with your Google Sheet ID (from the sheet URL)
// URL looks like: https://docs.google.com/spreadsheets/d/SHEET_ID/edit
const SHEET_ID   = '1l5UvW8fBvcTLnOEg6nxnYXbXw0yNSASKlxhyU694j8g';
const SHEET_NAME = 'Appointments'; // name of the tab/sheet


// ── doPost ───────────────────────────────────────────────
// Called every time the website form is submitted
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss    = SpreadsheetApp.openById(SHEET_ID);
    let   sheet = ss.getSheetByName(SHEET_NAME);

    // Create the sheet & header row if it doesn't exist yet
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp',
        'Name',
        'Phone',
        'Email',
        'Service',
        'Message',
        'Status',
      ]);

      // Style header row
      const header = sheet.getRange(1, 1, 1, 7);
      header.setFontWeight('bold');
      header.setBackground('#0ea5e9');
      header.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
      sheet.setColumnWidths(1, 7, 160);
    }

    // Append the new appointment row
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.name    || '',
      data.phone   || '',
      data.email   || '',
      data.service || '',
      data.message || '',
      'New',          // default status — change to Confirmed / Cancelled manually
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


// ── doGet ────────────────────────────────────────────────
// Simple health-check — visit the web app URL in a browser
// to confirm deployment is working
function doGet() {
  return ContentService
    .createTextOutput('Chempakasseril Dental Care — Appointments endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
