/**
 * ============================================================
 *  Shivangi & Shrijeet Wedding — Google backend (Apps Script)
 * ============================================================
 *  This one small script is the "back office" of the website.
 *  It runs inside YOUR Google account, so:
 *    • RSVPs      -> new rows in the "RSVP" tab of your Google Sheet (live)
 *    • Blessings  -> new rows in the "Blessings" tab (live)
 *    • Photos     -> saved in a Google Drive folder (uses your own 15 GB)
 *
 *  Nothing to edit in this file. Just follow GUIDE-1-GOOGLE-SETUP.md.
 * ============================================================
 */

var ROOT_FOLDER_NAME = 'Shrijeet & Shivangi - Wedding Photos';
var TIMEZONE = 'Asia/Kolkata';
var MAX_PHOTO_BASE64 = 14 * 1024 * 1024;   // ~10 MB photo after base64
var MAX_FACES_PER_PHOTO = 25;


// Functions a wedding-day guest may RSVP for (must match the event names in siteConfig.js)
var WEDDING_DAY_EVENTS = ['Varmala & Shaadi'];
// Every function, in order (must match the event names in siteConfig.js) — used for the per-function totals
var ALL_EVENTS = ['Faldaan', 'Mehndi', 'Engagement & Sangeet', 'Haldi', 'Varmala & Shaadi'];

var TABS = {
  RSVP: [
    'Last Updated', 'First Submitted', 'Main Guest', 'Phone', 'Attending',
    'Men', 'Women', 'Children', 'Total Guests', 'Arrival Date', 'Needs Room',
    'Anything Else', 'Invite Type', 'Functions', 'Times Updated'
  ],
  Blessings: ['Last Updated', 'First Submitted', 'Name', 'Blessing', 'Times Edited', 'Device ID'],
  Photos: ['Uploaded At', 'File ID', 'Celebration', 'File Name', 'Faces Found'],
  Faces: ['File ID', 'Face Data (do not edit)']
};

/* ------------------------------------------------------------------ */
/*  ONE-TIME SETUP  (run once from the editor: choose "setup" > Run)   */
/* ------------------------------------------------------------------ */
function setup() {
  var ss = SpreadsheetApp.getActive();
  try { ss.setSpreadsheetTimeZone(TIMEZONE); } catch (e) {}
  Object.keys(TABS).forEach(function (name) { if (name === 'RSVP') rsvpSheet_(); else getTab_(name); });

  var extra = ss.getSheetByName('Sheet1');
  if (extra && extra.getLastRow() === 0 && ss.getSheets().length > 1) {
    try { ss.deleteSheet(extra); } catch (e) {}
  }

  var folder = getRootFolder_();
  Logger.log('READY. Photos folder: ' + folder.getUrl());
  Logger.log('Now click Deploy > New deployment > Web app (see GUIDE-1-GOOGLE-SETUP.md).');
}

/* ------------------------------------------------------------------ */
/*  Runs by itself every time the Google Sheet is opened:               */
/*  makes sure the RSVP + RSVP Summary tabs exist and adds a            */
/*  "Wedding" menu at the top of the sheet.                             */
/* ------------------------------------------------------------------ */
function onOpen() {
  try { rsvpSheet_(); } catch (e) {}
  try {
    SpreadsheetApp.getUi().createMenu('Wedding')
      .addItem('Rebuild RSVP Summary', 'rebuildSummary')
      .addItem('Remove deleted photos from the sheet', 'removeDeletedPhotos')
      .addToUi();
  } catch (e) {}
}

// Deletes and re-creates the RSVP Summary tab (safe: it only holds formulas).
function rebuildSummary() {
  var ss = SpreadsheetApp.getActive();
  var old = ss.getSheetByName('RSVP Summary');
  if (old) old.getRange(1, 1).setValue('');
  rsvpSheet_();
  ss.setActiveSheet(ss.getSheetByName('RSVP Summary'));
}

/* ------------------------------------------------------------------ */
/*  Web endpoints                                                       */
/* ------------------------------------------------------------------ */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    switch (body.action) {
      case 'rsvp':     return json_(handleRsvp_(body));
      case 'blessing': return json_(handleBlessing_(body));
      case 'upload':   return json_(handleUpload_(body));
      default:         return json_({ success: false, message: 'Unknown request.' });
    }
  } catch (err) {
    Logger.log('doPost error: ' + err + (err && err.stack ? '\n' + err.stack : ''));
    return json_({ success: false, message: 'Sorry, something went wrong. Please try again.' });
  }
}

function doGet(e) {
  try {
    var action = (e && e.parameter && e.parameter.action) || 'ping';
    if (action === 'photos') return json_(listPhotos_());
    if (action === 'faces')  return json_(listFaces_());
    return json_({ success: true, message: 'Wedding backend is running.' });
  } catch (err) {
    Logger.log('doGet error: ' + err);
    return json_({ success: false, message: 'Could not load data.' });
  }
}

/* ------------------------------------------------------------------ */
/*  RSVP  — one row per phone number; sending again UPDATES that row    */
/* ------------------------------------------------------------------ */
function handleRsvp_(b) {
  var name = clean_(b.contactName, 120);
  var phoneKey = phoneKey_(b.phone);
  if (!name) return { success: false, message: 'Please enter your name.' };
  if (phoneKey.length < 10) return { success: false, message: 'Please enter a valid 10-digit mobile number.' };

  // Wedding-day guests (from the /invite/shubh-vivah link) can only RSVP for the wedding itself.
  var tier = String(b.inviteType) === 'full' ? 'full' : 'wedding';
  var list = Array.isArray(b.eventsAttending) ? b.eventsAttending.map(function (x) { return clean_(x, 80); }).filter(String) : [];
  if (tier === 'wedding') {
    list = list.filter(function (x) { return WEDDING_DAY_EVENTS.indexOf(x) >= 0; });
    if (!list.length) list = WEDDING_DAY_EVENTS.slice();
  }
  var attending = String(b.attending) === 'no' ? 'No' : 'Yes';
  var men = num_(b.men), women = num_(b.women), kids = num_(b.children);
  var now = new Date(), note = null;
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var sheet = rsvpSheet_();
    var n = TABS.RSVP.length;
    var row = findRow_(sheet, 4, phoneKey, function (v) { return phoneKey_(v); });
    var first = now, times = 1, typeLabel = tier === 'full' ? '3-day' : 'Wedding day';
    if (row) {
      var old = sheet.getRange(row, 1, 1, n).getValues()[0];
      first = old[1] || now;
      times = (Number(old[14]) || 1) + 1;
      if (String(old[12]) === '3-day') typeLabel = '3-day';   // invited for 3 days stays 3-day
    }
    var yes = attending === 'Yes';
    var values = [
      now, first, name, '', attending,
      yes ? men : '', yes ? women : '', yes ? kids : '', yes ? men + women + kids : 0,
      yes ? clean_(b.arrivalDate, 20) : '', yes ? yesNo_(b.accommodation) : '',
      clean_(b.notes, 1000), typeLabel, yes ? list.join(' | ') : '', times
    ];
    if (!row) { sheet.appendRow(values); row = sheet.getLastRow(); }
    else sheet.getRange(row, 1, 1, n).setValues([values]);
    sheet.getRange(row, 4).setNumberFormat('@').setValue(phoneKey);
    sheet.getRange(row, 10).setNumberFormat('@').setValue(values[9]);
    note = [(times > 1 ? 'RSVP updated: ' : 'New RSVP: ') + name + (yes ? '' : ' (cannot come)'),
      name + ' | ' + phoneKey + ' | ' + typeLabel + ' | ' + (yes ? 'Coming: ' + (men + women + kids) + ' (M ' + men + ', W ' + women + ', C ' + kids + ')\nArrival: ' + values[9] + '  Room: ' + values[10] : 'Cannot attend')];
    return { success: true, updated: times > 1, message: times > 1 ? 'RSVP updated.' : 'RSVP saved.' };
  } finally {
    lock.releaseLock();
    if (note) notify_(note[0], note[1]);
  }
}

// The RSVP tab in the new layout. An older tab with different columns is kept as "RSVP (old)".
function rsvpSheet_() {
  var ss = SpreadsheetApp.getActive(), sheet = ss.getSheetByName('RSVP');
  if (sheet && String(sheet.getRange(1, 6).getValue()) !== 'Men') {
    var nm = 'RSVP (old)', k = 2;
    while (ss.getSheetByName(nm)) nm = 'RSVP (old ' + (k++) + ')';
    sheet.setName(nm); sheet = null;
  }
  if (!sheet) { sheet = getTab_('RSVP'); sheet.getRange('J:J').setNumberFormat('@'); }
  summarySheet_();
  return sheet;
}

// "RSVP Summary" tab: live totals (formulas). It rebuilds itself whenever this layout changes,
// so after pasting a new version of this file nothing else needs doing.
var SUMMARY_TITLE = 'WEDDING RSVP SUMMARY  (updates by itself)  · v3';
function summarySheet_() {
  var ss = SpreadsheetApp.getActive();
  var old = ss.getSheetByName('RSVP Summary');
  if (old && String(old.getRange(1, 1).getValue()) === SUMMARY_TITLE) return;
  if (old) ss.deleteSheet(old);
  var sh = ss.insertSheet('RSVP Summary');

  var YES = 'RSVP!E2:E,"Yes"';
  var T3 = 'RSVP!M2:M,"3-day"', TW = 'RSVP!M2:M,"Wedding day"';
  var fn = function (ev) { return 'RSVP!N2:N,"*' + ev + '*"'; };
  var crit = function (parts) { return [YES].concat(parts.filter(String)).join(','); };
  var fam = function (parts) { return '=COUNTIFS(' + crit(parts) + ')'; };
  var sum = function (col, parts) { return '=SUMIFS(RSVP!' + col + '2:' + col + ',' + crit(parts) + ')'; };
  var line = function (label, parts) { return [label, fam(parts), sum('F', parts), sum('G', parts), sum('H', parts), sum('I', parts)]; };
  var HEAD = ['Families', 'Men', 'Women', 'Children', 'TOTAL GUESTS'];

  var rows = [], heads = [], totals = [];
  var block = function (title, lines) {
    if (rows.length) rows.push(['', '', '', '', '', '']);
    heads.push(rows.length + 1); rows.push([title].concat(HEAD));
    lines.forEach(function (l) { rows.push(l); });
  };
  rows.push([SUMMARY_TITLE, '', '', '', '', '']);

  // 1. Every function, both invites together — the number to plan food and seating with
  block('ALL GUESTS — EACH FUNCTION (both invites together)', ALL_EVENTS.map(function (ev) { return line(ev, [fn(ev)]); }));
  // 2. Guests of the 3-day invite, function by function
  block('3-DAY INVITE GUESTS — EACH FUNCTION', ALL_EVENTS.map(function (ev) { return line(ev, [T3, fn(ev)]); }));
  // 3. Guests of the wedding-day (Varmala) invite
  block('WEDDING-DAY INVITE GUESTS — Varmala & Shaadi', [line('Varmala & Shaadi', [TW])]);
  // 4. Replies overall
  block('REPLIES', [
    line('Coming — 3-day invite', [T3]),
    line('Coming — wedding-day invite', [TW]),
    line('Coming — everyone', ['']),
    ['Families needing a room', '=COUNTIFS(' + YES + ',RSVP!K2:K,"Yes")', '', '', '', ''],
    ['Replied "cannot come"', '=COUNTIF(RSVP!E2:E,"No")', '', '', '', '']
  ]);
  // 5. Arrivals
  if (rows.length) rows.push(['', '', '', '', '', '']);
  heads.push(rows.length + 1); rows.push(['ARRIVALS — guests arriving on each date', '3-day invite', 'Wedding-day invite', 'ALL', '', '']);
  var arrStart = rows.length + 1;
  ['2026-11-28', '2026-11-29', '2026-11-30', '2026-12-01', '2026-12-02'].forEach(function (d) {
    var f = function (t) { return '=SUMIFS(RSVP!I2:I,' + crit([t, 'RSVP!J2:J,"' + d + '"']) + ')'; };
    rows.push([d, f(T3), f(TW), f(''), '', '']);
  });

  sh.getRange(arrStart, 1, 5, 1).setNumberFormat('@');
  sh.getRange(1, 1, rows.length, 6).setValues(rows);
  sh.getRange(1, 1).setFontWeight('bold').setFontSize(12);
  heads.forEach(function (r) { sh.getRange(r, 1, 1, 6).setFontWeight('bold').setBackground('#f3e2c8'); });
  sh.getRange(1, 6, rows.length, 1).setFontWeight('bold');
  sh.setColumnWidth(1, 330); sh.setColumnWidths(2, 5, 120); sh.setFrozenRows(1);
}

/* ------------------------------------------------------------------ */
/*  BLESSINGS — same person (same phone/device + same name) can edit    */
/* ------------------------------------------------------------------ */
function handleBlessing_(b) {
  var name = clean_(b.name, 120);
  var message = clean_(b.message, 3000);
  var device = clean_(b.deviceId, 60);
  if (!name || !message) return { success: false, message: 'Please enter your name and your blessing.' };
  var now = new Date();
  var note = null;

  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var sheet = getTab_('Blessings');
    var n = TABS.Blessings.length;
    var row = 0;
    var last = sheet.getLastRow();
    if (last > 1 && device) {
      var data = sheet.getRange(2, 1, last - 1, n).getValues();
      for (var i = 0; i < data.length; i++) {
        if (String(data[i][5]) === device && String(data[i][2]).toLowerCase() === name.toLowerCase()) { row = i + 2; break; }
      }
    }
    if (row) {
      var old = sheet.getRange(row, 1, 1, n).getValues()[0];
      sheet.getRange(row, 1, 1, n).setValues([[now, old[1] || now, name, message, (Number(old[4]) || 1) + 1, device]]);
      note = ['Blessing updated: ' + name, message];
      return { success: true, updated: true, message: 'Blessing updated.' };
    }
    sheet.appendRow([now, now, name, message, 1, device]);
    note = ['New blessing from ' + name, message];
    return { success: true, updated: false, message: 'Blessing saved.' };
  } finally {
    lock.releaseLock();
    if (note) notify_(note[0], note[1]);
  }
}

/* ------------------------------------------------------------------ */
/*  PHOTOS                                                              */
/* ------------------------------------------------------------------ */
function handleUpload_(b) {
  var event = clean_(b.event, 80);
  var mime = String(b.mime || '');
  var data = String(b.data || '');
  if (!event) return { success: false, message: 'Please choose the celebration.' };
  if (['image/jpeg', 'image/png', 'image/webp'].indexOf(mime) < 0) return { success: false, message: 'Only JPG, PNG or WebP photos are supported.' };
  if (!data || data.length > MAX_PHOTO_BASE64) return { success: false, message: 'This photo is too large.' };

  var ext = mime === 'image/png' ? '.png' : mime === 'image/webp' ? '.webp' : '.jpg';
  var stamp = Utilities.formatDate(new Date(), TIMEZONE, 'yyyyMMdd-HHmmss');
  var fileName = safeName_(event) + '_' + stamp + '_' + Math.floor(Math.random() * 1e6) + ext;

  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  var folder;
  try { folder = getEventFolder_(event); } finally { lock.releaseLock(); }

  var blob = Utilities.newBlob(Utilities.base64Decode(data), mime, fileName);
  var file = folder.createFile(blob);
  try { file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
  var id = file.getId();

  var faces = cleanFaces_(b.faces);
  lock.waitLock(25000);
  try {
    getTab_('Photos').appendRow([new Date(), id, event, fileName, faces.length]);
    if (faces.length) getTab_('Faces').appendRow([id, JSON.stringify(faces)]);
  } finally {
    lock.releaseLock();
  }
  try { CacheService.getScriptCache().remove('LIVE_PHOTO_IDS'); } catch (e) {}
  notifyPhoto_(event);
  return { success: true, id: id };
}

function listPhotos_() {
  var sheet = getTab_('Photos');
  var last = sheet.getLastRow();
  var photos = [];
  if (last > 1) {
    var rows = sheet.getRange(2, 1, last - 1, 5).getValues();
    var live = liveIds_();   // only photos that are still in the Drive folder (deleted ones disappear)
    for (var i = rows.length - 1; i >= 0 && photos.length < 3000; i--) {
      if (!rows[i][1]) continue;
      if (live && !live[String(rows[i][1])]) continue;
      photos.push({ id: String(rows[i][1]), event: String(rows[i][2]), ts: toIso_(rows[i][0]) });
    }
  }
  return { success: true, photos: photos };
}

function listFaces_() {
  var sheet = getTab_('Faces');
  var last = sheet.getLastRow();
  var out = [];
  if (last > 1) {
    var rows = sheet.getRange(2, 1, last - 1, 2).getValues();
    var live = liveIds_();
    for (var i = 0; i < rows.length; i++) {
      if (live && !live[String(rows[i][0])]) continue;
      try { out.push({ id: String(rows[i][0]), d: JSON.parse(rows[i][1]) }); } catch (e) {}
    }
  }
  return { success: true, faces: out };
}

/* ------------------------------------------------------------------ */
/*  Which photos are still in Drive?                                    */
/*  Delete (or move out) a photo in the Drive folder and it leaves the  */
/*  website within about 2 minutes. Checked once and remembered briefly */
/*  so the gallery stays fast.                                          */
/* ------------------------------------------------------------------ */
function liveIds_() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get('LIVE_PHOTO_IDS');
  if (hit !== null) { var m0 = {}; hit.split(',').forEach(function (x) { if (x) m0[x] = 1; }); return m0; }
  try {
    var ids = [], seen = {};
    var walk = function (folder) {
      var files = folder.searchFiles('trashed = false');
      while (files.hasNext()) { var id = files.next().getId(); if (!seen[id]) { seen[id] = 1; ids.push(id); } }
      var subs = folder.getFolders();
      while (subs.hasNext()) { var sub = subs.next(); if (!sub.isTrashed()) walk(sub); }
    };
    walk(getRootFolder_());
    var joined = ids.join(',');
    if (joined.length < 95000) cache.put('LIVE_PHOTO_IDS', joined, 120);
    return seen;
  } catch (e) {
    Logger.log('liveIds_ failed: ' + e);
    return null;   // if Drive cannot be checked, show everything rather than nothing
  }
}

// Wedding menu > "Remove deleted photos from the sheet": tidies the Photos and Faces tabs.
function removeDeletedPhotos() {
  CacheService.getScriptCache().remove('LIVE_PHOTO_IDS');
  var live = liveIds_();
  if (!live) return;
  ['Photos', 'Faces'].forEach(function (tab) {
    var sh = getTab_(tab), col = tab === 'Photos' ? 2 : 1, last = sh.getLastRow();
    for (var r = last; r >= 2; r--) {
      var id = String(sh.getRange(r, col).getValue());
      if (id && !live[id]) sh.deleteRow(r);
    }
  });
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Adds any missing header cells (e.g. the new 'Invite Type' column) to an existing tab.
function ensureHeader_(sheet, name) {
  var want = TABS[name], have = sheet.getRange(1, 1, 1, want.length).getValues()[0];
  for (var i = 0; i < want.length; i++) if (!String(have[i] || '')) sheet.getRange(1, i + 1).setValue(want[i]).setFontWeight('bold');
}

function getTab_(name) {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    var headers = TABS[name];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    if (name === 'RSVP') sheet.getRange(1, 4, 1, 1).setNumberFormat('@');
  }
  return sheet;
}

function getRootFolder_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('ROOT_FOLDER_ID');
  var folder = null;
  if (id) { try { folder = DriveApp.getFolderById(id); } catch (e) { folder = null; } }
  if (!folder) {
    folder = DriveApp.createFolder(ROOT_FOLDER_NAME);
    props.setProperty('ROOT_FOLDER_ID', folder.getId());
    try { folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
  }
  return folder;
}

function getEventFolder_(event) {
  var root = getRootFolder_();
  var name = safeName_(event);
  var props = PropertiesService.getScriptProperties();
  var cachedId = props.getProperty('FOLDER_' + name);
  if (cachedId) { try { return DriveApp.getFolderById(cachedId); } catch (e) {} }
  var it = root.getFoldersByName(name);
  var folder;
  if (it.hasNext()) {
    folder = it.next();
  } else {
    folder = root.createFolder(name);
    try { folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (e) {}
  }
  props.setProperty('FOLDER_' + name, folder.getId());
  return folder;
}

function findRow_(sheet, col, key, normalise) {
  var last = sheet.getLastRow();
  if (last < 2) return 0;
  var vals = sheet.getRange(2, col, last - 1, 1).getValues();
  for (var i = 0; i < vals.length; i++) {
    if (normalise(vals[i][0]) === key) return i + 2;
  }
  return 0;
}

function phoneKey_(v) {
  var d = String(v == null ? '' : v).replace(/\D/g, '');
  return d.length > 10 ? d.slice(-10) : d;
}

function clean_(v, max) {
  var s = String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim();
  if (s.length > max) s = s.slice(0, max);
  // stop text like =SUM(...) from being run as a spreadsheet formula
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function num_(v) {
  var n = parseInt(v, 10);
  return isNaN(n) ? '' : Math.max(0, Math.min(n, 999));
}

function yesNo_(v) { return String(v) === 'yes' ? 'Yes' : 'No'; }

function safeName_(s) { return String(s).replace(/[^A-Za-z0-9 &_-]/g, '').replace(/\s+/g, '_').slice(0, 60) || 'Other'; }

function toIso_(v) {
  if (v instanceof Date) return v.toISOString();
  var d = new Date(v);
  return isNaN(d.getTime()) ? '' : d.toISOString();
}

function cleanFaces_(faces) {
  var out = [];
  if (!Array.isArray(faces)) return out;
  for (var i = 0; i < faces.length && out.length < MAX_FACES_PER_PHOTO; i++) {
    var f = faces[i];
    if (!Array.isArray(f) || f.length !== 128) continue;
    var ok = true, r = [];
    for (var j = 0; j < 128; j++) {
      var x = Number(f[j]);
      if (!isFinite(x)) { ok = false; break; }
      r.push(Math.round(x * 1000) / 1000);
    }
    if (ok) out.push(r);
  }
  return out;
}


/* Email alerts are switched off (they would need an extra Google permission).  */
function notify_() {}
function notifyPhoto_() {}
