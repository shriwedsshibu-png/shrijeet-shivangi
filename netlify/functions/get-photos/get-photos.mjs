import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});
const drive = google.drive({ version: 'v3', auth });
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

export async function handler(event) {
  const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Content-Type': 'application/json' };
  try {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers };
    if (event.httpMethod !== 'GET') return { statusCode: 405, headers, body: JSON.stringify({ success: false, message: 'Method not allowed.' }) };
    if (!FOLDER_ID) return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Photo storage is not configured.' }) };

    const response = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and mimeType contains 'image/' and trashed=false`,
      fields: 'files(id,name,mimeType,createdTime,modifiedTime,appProperties)',
      orderBy: 'createdTime desc',
      pageSize: 1000,
    });

    const photos = (response.data.files || []).map((file) => ({
      id: file.id,
      name: file.name,
      url: `https://drive.google.com/uc?export=view&id=${file.id}`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000-h1000`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
      date: file.createdTime || file.modifiedTime,
      category: file.appProperties?.eventCategory || 'Other',
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, photos, count: photos.length }) };
  } catch (error) {
    console.error('Error fetching photos:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, message: 'Failed to fetch photos.' }) };
  }
}
