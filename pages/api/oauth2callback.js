// pages/api/oauth2callback.js
import { google } from "googleapis";

export default async function handler(req, res) {
  const code = req.query.code;

  if (!code) {
    res.status(400).send("Authorization code not found.");
    return;
  }

  // Configure OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://your-app.vercel.app/api/oauth2callback"
  );

  try {
    // Exchange authorization code for access token
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // At this point, you have access to the tokens, and you can make YouTube API requests

    console.log("Tokens acquired:", tokens);
    res.send("Authorization successful! Tokens acquired.");
  } catch (error) {
    console.error("Error retrieving access token:", error);
    res.status(500).send("Failed to get access token");
  }
}
