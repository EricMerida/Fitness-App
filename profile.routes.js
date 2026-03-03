const express = require("express");
const router = express.Router();
const { authRequired } = require("../middlewares/auth");
const { getProfile, updateProfile } = require("../controllers/profile.controller");

router.use(authRequired);

router.get("/", getProfile);
router.put("/", updateProfile);

module.exports = router;
