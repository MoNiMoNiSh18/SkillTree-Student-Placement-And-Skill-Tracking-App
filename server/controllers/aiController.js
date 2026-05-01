const fs = require("fs");
const pdf = require("pdf-parse");
const db = require("../config/db");

const SKILLS = ["DSA", "Java", "Python", "React", "Node", "SQL"];

exports.uploadResume = async (req, res) => {
    try {
        const filePath = req.file.path;

        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);

        const text = data.text.toLowerCase();

        const detectedSkills = SKILLS.filter(skill =>
            text.includes(skill.toLowerCase())
        );

        const student_id = req.body.student_id;

        detectedSkills.forEach(skill => {
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
            db.query(query, [student_id, skill, student_id]);
        });

        fs.unlinkSync(filePath);

        res.json({
            message: "Resume analyzed",
            detectedSkills
        });

    } catch (err) {
        res.status(500).json(err);
    }
};

// Chatbot (local AI)
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
        const skills = student.skills ? student.skills.split(",") : [];

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