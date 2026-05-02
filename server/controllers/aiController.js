const fs = require("fs");
const db = require("../config/db");

const SKILLS = ["DSA", "Java", "Python", "React", "Node", "SQL"];

exports.uploadResume = async (req, res) => {
    try {
        console.log("File received:", req.file);

        const filePath = req.file.path;
        const fileType = req.file.mimetype;

        let text = "";

        // 🔥 HANDLE TEXT FILE (RELIABLE)
        if (fileType === "text/plain") {
            text = fs.readFileSync(filePath, "utf-8");
        } 
        else {
            // ❌ PDF fallback (skip parsing)
            return res.status(400).json({
                message: "PDF parsing unstable in this version. Please upload .txt file for demo."
            });
        }

        console.log("RAW TEXT:", text);

        // Clean text
        text = text
            .replace(/\s+/g, " ")
            .toLowerCase();

        console.log("CLEAN TEXT:", text);

        const detectedSkills = SKILLS.filter(skill =>
            text.includes(skill.toLowerCase())
        );

        console.log("Detected skills:", detectedSkills);

        const student_id = req.body.student_id;

        for (let skill of detectedSkills) {
        const query = `
            INSERT INTO student_skills (student_id, skill_id, level)
            SELECT ?, id, 'intermediate'
            FROM skills 
            WHERE name = ?
            AND NOT EXISTS (
                SELECT 1 FROM student_skills 
                WHERE student_id = ? 
                AND skill_id = skills.id
            )
        `;            
        db.query(query, [student_id, skill]);
        }

        res.json({
            message: "Resume analyzed",
            detectedSkills
        });

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ error: "Server error" });
    }
};

exports.chatbot = (req, res) => {
    const { message, student_id } = req.body;

    const query = `
        SELECT s.cgpa, GROUP_CONCAT(sk.name) AS skills
        FROM students s
        LEFT JOIN student_skills ss ON s.id = ss.student_id
        LEFT JOIN skills sk ON ss.skill_id = sk.id
        WHERE s.id = ?
    `;

    db.query(query, [student_id], (err, results) => {
        if (err) return res.status(500).json(err);

        const student = results[0];
        const skills = student.skills
        ? [...new Set(student.skills.split(","))]
        : [];
        let reply = "";

        if (message.toLowerCase().includes("eligible")) {
            if (student.cgpa >= 7 && skills.includes("DSA")) {
                reply = "You are likely eligible for companies like TCS.";
            } else {
                reply = "Improve CGPA or add skills like DSA.";
            }
        } 
        else if (message.toLowerCase().includes("skills")) {
            reply = `Your skills: ${skills.join(", ")}`;
        } 
        else {
            reply = "Ask about eligibility or skills.";
        }

        res.json({ reply });
    });
};