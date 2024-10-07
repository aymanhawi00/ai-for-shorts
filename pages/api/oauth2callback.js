import { google } from "googleapis";

export default async function handler(req, res) {
  console.log("Api hit!");
  const code = req.query.code;

  if (!code) {
    res.status(400).send("Authorization code not found.");
    return;
  }

  // Configure OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://your-app.vercel.app/api/oauth2callback" // Make sure this matches the one in your Google Console
  );

  try {
    // Exchange authorization code for access and refresh tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store the tokens securely for future API requests (e.g., in a database)
    console.log("Tokens acquired:", tokens);

    // You can now make YouTube API requests with the tokens
    res.send("Authorization successful! Tokens acquired.");
  } catch (error) {
    console.error("Error retrieving access token:", error);
    res.status(500).send("Failed to get access token");
  }
}
