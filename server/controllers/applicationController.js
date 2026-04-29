const db = require("../config/db");

// Apply to company
exports.apply = (req, res) => {
    const { student_id, company_id } = req.body;

    const sql = "INSERT INTO applications (student_id, company_id) VALUES (?, ?)";

    db.query(sql, [student_id, company_id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Applied successfully" });
    });
};

// Get applications for student
exports.getStudentApplications = (req, res) => {
    const { student_id } = req.params;

    const sql = `
        SELECT c.name, a.status
        FROM applications a
        JOIN companies c ON a.company_id = c.id
        WHERE a.student_id = ?
    `;

    db.query(sql, [student_id], (err, results) => {
        if (err) return res.status(500).json(err);

        res.json(results);
    });
};

// Update status (admin)
exports.updateStatus = (req, res) => {
    const { application_id, status } = req.body;

    const sql = "UPDATE applications SET status = ? WHERE id = ?";

    db.query(sql, [status, application_id], (err) => {
        if (err) return res.status(500).json(err);

        res.json({ message: "Status updated" });
    });
};