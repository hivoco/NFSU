import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let connection;
  try {
    // First connect without database to create it
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    });

    // Create database
    await connection.query(
      "CREATE DATABASE IF NOT EXISTS `nfsu-quizdb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    );
    await connection.query("USE `nfsu-quizdb`");

    // Create questions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS questions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question_id INT NOT NULL UNIQUE,
        question_text TEXT NOT NULL,
        option_a VARCHAR(500) NOT NULL,
        option_b VARCHAR(500) NOT NULL,
        option_c VARCHAR(500) NOT NULL,
        option_d VARCHAR(500) NOT NULL,
        correct_option CHAR(1) NOT NULL,
        correct_option_value VARCHAR(500) NOT NULL,
        explanation TEXT,
        lang VARCHAR(20) NOT NULL DEFAULT 'english',
        type VARCHAR(50) NOT NULL DEFAULT 'nfsu',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL UNIQUE,
        session_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create sessions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_name VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create quiz_results table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        user_id VARCHAR(255),
        session_id VARCHAR(255),
        score INT NOT NULL DEFAULT 0,
        total_questions INT NOT NULL DEFAULT 10,
        quiz_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed questions - delete existing and re-insert
    await connection.query("DELETE FROM questions WHERE type = 'nfsu'");

    const questions = [
      {
        question_id: 1,
        question_text: "What major global sporting event is India actively preparing proposals to host in the year 2036?",
        option_a: "The FIFA World Cup",
        option_b: "The Asian Games",
        option_c: "The Olympic Games",
        option_d: "The Commonwealth Games",
        correct_option: "C",
        correct_option_value: "The Olympic Games",
        explanation: "India aims to host the 2030 Commonwealth Games and the 2036 Olympics.",
      },
      {
        question_id: 2,
        question_text: "According to a global report by WADA (2023), what alarming percentage of global doping offenders are from India?",
        option_a: "5%",
        option_b: "11%",
        option_c: "18%",
        option_d: "25%",
        correct_option: "B",
        correct_option_value: "11%",
        explanation: "India accounts for 11% of global doping offenders, showing the highest positivity rate.",
      },
      {
        question_id: 3,
        question_text: 'What is the primary cause of "inadvertent doping" among athletes?',
        option_a: "Intentionally taking performance-enhancing drugs to win",
        option_b: "Consuming an excessive amount of regular food",
        option_c: "Unknowingly consuming unregulated, contaminated, or adulterated supplements",
        option_d: "Skipping mandatory sports training sessions",
        correct_option: "C",
        correct_option_value: "Unknowingly consuming unregulated, contaminated, or adulterated supplements",
        explanation: "Athletes often face bans due to cross-contamination in manufacturing plants.",
      },
      {
        question_id: 4,
        question_text: "Which three major government bodies collaborated to establish the Centre of Excellence (CoE-NSTS) testing facility?",
        option_a: "Ministry of Finance, NFSU, and SAI",
        option_b: "NADA, WADA, and BCCI",
        option_c: "NFSU (Ministry of Home Affairs), SAI (Ministry of Youth Affairs & Sports), and FSSAI (Ministry of Health)",
        option_d: "NIPER, FSSAI, and the Ministry of Education",
        correct_option: "C",
        correct_option_value: "NFSU (Ministry of Home Affairs), SAI (Ministry of Youth Affairs & Sports), and FSSAI (Ministry of Health)",
        explanation: "This is a powerful tri-party initiative to ensure athlete safety.",
      },
      {
        question_id: 5,
        question_text: "Amway is the first direct-selling company in India to earn which specific NFSU-NSTS certification designed for large-scale manufacturers?",
        option_a: "Basic Certification",
        option_b: "Trusted Certification",
        option_c: "Batch-wise Certification",
        option_d: "WADA-Free Certification",
        correct_option: "B",
        correct_option_value: "Trusted Certification",
        explanation: "The Trusted program is the highest tier, involving raw material screening and continuous random market sampling.",
      },
      {
        question_id: 6,
        question_text: "To ensure purity and safety, how many quality checks do Nutrilite products undergo from sourcing raw materials to the final finished product?",
        option_a: "Over 50 checks",
        option_b: "Over 100 checks",
        option_c: "Over 200 checks",
        option_d: "Over 500 checks",
        correct_option: "C",
        correct_option_value: "Over 200 checks",
        explanation: "Nutrilite conducts 200+ quality checks to ensure products are safe and free from toxins.",
      },
      {
        question_id: 7,
        question_text: "Which certified Nutrilite product contains a clinically effective dose of the traditional herb Gotukola to help athletes manage physical and mental stress?",
        option_a: "Nutrilite Salmon Omega-3 Softgels",
        option_b: "Nutrilite Daily Plus",
        option_c: "Nutrilite All Plant Protein Powder",
        option_d: "Nutrilite Cal Mag D Plus K2",
        correct_option: "B",
        correct_option_value: "Nutrilite Daily Plus",
        explanation: "Alongside vitamins and minerals, it supports energy, mental performance, and stress management.",
      },
      {
        question_id: 8,
        question_text: "Which certified product provides the essential building blocks for muscle growth and recovery, featuring a perfect digestibility score of PDCAAS 1?",
        option_a: "Nutrilite All Plant Protein Powder",
        option_b: "Nutrilite Glucosamine HCL with Boswellia",
        option_c: "Nutrilite Cal Mag D Plus K2",
        option_d: "Nutrilite Daily Plus",
        correct_option: "A",
        correct_option_value: "Nutrilite All Plant Protein Powder",
        explanation: "It meets high daily protein demands to support strength and normal muscle health.",
      },
      {
        question_id: 9,
        question_text: "In Nutrilite Cal Mag D Plus K2, what is the specific and crucial role of Vitamin K2 for an athlete?",
        option_a: "It absorbs calcium from the gut into the bloodstream",
        option_b: "It ensures calcium is effectively deposited directly into the bones",
        option_c: "It provides instant energy for intense training",
        option_d: "It maintains normal heart function and triglyceride balance",
        correct_option: "B",
        correct_option_value: "It ensures calcium is effectively deposited directly into the bones",
        explanation: "While Vitamin D absorbs calcium, K2 ensures it gets into the bone structure.",
      },
      {
        question_id: 10,
        question_text: "To remain compliant, what claim should you NEVER make when discussing our NFSU-NSTS certified products?",
        option_a: '"Clean, safe, and certified"',
        option_b: '"Tested for prohibited substances for sportspersons"',
        option_c: '"Government-backed certification"',
        option_d: '"100% Drug-Free" or "WADA-free"',
        correct_option: "D",
        correct_option_value: '"100% Drug-Free" or "WADA-free"',
        explanation: 'Because there is no defined threshold for "free," you must only say "tested for/free from prohibited substances for sportspersons".',
      },
    ];

    const insertSQL = `
      INSERT INTO questions (question_id, question_text, option_a, option_b, option_c, option_d, correct_option, correct_option_value, explanation, lang, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'english', 'nfsu')
    `;

    for (const q of questions) {
      await connection.execute(insertSQL, [
        q.question_id,
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_option,
        q.correct_option_value,
        q.explanation,
      ]);
    }

    await connection.end();

    return res.status(200).json({
      success: true,
      message: "Database setup complete. Created tables: questions, users, sessions, quiz_results. Seeded 10 questions.",
    });
  } catch (error) {
    if (connection) await connection.end();
    console.error("Setup error:", error);
    return res.status(500).json({ error: error.message });
  }
}
