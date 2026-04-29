const db = require("../config/db");

exports.addSkill = (req, res) => {
    const { name } = req.body;

    const sql = "INSERT INTO skills (name) VALUES (?)";

    db.query(sql, [name], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Skill added" });
    });
};

exports.addStudentSkill = (req, res) => {
    const { student_id, skill_id, level } = req.body;

    const sql = "INSERT INTO student_skills (student_id, skill_id, level) VALUES (?, ?, ?)";

    db.query(sql, [student_id, skill_id, level], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Skill assigned to student" });
    });
};

exports.getStudentSkills = (req, res) => {
    const { student_id } = req.params;

    const sql = `
        SELECT s.name, ss.level
        FROM student_skills ss
        JOIN skills s ON ss.skill_id = s.id
        WHERE ss.student_id = ?
    `;

    db.query(sql, [student_id], (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
};