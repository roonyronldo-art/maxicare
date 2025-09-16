import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export function getCalendar() {
  const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;
  if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY) {
    throw new Error('Missing Google service account env vars');
  }
  const jwt = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    undefined,
    GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    SCOPES,
  );
  return google.calendar({ version: 'v3', auth: jwt });
}
