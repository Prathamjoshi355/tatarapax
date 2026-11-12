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

    // If there is NO '@', there is no user:password auth section to validate (e.g. mongodb://localhost:27017/Tantapex)
    if (parts.length <= 1) {
      return null;
    }

    // Check for other raw special characters in the auth section (only if '@' is present)
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
  try {
    dotenv.config();
  } catch {}

  const activeUri = (process.env.MONGODB_URI || uri || "").trim();
  if (!activeUri) {
    connectionError = "MONGODB_URI is not defined in environment variables.";
    return { db: null, connectionError };
  }
  
  const uriIssue = checkUriIssues(activeUri);
  if (uriIssue) {
    connectionError = uriIssue;
    return { db: null, connectionError };
  }

  if (db) {
    return { db, connectionError: null };
  }

  const now = Date.now();
  // Throttle reconnection attempts to once per 5 seconds
  if (connectionError && (now - lastAttemptTime < 5000)) {
    return { db: null, connectionError };
  }

  lastAttemptTime = now;
  try {
    console.log("Connecting to MongoDB in serverless function...");
    client = new MongoClient(activeUri, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();

    // Parse db name from URI or default to "tatrapax"
    let dbName = "tatrapax";
    const match = activeUri.match(/(?:mongodb(?:\+srv)?:\/\/[^/]+\/)([^?&/\s]+)/i);
    if (match && match[1]) {
      dbName = match[1].trim();
      if (activeUri.includes("tatrapax.btmauq4.mongodb.net") && dbName.toLowerCase() === "tantapex") {
        dbName = "tatrapax";
      }
    }
    db = client.db(dbName);
    connectionError = null;
    console.log(`Connected to MongoDB successfully! Database: ${dbName}`);
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
