const express = require("express");
const router = express.Router();
const companyController = require("../controllers/companyController");

router.post("/add", companyController.addCompany);
router.get("/", companyController.getCompanies);
router.get("/eligibility/:student_id", companyController.checkEligibility);
router.get("/dashboard", companyController.dashboardStats);
module.exports = router;