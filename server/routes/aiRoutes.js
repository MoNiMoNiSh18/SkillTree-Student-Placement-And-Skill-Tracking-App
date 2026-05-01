const express = require("express");
const router = express.Router();
const multer = require("multer");
const aiController = require("../controllers/aiController");

const upload = multer({ dest: "uploads/" });

router.post("/resume", upload.single("resume"), aiController.uploadResume);
router.post("/chat", aiController.chatbot);
module.exports = router;