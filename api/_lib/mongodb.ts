import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
let client: MongoClient | null = null;
let db: Db | null = null;
let lastAttemptTime = 0;
let connectionError: string | null = null;

function checkUriIssues(uri: string): string | null {
  try {
    if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
      return "Invalid connection scheme. MONGODB_URI must start with 'mongodb://' or 'mongodb+srv://'.";
    }

    // Check for unencoded '@' in password
    const parts = uri.split("@");
    if (parts.length > 2) {
      return "Your MONGODB_URI contains multiple '@' characters. If your database password contains an '@' character, you MUST replace it with its percent-encoded equivalent '%40' in the connection string (e.g., p%40ssword instead of p@ssword).";
    }

    // Check for other raw special characters in the auth section
    const authAndScheme = parts[0];
    const schemeIndex = authAndScheme.indexOf("://");
    if (schemeIndex !== -1) {
      const auth = authAndScheme.substring(schemeIndex + 3);
      const colonIndex = auth.indexOf(":");
      if (colonIndex !== -1) {
        const password = auth.substring(colonIndex + 1);
        const rawSpecialChars = ["#", "?", ":", "/", "+", " "];
        const found = rawSpecialChars.filter(char => password.includes(char));
        if (found.length > 0) {
          const encodings: Record<string, string> = {
            "#": "%23",
            "?": "%3F",
            ":": "%3A",
            "/": "%2F",
            "+": "%2B",
            " ": "%20"
          };
          const suggestions = found.map(char => `'${char}' with '${encodings[char]}'`).join(", ");
          return `Your database password contains unencoded special characters. Please replace ${suggestions} in your MONGODB_URI password segment to ensure proper authentication.`;
        }
      }
    }
  } catch (e) {
    // fallback if parsing fails
  }
  return null;
}

export async function getDb(): Promise<{ db: Db | null; connectionError: string | null }> {
  if (!uri) {
    connectionError = "MONGODB_URI is not defined. Please add it via AI Studio settings.";
    return { db: null, connectionError };
  }
  
  const uriIssue = checkUriIssues(uri);
  if (uriIssue) {
    connectionError = uriIssue;
    return { db: null, connectionError };
  }

  if (db) {
    return { db, connectionError: null };
  }

  const now = Date.now();
  // Throttle reconnection attempts to once per 15 seconds to prevent hanging the event loop
  if (connectionError && (now - lastAttemptTime < 15000)) {
    return { db: null, connectionError };
  }

  lastAttemptTime = now;
  try {
    console.log("Connecting to MongoDB in serverless function...");
    client = new MongoClient(uri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    // Parse db name from URI or default to "tatrapax"
    db = client.db("tatrapax");
    connectionError = null;
    console.log("Connected to MongoDB successfully!");
  } catch (err: any) {
    console.error("Failed to connect to MongoDB:", err);
    connectionError = err.message || String(err);
    if (connectionError && (connectionError.includes("bad auth") || connectionError.includes("Authentication failed"))) {
      connectionError = "Authentication failed: Your MONGODB_URI has an incorrect username, password, or contains unencoded special characters in the password. Please verify and update your credentials in Settings.";
    }
    db = null;
  }
  return { db, connectionError };
}
