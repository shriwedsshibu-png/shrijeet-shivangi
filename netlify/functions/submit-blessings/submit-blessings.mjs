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
    if (!SPREADSHEET_ID) return new Response(JSON.stringify({ success: false, message: 'Blessings storage is not configured.' }), { status: 500, headers });

    const body = await request.json();
    const name = String(body.name || '').trim();
    const message = String(body.message || '').trim();
    if (!name || !message) return new Response(JSON.stringify({ success: false, message: 'Name and blessing are required.' }), { status: 400, headers });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1:C1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[name, message, new Date().toLocaleString('en-IN')]] },
    });

    return new Response(JSON.stringify({ success: true, message: 'Blessing submitted successfully!' }), { status: 200, headers });
  } catch (error) {
    console.error('Error in submit-blessings:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to submit blessing.' }), { status: 500, headers });
  }
};
