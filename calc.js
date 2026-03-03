function calcWorkoutVolume(workout) {
  let volume = 0;

  for (const ex of workout.exercises || []) {
    for (const set of ex.sets || []) {
      const reps = Number(set.reps || 0);
      const weight = Number(set.weight || 0);
      volume += reps * weight;
    }
  }

  return volume;
}

module.exports = { calcWorkoutVolume };
