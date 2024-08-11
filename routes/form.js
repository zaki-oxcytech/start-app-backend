const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");

router.post("/form-details", formController.formDetails);
router.get("/allProfiles", formController.getAllData);

module.exports = router;
