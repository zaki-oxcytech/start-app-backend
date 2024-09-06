const express = require("express");
const router = express.Router();

const chatSupportController = require("../controllers/chatSupportController");

// Used PGSQL as Database here

router.get("/get-user-detail", chatSupportController.getUserDetail);
router.get("/get-user-chat-detail", chatSupportController.getUserChatDetail);
router.post("/insert-message", chatSupportController.insertMessage);

//Specific for supporter
router.get("/get-all-users", chatSupportController.getAllUsers);
router.get("/check-chat-status", chatSupportController.checkChatStatus);
router.patch(
  "/close-support-chat/:scid/:user_id",
  chatSupportController.closeSupportChat
);

module.exports = router;
