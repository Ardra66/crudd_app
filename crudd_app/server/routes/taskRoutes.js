const express = require("express");
const router = express.Router();

const {
  authenticateToken,
  allowRoles,
} = require("../middleware/authMiddleware");

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.use(authenticateToken);

router.get("/", getTasks);
router.post("/", allowRoles("user"), createTask);
router.put("/:id", allowRoles("user"), updateTask);
router.delete("/:id", allowRoles("admin", "user"), deleteTask);

module.exports = router;