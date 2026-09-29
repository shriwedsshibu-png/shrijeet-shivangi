/**
 * ============================================================
 *  Shrijeet & Shivangi Wedding — Google backend (Apps Script)
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

// Email alerts. Leave '' to send to the Google account that owns this script.
// Put an address between the quotes to send somewhere else, e.g. 'name@gmail.com'.
var NOTIFY_EMAIL = '';
// Photos: at most one "new photos" email per this many minutes (so your inbox is not flooded).
var PHOTO_ALERT_MINUTES = 15;

var TABS = {
  RSVP: [
    'Last Updated', 'First Submitted', 'Main Guest', 'Phone', 'Attending',
    'Adults', 'Children', 'Guest Names', 'Functions Attending',
    'Arrival Date', 'Arrival Time', 'Departure Date', 'Departure Time',
    'Accommodation', 'Nights', 'Cab / Transport', 'Pickup / Drop',
    'Food Preference', 'Other Requirements', 'Times Updated'
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
  Object.keys(TABS).forEach(function (name) { getTab_(name); });

  var extra = ss.getSheetByName('Sheet1');
  if (extra && extra.getLastRow() === 0 && ss.getSheets().length > 1) {
    try { ss.deleteSheet(extra); } catch (e) {}
  }

  var folder = getRootFolder_();
  Logger.log('READY. Photos folder: ' + folder.getUrl());
  Logger.log('Now click Deploy > New deployment > Web app (see GUIDE-1-GOOGLE-SETUP.md).');
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

  var events = Array.isArray(b.eventsAttending)
    ? b.eventsAttending.map(function (x) { return clean_(x, 80); }).filter(String).join(' | ')
    : '';
  var attending = String(b.attending) === 'no' ? 'No' : 'Yes';
  var now = new Date();

  var note = null;
  var lock = LockService.getScriptLock();
  lock.waitLock(25000);
  try {
    var sheet = getTab_('RSVP');
    var n = TABS.RSVP.length;
    var row = findRow_(sheet, 4, phoneKey, function (v) { return phoneKey_(v); });

    var first = now, times = 1;
    if (row) {
      var old = sheet.getRange(row, 1, 1, n).getValues()[0];
      first = old[1] || now;
      times = (Number(old[19]) || 1) + 1;
    }
    var values = [
      now, first, name, '', attending,
      num_(b.adults), num_(b.children), clean_(b.guestNames, 600), events,
      clean_(b.arrivalDate, 20), clean_(b.arrivalTime, 20),
      clean_(b.departureDate, 20), clean_(b.departureTime, 20),
      yesNo_(b.accommodation), num_(b.nights), yesNo_(b.cab), clean_(b.pickupLocation, 200),
      clean_(b.foodPreference, 80), clean_(b.notes, 1000), times
    ];
    if (attending === 'No') {   // a "cannot come" answer clears the travel details
      for (var i = 5; i < 19; i++) values[i] = '';
    }
    if (!row) {
      sheet.appendRow(values);
      row = sheet.getLastRow();
    } else {
      sheet.getRange(row, 1, 1, n).setValues([values]);
    }
    sheet.getRange(row, 4).setNumberFormat('@').setValue(phoneKey);
    note = [(times > 1 ? 'RSVP updated: ' : 'New RSVP: ') + name + (attending === 'No' ? ' (cannot come)' : ''),
      name + ' | ' + phoneKey + ' | ' + (attending === 'No' ? 'Cannot attend' : 'Attending') +
      (attending === 'Yes' ? '\nAdults: ' + num_(b.adults) + '  Children: ' + num_(b.children) + '\nFunctions: ' + events : '')];
    return { success: true, updated: times > 1, message: times > 1 ? 'RSVP updated.' : 'RSVP saved.' };
  } finally {
    lock.releaseLock();
    if (note) notify_(note[0], note[1]);
  }
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
  notifyPhoto_(event);
  return { success: true, id: id };
}

function listPhotos_() {
  var sheet = getTab_('Photos');
  var last = sheet.getLastRow();
  var photos = [];
  if (last > 1) {
    var rows = sheet.getRange(2, 1, last - 1, 5).getValues();
    for (var i = rows.length - 1; i >= 0 && photos.length < 3000; i--) {
      if (!rows[i][1]) continue;
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
    for (var i = 0; i < rows.length; i++) {
      try { out.push({ id: String(rows[i][0]), d: JSON.parse(rows[i][1]) }); } catch (e) {}
    }
  }
  return { success: true, faces: out };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
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


/* ------------------------------------------------------------------ */
/*  EMAIL ALERTS  (never allowed to break a guest's submission)         */
/* ------------------------------------------------------------------ */
function notify_(subject, body) {
  try {
    var to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
    if (!to) return;
    MailApp.sendEmail(to, '[Wedding site] ' + subject, String(body) + '\n\n— Shrijeet & Shivangi wedding website');
  } catch (e) {}
}

function notifyPhoto_(event) {
  try {
    var props = PropertiesService.getScriptProperties();
    var pending = (Number(props.getProperty('pendingPhotos')) || 0) + 1;
    var last = Number(props.getProperty('lastPhotoMail')) || 0;
    var now = new Date().getTime();
    if (now - last >= PHOTO_ALERT_MINUTES * 60000) {
      notify_(pending + ' new photo' + (pending > 1 ? 's' : '') + ' uploaded', 'Latest celebration: ' + event + '\nOpen your Drive folder "' + ROOT_FOLDER_NAME + '" to see them.');
      props.setProperty('pendingPhotos', '0');
      props.setProperty('lastPhotoMail', String(now));
    } else {
      props.setProperty('pendingPhotos', String(pending));
    }
  } catch (e) {}
}

/* Run this once from the editor to test that email alerts reach you. */
function testEmail() {
  notify_('Test alert', 'If you can read this, wedding alerts are working.');
}
