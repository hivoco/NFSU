import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const name = req.query.name;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Session name is required" });
    }

    const rows = await query(
      "SELECT id FROM sessions WHERE LOWER(session_name) = LOWER(?)",
      [name.trim()]
    );

    return res.status(200).json({
      is_session_exit: rows.length > 0,
    });
  } catch (error) {
    console.error("Error checking session:", error);
    return res.status(500).json({ error: "Failed to check session" });
  }
}
