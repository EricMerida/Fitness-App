const express = require("express");
const router = express.Router();

const { authRequired } = require("../middlewares/auth");
const {
  createWorkout,
  listWorkouts,
  getWorkout,
  deleteWorkout,
} = require("../controllers/workouts.controller");

router.use(authRequired);

router.post("/", createWorkout);
router.get("/", listWorkouts);
router.get("/:id", getWorkout);
router.delete("/:id", deleteWorkout);

module.exports = router;
