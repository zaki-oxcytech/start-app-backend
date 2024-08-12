const { body, validationResult } = require("express-validator");
const { PrismaClient } = require("@prisma/client"); // Use PrismaClient, not just @prisma/client
const prisma = new PrismaClient();

exports.formDetails = [
  // Validate and sanitize inputs
  body("name")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Name must be at least 4 characters long")
    .escape(),
  body("email").isEmail().withMessage("Invalid email address").normalizeEmail(),
  body("serviceType")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Service must be at least 4 characters long")
    .escape(),
  body("projectName")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Name must be at least 4 characters long")
    .escape(),
  body("teamLeader")
    .trim()
    .isLength({ min: 4 })
    .withMessage("team leader name must be at least 4 characters long")
    .escape(),
  body("teamMember")
    .isArray({ min: 1 })
    .withMessage("teamMember must be a non-empty array"),
  body("teamMember.*")
    .isString()
    .withMessage("Each team member must be a string")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Each team member name must be at least 4 characters long")
    .escape(),
  body("size")
    .trim()
    .isLength({ min: 4 })
    .withMessage("size must be at least 4 characters long")
    .escape(),
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      email,
      serviceType,
      projectName,
      teamLeader,
      teamMember,
      cost,
      size,
      priority,
      projectType,
      details,
      date,
    } = req.body;

    try {
      const formData = await prisma.detail.create({
        data: {
          name,
          email,
          serviceType,
          projectName,
          teamLeader,
          teamMember,
          cost,
          size,
          priority,
          projectType,
          details,
          date: new Date(date),
        },
      });
      res.status(200).json(formData);
    } catch (error) {
      console.error("Error creating form Data:", {
        name,
        email,
        serviceType,
        date,
        projectName,
        teamLeader,
        teamMember,
        cost,
        size,
        priority,
        projectType,
        details,
        error,
      });
      res.status(500).json({ error: "Internal Server Error" });
      // res.status(500).json(error.message);
    }
  },
];

exports.getAllData = async (req, res) => {
  try {
    const allUsers = await prisma.detail.findMany();
    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

exports.editFormData = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRecord = await prisma.detail.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteItem = await prisma.detail.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "item Deleted successfully!", itemId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    await prisma.$disconnect();
  }
};
