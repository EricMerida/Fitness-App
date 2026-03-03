const User = require("../models/User");

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select("username profile");
    if (!user) return res.status(404).json({ error: "user not found" });
    return res.json({ username: user.username, profile: user.profile });
  } catch (err) {
    return next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { displayName, heightCm, weightLb, activityLevel, goals } = req.body || {};

    const patch = {};
    if (displayName !== undefined) patch["profile.displayName"] = String(displayName);
    if (heightCm !== undefined) patch["profile.heightCm"] = heightCm === null ? null : Number(heightCm);
    if (weightLb !== undefined) patch["profile.weightLb"] = weightLb === null ? null : Number(weightLb);

    if (activityLevel !== undefined) {
      patch["profile.activityLevel"] = activityLevel;
    }

    if (goals) {
      if (goals.calorieTarget !== undefined) patch["profile.goals.calorieTarget"] = Number(goals.calorieTarget);
      if (goals.proteinTarget !== undefined) patch["profile.goals.proteinTarget"] = Number(goals.proteinTarget);
      if (goals.carbsTarget !== undefined) patch["profile.goals.carbsTarget"] = Number(goals.carbsTarget);
      if (goals.fatsTarget !== undefined) patch["profile.goals.fatsTarget"] = Number(goals.fatsTarget);
    }

    const user = await User.findByIdAndUpdate(req.user.id, { $set: patch }, { new: true })
      .select("username profile");

    return res.json({ username: user.username, profile: user.profile });
  } catch (err) {
    return next(err);
  }
}

module.exports = { getProfile, updateProfile };