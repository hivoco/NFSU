import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const name = req.query.name;
    const session_id = req.query.session_id;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    // No session = no uniqueness check, allow any name
    if (!session_id || !session_id.trim()) {
      return res.status(200).json({ is_user_exist: false });
    }

    // With session = check name uniqueness within that session
    const rows = await query(
      "SELECT id FROM users WHERE LOWER(name) = LOWER(?) AND session_id = ?",
      [name.trim(), session_id.trim()]
    );

    return res.status(200).json({
      is_user_exist: rows.length > 0,
    });
  } catch (error) {
    console.error("Error checking user:", error);
    return res.status(500).json({ error: "Failed to check user" });
  }
}
