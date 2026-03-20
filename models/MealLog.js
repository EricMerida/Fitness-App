const mongoose = require("mongoose");

const macroSchema = new mongoose.Schema(
  {
    calories: { type: Number, min: 0, default: 0 },
    protein: { type: Number, min: 0, default: 0 },
    carbs: { type: Number, min: 0, default: 0 },
    fats: { type: Number, min: 0, default: 0 },
  },
  { _id: false }
);

const mealLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    date: { type: Date, index: true, required: true }, // day of log
    mealType: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"], default: "snack" },

    // food item
    name: { type: String, required: true, trim: true },
    servingSize: { type: String, default: "1 serving" },
    quantity: { type: Number, min: 0, default: 1 },

    macros: { type: macroSchema, default: () => ({}) },

    // for later if from USDA/OFF
    source: { type: String, enum: ["custom", "usda", "openfoodfacts"], default: "custom" },
    externalId: { type: String, default: null },
    barcode: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MealLog", mealLogSchema);
