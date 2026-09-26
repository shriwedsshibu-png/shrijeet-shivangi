import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Content-Type': 'application/json' };

export default async (request) => {
  try {
    if (request.method === 'OPTIONS') return new Response(null, { status: 200, headers });
    if (request.method !== 'POST') return new Response(JSON.stringify({ success: false, message: 'Method not allowed.' }), { status: 405, headers });
    if (!SPREADSHEET_ID) return new Response(JSON.stringify({ success: false, message: 'RSVP storage is not configured.' }), { status: 500, headers });

    const body = await request.json();
    const contactName = String(body.contactName || '').trim();
    const phone = String(body.phone || '').trim();
    const attending = String(body.attending || 'yes');

    if (!contactName || !phone) return new Response(JSON.stringify({ success: false, message: 'Name and WhatsApp/mobile number are required.' }), { status: 400, headers });

    const values = [[
      new Date().toLocaleString('en-IN'), contactName, phone, attending,
      String(body.adults || ''), String(body.children || ''), String(body.guestNames || '').trim(),
      Array.isArray(body.eventsAttending) ? body.eventsAttending.join(' | ') : '',
      String(body.arrivalDate || ''), String(body.arrivalTime || ''), String(body.departureDate || ''), String(body.departureTime || ''),
      String(body.accommodation || ''), String(body.nights || ''), String(body.cab || ''), String(body.pickupLocation || '').trim(),
      String(body.foodPreference || '').trim(), String(body.notes || '').trim(),
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'RSVP!A1:R1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values },
    });

    return new Response(JSON.stringify({ success: true, message: 'RSVP saved successfully.' }), { status: 200, headers });
  } catch (error) {
    console.error('Error in submit-rsvp:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to save RSVP. Please try again.' }), { status: 500, headers });
  }
};
