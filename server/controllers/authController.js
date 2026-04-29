const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
    const { name, email, password, branch, cgpa } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const userSql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

    db.query(userSql, [name, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json(err);

        const userId = result.insertId;

        const studentSql = "INSERT INTO students (user_id, branch, cgpa) VALUES (?, ?, ?)";

        db.query(studentSql, [userId, branch, cgpa], (err2) => {
            if (err2) return res.status(500).json(err2);

            res.json({ message: "User + Student profile created" });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).json(err);

        if (results.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = results[0];

        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful",
            token
        });
    });
};