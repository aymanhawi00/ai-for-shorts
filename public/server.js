import express from 'express';
import { google } from 'googleapis';

const app = express();
const PORT = process.env.PORT || 3000;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://ai-for-shorts.vercel.app/api/oauth2callback"
);

// Route to initiate authorization
app.get('/api/auth', (req, res) => {
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/youtube.upload',
  });
  res.redirect(authorizeUrl);
});

// OAuth2 callback route
app.get('/api/oauth2callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Authorization code not found.");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    console.log("Refresh Token:", tokens.refresh_token);
    res.send("Authorization successful! Refresh token acquired.");
  } catch (error) {
    console.error("Error retrieving access token:", error.message);
    res.status(500).send("Failed to get access token");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running.`);
});
