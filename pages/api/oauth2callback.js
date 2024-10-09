import { google } from "googleapis";

export default async function handler(req, res) {
  console.log("API hit!");

  const code = req.query.code;

  if (!code) {
    res.status(400).send("Authorization code not found.");
    return;
  }

  // Configure OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://ai-for-shorts.vercel.app/api/oauth2callback" // Ensure this matches the one in your Google Console
  );

  try {
    // Exchange authorization code for access and refresh tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Log acquired tokens for debugging
    console.log("Tokens acquired:", tokens);

    // You can now make YouTube API requests with the tokens
    res.send("Authorization successful! Tokens acquired.");
  } catch (error) {
    console.error("Error retrieving access token:", error.message); // Improved error logging
    res.status(500).send("Failed to get access token");
  }
}
