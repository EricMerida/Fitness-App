const mongoose = require("mongoose");

const setSchema = new mongoose.Schema(
  {
    reps: { type: Number, min: 0, required: true },
    weight: { type: Number, min: 0, default: 0 },
    durationSec: { type: Number, min: 0, default: 0 }, // optional cardio
    rpe: { type: Number, min: 0, max: 10, default: null },
  },
  { _id: false }
);

const exerciseSchema = new mongoose.Schema(
  {
    source: { type: String, enum: ["wger", "custom"], default: "custom" },
    externalId: { type: String, default: null }, // if from external API later
    name: { type: String, required: true, trim: true },
    muscleGroups: [{ type: String }],
    equipment: [{ type: String }],
    sets: { type: [setSchema], default: [] },
  },
  { _id: false }
);

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    date: { type: Date, index: true, required: true },
    title: { type: String, default: "Workout", trim: true },
    notes: { type: String, default: "" },
    exercises: { type: [exerciseSchema], default: [] },
    totalVolume: { type: Number, default: 0 }, // computed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
