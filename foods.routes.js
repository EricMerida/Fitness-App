const express = require("express");
const router = express.Router();

const { authRequired } = require("../middlewares/auth");
const { searchFoods } = require("../controllers/foods.controller");

router.use(authRequired);

// GET /foods/search?q=chicken
router.get("/search", searchFoods);

module.exports = router;