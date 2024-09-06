const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getUserDetail = async (req, res) => {
  const { user_id } = req.query;

  try {
    // Find the user by ID
    const user = await prisma.user.findUnique({
      where: { id: parseInt(user_id) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let data = {};
    let sc_id = 0;
    let user_availability = "";
    if (user.type === "supporter") {
      //Check if user already in chat or not
      const chatMem = await prisma.support_chat_members.findFirst({
        where: { user_id: parseInt(user_id) },
      });
      if (chatMem) {
        const chat = await prisma.support_chat.findFirst({
          where: { sc_id: parseInt(chatMem.sc_id) },
        });
        if (
          chat.sc_status === "assigned" &&
          chatMem.user_id === parseInt(user_id)
        ) {
          sc_id = chat.sc_id;
          user_availability = chat.sc_status;
        }
      }
      //Check if user type is supporter[sc_id will assign by support admin to supporter]
      data = {
        id: user.id,
        username: user.username,
        email: user.email,
        type: user.type,
        sc_id: sc_id,
        user_availability: user_availability,
      };
    } else {
      //Check if user has sc_id or not
      const chat = await prisma.support_chat.findFirst({
        where: { user_id: parseInt(user_id) },
      });
      if (chat) {
        sc_id = chat.sc_id;
      }
      data = {
        id: user.id,
        username: user.username,
        email: user.email,
        type: user.type,
        sc_id: sc_id,
        user_availability: user_availability,
      };
    }

    // Respond with user details with sc_id
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    await prisma.$disconnect();
  }
};

exports.getUserChatDetail = async (req, res) => {
  const { scid, user_id } = req.query;

  try {
    // Find the chat by ID
    const chat = await prisma.support_chat.findUnique({
      where: { sc_id: parseInt(scid) },
    });

    let data;
    if (chat) {
      //Find chat member using scid & user_id
      const chat_member = await prisma.support_chat_members.findFirst({
        where: { sc_id: parseInt(scid), user_id: parseInt(user_id) },
      });

      let scm_id = 0;
      if (chat_member) {
        scm_id = chat_member.scm_id;
      }

      //Find chat messages using scid
      const chat_messages = await prisma.support_chat_message.findMany({
        where: { sc_id: parseInt(scid) },
      });

      let messages = [];
      if (chat_messages) {
        messages = chat_messages;
      }
      data = { scid: parseInt(scid), scm_id: scm_id, messages: messages };
    } else {
      data = { scid: parseInt(scid), scm_id: 0, messages: [] };
    }

    // Respond with chat details with scid, scm_id & messages
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    await prisma.$disconnect();
  }
};

exports.insertMessage = [
  // Validation and sanitization
  body("msg").trim(),
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { scmid, scid, user_id, msg } = req.body;

    try {
      let sc_id = scid;
      let scm_id = scmid;
      let pass_status = "";
      // Check if the user exists in support chat table
      const existingUserChat = await prisma.support_chat.findFirst({
        where: { sc_id: parseInt(sc_id) },
      });
      if (!existingUserChat) {
        pass_status = "open";
        const newUserChat = await prisma.support_chat.create({
          data: {
            user_id: user_id,
            sc_status: "open",
            sc_created_date: new Date(),
          },
        });
        sc_id = newUserChat.sc_id;
      } else {
        //If user exist in support_chat table then check its sc_status
        const user = await prisma.user.findUnique({
          where: { id: parseInt(user_id) },
        });
        if (
          user.type !== "supporter" &&
          existingUserChat.sc_status == "closed"
        ) {
          pass_status = "open";
          //If sc_status is closed then update it to open
          await prisma.support_chat.update({
            where: { sc_id },
            data: { sc_status: "open" },
          });
        }

        //Check Status for supporter & update it
        if (user.type === "supporter" && existingUserChat.sc_status == "open") {
          //If sc_status is closed then update it to open
          await prisma.support_chat.update({
            where: { sc_id },
            data: { sc_status: "assigned" },
          });
        }
      }

      // Check if the user exists in  support chat member table
      const existingUserChatMember =
        await prisma.support_chat_members.findFirst({
          where: { user_id: parseInt(user_id) },
        });

      if (!existingUserChatMember) {
        const newUserChatMember = await prisma.support_chat_members.create({
          data: {
            sc_id: sc_id,
            user_id: user_id,
            scm_created_date: new Date(),
          },
        });
        scm_id = newUserChatMember.scm_id;
      }

      //Insert message in support chat message table
      await prisma.support_chat_message.create({
        data: {
          scm_id: scm_id,
          sc_id: sc_id,
          user_id: user_id,
          msg: msg,
          msg_date: new Date(),
        },
      });

      res
        .status(201)
        .json({ message: "message sent successfully", sc_id, pass_status });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({ message: "Internal server error" });
    } finally {
      await prisma.$disconnect();
    }
  },
];

//Specific for supporter
exports.getAllUsers = async (req, res) => {
  try {
    // Find all users
    const users = await prisma.user.findMany({
      where: { type: "" },
    });

    if (!users) {
      return res.status(404).json({ message: "Users not found" });
    }

    let UsersLists = [];
    if (users) {
      const userPromise = users.map(async (user) => {
        const { id: user_id } = user; // Ensure correct destructuring of `user_id`

        // Check if user has sc_id or not
        const chat = await prisma.support_chat.findFirst({
          where: { user_id: parseInt(user_id) }, // Ensure user_id is an integer
        });

        if (chat) {
          const sc_id = chat.sc_id;
          const sc_status = chat.sc_status;

          return {
            id: user.id,
            username: user.username,
            email: user.email,
            sc_id: sc_id,
            sc_status: sc_status,
          };
        }

        // Return null or some default value if chat is not found
        return null;
      });

      // Wait for all promises and filter out null values
      UsersLists = (await Promise.all(userPromise)).filter(Boolean);
    }

    // Respond with user details with sc_id,sc_status
    res.status(200).json(UsersLists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    await prisma.$disconnect();
  }
};

exports.checkChatStatus = async (req, res) => {
  const { sc_id } = req.query;

  try {
    // Find the support chat by ID
    const chat = await prisma.support_chat.findUnique({
      where: { sc_id: parseInt(sc_id) },
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Respond with support chat details
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    await prisma.$disconnect();
  }
};

exports.closeSupportChat = async (req, res) => {
  try {
    const { scid, user_id } = req.params;

    await prisma.support_chat.update({
      where: { sc_id: parseInt(scid) },
      data: { sc_status: "closed" },
    });

    const getSCMID = await prisma.support_chat_members.findFirst({
      where: { user_id: parseInt(user_id), sc_id: parseInt(scid) },
    });

    let scmid = 0;
    if (getSCMID) {
      scmid = getSCMID.scm_id;
    }

    await prisma.support_chat_message.create({
      data: {
        scm_id: parseInt(scmid),
        sc_id: parseInt(scid),
        user_id: parseInt(user_id),
        msg: "This chat is closed by supporter. Type new message to start chat.",
        msg_date: new Date(),
        custom_msg: "yes",
      },
    });

    res.status(200).json({ message: "Closed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
};
