const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("SkillTrack API Running...");
});
const skillRoutes = require("./routes/skillRoutes");

app.use("/api/skills", skillRoutes);

const companyRoutes = require("./routes/companyRoutes");

app.use("/api/companies", companyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});