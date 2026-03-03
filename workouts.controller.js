const mongoose = require("mongoose");
const Workout = require("../models/Workout");
const { calcWorkoutVolume } = require("../utils/calc");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// POST /workouts
async function createWorkout(req, res, next) {
  try {
    const { date, title, notes, exercises } = req.body || {};

    if (!date) return res.status(400).json({ error: "date is required" });
    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({ error: "exercises must be a non-empty array" });
    }

    // basic validation for exercise names
    for (const ex of exercises) {
      if (!ex?.name) return res.status(400).json({ error: "each exercise must have a name" });
      if (!Array.isArray(ex.sets)) return res.status(400).json({ error: "each exercise must have sets array" });
    }

    const workout = new Workout({
      user: req.user.id,
      date: new Date(date),
      title: title || "Workout",
      notes: notes || "",
      exercises,
    });

    workout.totalVolume = calcWorkoutVolume(workout);
    await workout.save();

    return res.status(201).json(workout);
  } catch (err) {
    return next(err);
  }
}

// GET /workouts?page=1&limit=10&from=YYYY-MM-DD&to=YYYY-MM-DD
async function listWorkouts(req, res, next) {
  try {
    let { page = 1, limit = 10, from, to } = req.query;

    page = Math.max(1, parseInt(page, 10) || 1);
    limit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const [items, total] = await Promise.all([
      Workout.find(filter).sort({ date: -1 }).skip(skip).limit(limit),
      Workout.countDocuments(filter),
    ]);

    return res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      items,
    });
  } catch (err) {
    return next(err);
  }
}

// GET /workouts/:id
async function getWorkout(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "invalid workout id" });

    const workout = await Workout.findOne({ _id: id, user: req.user.id });
    if (!workout) return res.status(404).json({ error: "workout not found" });

    return res.json(workout);
  } catch (err) {
    return next(err);
  }
}

// DELETE /workouts/:id
async function deleteWorkout(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ error: "invalid workout id" });

    const deleted = await Workout.findOneAndDelete({ _id: id, user: req.user.id });
    if (!deleted) return res.status(404).json({ error: "workout not found" });

    return res.json({ ok: true });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createWorkout, listWorkouts, getWorkout, deleteWorkout };

