const mongoose = require("mongoose");

const goalsSchema = new mongoose.Schema(
  {
    calorieTarget: { type: Number, min: 0, default: 2000 },
    proteinTarget: { type: Number, min: 0, default: 150 },
    carbsTarget: { type: Number, min: 0, default: 200 },
    fatsTarget: { type: Number, min: 0, default: 70 },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    displayName: { type: String, default: "", trim: true },
    heightCm: { type: Number, min: 0, default: null },
    weightLb: { type: Number, min: 0, default: null },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very_active"],
      default: "moderate",
    },
    goals: { type: goalsSchema, default: () => ({}) },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    passwordHash: { 
        type: String, 
        required: true 
    },
    profile: { type: profileSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
