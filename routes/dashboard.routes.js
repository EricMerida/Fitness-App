const express = require("express");
const router = express.Router();

const { authRequired } = require("../middlewares/auth");
const { getDashboard } = require("../controllers/dashboard.controller");

router.use(authRequired);

router.get("/", getDashboard);

module.exports = router;
