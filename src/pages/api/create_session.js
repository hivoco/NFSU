import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sessionName } = req.body;

    if (!sessionName || !sessionName.trim()) {
      return res.status(400).json({ error: "Session name is required" });
    }

    // Check if session already exists
    const existing = await query(
      "SELECT id FROM sessions WHERE LOWER(session_name) = LOWER(?)",
      [sessionName.trim()]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Session already exists" });
    }

    await query("INSERT INTO sessions (session_name) VALUES (?)", [
      sessionName.trim(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Session created",
      session_name: sessionName.trim(),
    });
  } catch (error) {
    console.error("Error creating session:", error);
    return res.status(500).json({ error: "Failed to create session" });
  }
}
