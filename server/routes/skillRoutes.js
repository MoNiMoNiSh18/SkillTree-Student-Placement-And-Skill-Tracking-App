const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skillController");

router.post("/add", skillController.addSkill);
router.post("/assign", skillController.addStudentSkill);
router.get("/:student_id", skillController.getStudentSkills);

module.exports = router;