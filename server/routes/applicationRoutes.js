const express = require("express");
const router = express.Router();
const controller = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/apply", authMiddleware, controller.apply);
router.get("/:student_id", controller.getStudentApplications);
router.put("/status", controller.updateStatus);

module.exports = router;