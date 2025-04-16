import { google } from 'googleapis';
import { getOAuth2Client } from './sheetsOAuth.js';

export async function appendToSheet({ timestamp, userId, content, classification }) {
  const auth = await getOAuth2Client();
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: '偵測樣本總覽!A:D',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[timestamp, userId, content, classification]]
    }
  });
}