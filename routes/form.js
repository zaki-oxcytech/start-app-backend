const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");

router.post("/form-details", formController.formDetails);
router.get("/allProfiles", formController.getAllData);
router.patch("/updateProfile/:id", formController.editFormData);
router.delete("/deleteItem/:id", formController.deleteItem);

module.exports = router;
