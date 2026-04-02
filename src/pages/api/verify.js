import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { user_answer, question_id, lang, user_id, type } = req.body;

    const rows = await query(
      "SELECT correct_option_value FROM questions WHERE question_id = ? AND lang = ? AND type = ?",
      [question_id, (lang || "english").toLowerCase(), type || "nfsu"]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    const correctAnswer = rows[0].correct_option_value;
    const is_correct =
      user_answer?.trim().toLowerCase() === correctAnswer?.trim().toLowerCase();

    return res.status(200).json({
      is_correct,
      correct_option_value: correctAnswer,
    });
  } catch (error) {
    console.error("Error verifying answer:", error);
    return res.status(500).json({ error: "Failed to verify answer" });
  }
}
