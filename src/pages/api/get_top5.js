import { query } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { session_id, name } = req.query;

    let rows;

    if (session_id) {
      // With session: top 5 participants from that session
      rows = await query(
        `SELECT name, MAX(score) as score
         FROM quiz_results
         WHERE session_id = ?
         GROUP BY name
         ORDER BY score DESC, MIN(created_at) ASC
         LIMIT 5`,
        [session_id]
      );
    } else if (name) {
      // No session: only show this user's own results
      rows = await query(
        `SELECT name, MAX(score) as score
         FROM quiz_results
         WHERE LOWER(name) = LOWER(?) AND (session_id = '' OR session_id IS NULL)
         GROUP BY name`,
        [name.trim()]
      );
    } else {
      return res.status(200).json({ top_5: [] });
    }

    const rankLabels = ["1st", "2nd", "3rd", "4th", "5th"];
    const top_5 = rows.map((row, index) => ({
      rank: rankLabels[index] || `${index + 1}th`,
      name: row.name,
      score: row.score,
    }));

    return res.status(200).json({ top_5 });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
}
