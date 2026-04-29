const express = require("express");
const router = express.Router();
const controller = require("../controllers/applicationController");

router.post("/apply", controller.apply);
router.get("/:student_id", controller.getStudentApplications);
router.put("/status", controller.updateStatus);

module.exports = router;