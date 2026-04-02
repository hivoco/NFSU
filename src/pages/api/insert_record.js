import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, session_id, user_id, score, total_questions, quiz } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Insert or update user
    const existingUsers = await query(
      "SELECT id FROM users WHERE LOWER(name) = LOWER(?) AND session_id = ?",
      [name.trim(), session_id || ""]
    );

    if (existingUsers.length === 0) {
      await query(
        "INSERT INTO users (name, user_id, session_id) VALUES (?, ?, ?)",
        [name.trim(), user_id || `user_${Date.now()}`, session_id || ""]
      );
    }

    // Insert quiz result
    await query(
      "INSERT INTO quiz_results (name, user_id, session_id, score, total_questions, quiz_data) VALUES (?, ?, ?, ?, ?, ?)",
      [
        name.trim(),
        user_id || "",
        session_id || "",
        score || 0,
        total_questions || 10,
        quiz ? JSON.stringify(quiz) : null,
      ]
    );

    return res.status(200).json({ success: true, message: "Record inserted" });
  } catch (error) {
    console.error("Error inserting record:", error);
    return res.status(500).json({ error: "Failed to insert record" });
  }
}
