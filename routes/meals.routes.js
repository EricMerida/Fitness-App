const express = require("express");
const router = express.Router();

const { authRequired } = require("../middlewares/auth");
const { createMeal, listMeals, deleteMeal } = require("../controllers/meals.controller");

router.use(authRequired);

router.post("/", createMeal);
router.get("/", listMeals);
router.delete("/:id", deleteMeal);

module.exports = router;