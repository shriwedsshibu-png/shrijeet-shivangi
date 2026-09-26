import { google } from 'googleapis';
import { createWriteStream, unlinkSync, createReadStream } from 'fs';
import { join } from 'path';
import Busboy from 'busboy';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

export async function handler(event) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  try {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: corsHeaders };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Method not allowed.' }) };
    if (!FOLDER_ID) return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Photo storage is not configured.' }) };

    const contentType = event.headers['content-type'] || event.headers['Content-Type'];
    if (!contentType?.includes('multipart/form-data')) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Invalid upload request.' }) };
    }

    const bodyBuffer = Buffer.from(event.body || '', event.isBase64Encoded === false ? 'utf8' : 'base64');
    const busboy = Busboy({ headers: { 'content-type': contentType } });
    const fileIds = [];
    const uploadPromises = [];
    let category = '';

    return await new Promise((resolve) => {
      busboy.on('field', (fieldname, value) => {
        if (fieldname === 'category') category = String(value || '').trim();
      });

      busboy.on('file', (fieldname, file, info) => {
        const { filename, mimeType } = info;
        const safeFilename = (filename || `photo_${Date.now()}.jpg`).replace(/[^a-zA-Z0-9._-]/g, '_');
        const tempFilePath = join('/tmp', `${Date.now()}_${safeFilename}`);

        const uploadPromise = new Promise((res, rej) => {
          const writeStream = createWriteStream(tempFilePath);
          file.pipe(writeStream);

          file.on('end', async () => {
            try {
              const fileMetadata = {
                name: safeFilename,
                parents: [FOLDER_ID],
                appProperties: { eventCategory: category || 'Other' },
              };
              const media = { mimeType, body: createReadStream(tempFilePath) };
              const response = await drive.files.create({ resource: fileMetadata, media, fields: 'id' });
              fileIds.push(response.data.id);
              unlinkSync(tempFilePath);
              res();
            } catch (error) {
              try { unlinkSync(tempFilePath); } catch {}
              rej(error);
            }
          });
          file.on('error', rej);
        });

        uploadPromises.push(uploadPromise);
      });

      busboy.on('finish', async () => {
        if (!category) {
          resolve({ statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Please choose a celebration.' }) });
          return;
        }
        try {
          await Promise.all(uploadPromises);
          resolve({ statusCode: 200, headers: corsHeaders, body: JSON.stringify({ success: true, message: 'Photos uploaded successfully!', fileIds, category }) });
        } catch (error) {
          console.error('Upload error:', error);
          resolve({ statusCode: 500, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Photo upload failed.' }) });
        }
      });

      busboy.on('error', (error) => {
        console.error('Busboy error:', error);
        resolve({ statusCode: 400, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Could not read the uploaded photos.' }) });
      });

      busboy.end(bodyBuffer);
    });
  } catch (error) {
    console.error('Unexpected upload error:', error);
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ success: false, message: 'Unexpected server error.' }) };
  }
}
