const db = require("../config/db");

exports.addCompany = (req, res) => {
    const { name, min_cgpa, required_skill } = req.body;

    const sql = "INSERT INTO companies (name, min_cgpa, required_skill) VALUES (?, ?, ?)";

    db.query(sql, [name, min_cgpa, required_skill], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Company added" });
    });
};

exports.getCompanies = (req, res) => {
    const sql = "SELECT * FROM companies";

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
};

exports.checkEligibility = (req, res) => {
    const { student_id } = req.params;

    const query = `
        SELECT 
            c.id,
            c.name,
            c.min_cgpa,
            c.required_skill,
            (
                SELECT cgpa FROM students WHERE id = ?
            ) AS cgpa,
            CASE 
                WHEN (
                    SELECT cgpa FROM students WHERE id = ?
                ) >= c.min_cgpa
                AND c.required_skill IN (
                    SELECT sk.name 
                    FROM student_skills ss
                    JOIN skills sk ON ss.skill_id = sk.id
                    WHERE ss.student_id = ?
                )
                THEN 'Eligible'
                ELSE 'Not Eligible'
            END AS status
        FROM companies c
    `;

    db.query(query, [student_id, student_id, student_id], (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
};

exports.dashboardStats = (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM students) AS total_students,
            (SELECT COUNT(*) FROM companies) AS total_companies,
            (SELECT COUNT(*) FROM applications) AS total_applications
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results[0]);
    });
};
