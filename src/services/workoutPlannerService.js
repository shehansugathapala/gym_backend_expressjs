const pool = require('../config/db');
const ApiError = require('../utils/ApiError');
const loadSql = require('../utils/loadSql');

const Q = loadSql('workout_planner.sql');

// ============================================================================
// EXERCISE LIBRARY
// ============================================================================

const EXERCISES = {
  cardio: {
    beginner:      ['Brisk Walk 20 min', 'Cycling 15 min', 'Jump Rope 10 min'],
    intermediate:  ['Jogging 25 min', 'Cycling 25 min', 'Jump Rope 20 min', 'Rowing 15 min'],
    advanced:      ['Running 30 min', 'HIIT Sprints 20 min', 'Rowing 25 min', 'Stair Climber 20 min'],
  },
  strength_upper: {
    beginner:      ['Push-ups 3x10', 'Dumbbell Shoulder Press 3x10', 'Dumbbell Row 3x10', 'Bicep Curl 3x12'],
    intermediate:  ['Bench Press 4x8', 'Overhead Press 4x8', 'Pull-ups 3x8', 'Cable Row 4x10', 'Tricep Dips 3x12'],
    advanced:      ['Weighted Bench Press 5x5', 'Weighted Pull-ups 4x6', 'Incline Press 4x8', 'Barbell Row 4x6', 'Arnold Press 4x8'],
  },
  strength_lower: {
    beginner:      ['Bodyweight Squat 3x12', 'Glute Bridge 3x15', 'Lunges 3x10', 'Calf Raises 3x15'],
    intermediate:  ['Barbell Squat 4x8', 'Romanian Deadlift 4x8', 'Leg Press 4x10', 'Walking Lunges 3x12', 'Leg Curl 3x12'],
    advanced:      ['Heavy Barbell Squat 5x5', 'Deadlift 4x5', 'Bulgarian Split Squat 4x8', 'Leg Press 4x10', 'Nordic Curls 3x8'],
  },
  strength_full: {
    beginner:      ['Bodyweight Squat 3x10', 'Push-ups 3x8', 'Plank 3x20s', 'Dumbbell Row 3x10', 'Glute Bridge 3x12'],
    intermediate:  ['Goblet Squat 4x10', 'Dumbbell Press 4x10', 'Pull-ups 3x8', 'Romanian Deadlift 3x10', 'Plank 3x30s'],
    advanced:      ['Barbell Squat 4x8', 'Bench Press 4x8', 'Deadlift 3x6', 'Pull-ups 4x8', 'Overhead Press 3x8'],
  },
  core: {
    beginner:      ['Plank 3x20s', 'Dead Bug 3x8', 'Bird Dog 3x8'],
    intermediate:  ['Plank 3x45s', 'Russian Twist 3x15', 'Leg Raises 3x12', 'Ab Rollout 3x10'],
    advanced:      ['Plank 3x60s', 'Dragon Flag 3x6', 'Ab Wheel Rollout 3x12', 'Hanging Leg Raise 3x12'],
  },
  endurance: {
    beginner:      ['Walk/Jog Intervals 20 min', 'Cycling 20 min', 'Low-impact Aerobics 20 min'],
    intermediate:  ['Tempo Run 25 min', 'Cycling 35 min', 'Swimming 20 min', 'Elliptical 30 min'],
    advanced:      ['Long Run 40 min', 'Cycling 50 min', 'Swimming 35 min', 'Circuit Training 30 min'],
  },
};

// ============================================================================
// TEMPLATE BUILDER
// Day names used per days_per_week count
// ============================================================================

const DAY_NAMES = {
  2: ['Day 1', 'Day 2'],
  3: ['Day 1', 'Day 2', 'Day 3'],
  4: ['Day 1', 'Day 2', 'Day 3', 'Day 4'],
  5: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
  6: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6'],
};

// Returns a set of exercises for a given type and level
const getExercises = (type, level) => EXERCISES[type][level] || EXERCISES[type].beginner;

// ============================================================================
// RULE-BASED PLAN GENERATOR
// Decision tree: goal + level + days_per_week → template
// ============================================================================

const buildPlan = (goal, level, days) => {
  const days_list = DAY_NAMES[days];

  // ── LOSE WEIGHT ────────────────────────────────────────────────────────────
  if (goal === 'lose_weight') {
    if (days === 2) {
      return days_list.map((day, i) => ({
        day,
        focus: i % 2 === 0 ? 'Full Body + Cardio' : 'Cardio + Core',
        exercises: i % 2 === 0
          ? [...getExercises('strength_full', level), ...getExercises('cardio', level).slice(0, 1)]
          : [...getExercises('cardio', level), ...getExercises('core', level)],
      }));
    }
    if (days === 3) {
      return days_list.map((day, i) => ({
        day,
        focus: ['Full Body', 'Cardio', 'Full Body + Core'][i],
        exercises: [
          getExercises('strength_full', level),
          getExercises('cardio', level),
          [...getExercises('strength_full', level).slice(0, 3), ...getExercises('core', level)],
        ][i],
      }));
    }
    // 4–6 days
    return days_list.map((day, i) => {
      const pattern = i % 4;
      const focuses  = ['Upper Body + Cardio', 'Lower Body + Cardio', 'Cardio + Core', 'Full Body'];
      const ex = [
        [...getExercises('strength_upper', level), ...getExercises('cardio', level).slice(0, 1)],
        [...getExercises('strength_lower', level), ...getExercises('cardio', level).slice(0, 1)],
        [...getExercises('cardio', level), ...getExercises('core', level)],
        getExercises('strength_full', level),
      ];
      return { day, focus: focuses[pattern], exercises: ex[pattern] };
    });
  }

  // ── BUILD MUSCLE ───────────────────────────────────────────────────────────
  if (goal === 'build_muscle') {
    if (days <= 3) {
      return days_list.map((day, i) => ({
        day,
        focus: ['Upper Body', 'Lower Body', 'Full Body'][i % 3],
        exercises: [
          getExercises('strength_upper', level),
          getExercises('strength_lower', level),
          getExercises('strength_full', level),
        ][i % 3],
      }));
    }
    // 4–6 days: push/pull/legs split
    const split = ['Push (Chest/Shoulders/Triceps)', 'Pull (Back/Biceps)', 'Legs', 'Push', 'Pull', 'Legs'];
    const splitEx = [
      getExercises('strength_upper', level).slice(0, 4),
      getExercises('strength_upper', level).slice(2),
      getExercises('strength_lower', level),
      getExercises('strength_upper', level).slice(0, 4),
      getExercises('strength_upper', level).slice(2),
      getExercises('strength_lower', level),
    ];
    return days_list.map((day, i) => ({
      day,
      focus: split[i],
      exercises: splitEx[i],
    }));
  }

  // ── STAY FIT ───────────────────────────────────────────────────────────────
  if (goal === 'stay_fit') {
    return days_list.map((day, i) => {
      const pattern = i % 3;
      return {
        day,
        focus: ['Full Body', 'Cardio + Core', 'Full Body'][pattern],
        exercises: [
          getExercises('strength_full', level),
          [...getExercises('cardio', level), ...getExercises('core', level)],
          getExercises('strength_full', level),
        ][pattern],
      };
    });
  }

  // ── ENDURANCE ──────────────────────────────────────────────────────────────
  if (goal === 'endurance') {
    return days_list.map((day, i) => {
      const pattern = i % 3;
      return {
        day,
        focus: ['Endurance Cardio', 'Strength + Core', 'Long Cardio'][pattern],
        exercises: [
          getExercises('endurance', level),
          [...getExercises('strength_full', level).slice(0, 3), ...getExercises('core', level)],
          getExercises('endurance', level).map(e => e.replace(/\d+/, (n) => String(parseInt(n) + 10))),
        ][pattern],
      };
    });
  }

  throw new ApiError(400, 'Invalid goal');
};

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

const generatePlan = async (memberId, { goal, level, days_per_week }) => {
  const schedule = buildPlan(goal, level, days_per_week);

  const plan = {
    summary: {
      goal,
      level,
      days_per_week,
      generated_at: new Date().toISOString(),
    },
    schedule,
    tips: getTips(goal, level),
  };

  const result = await pool.query(Q.save, [
    memberId,
    goal,
    level,
    days_per_week,
    JSON.stringify(plan),
  ]);

  return result.rows[0];
};

const getPlansByMember = async (memberId) => {
  const result = await pool.query(Q.getByMemberId, [memberId]);
  return result.rows;
};

const getPlanById = async (id) => {
  const result = await pool.query(Q.getById, [id]);
  if (result.rows.length === 0) throw new ApiError(404, 'Workout plan not found');
  return result.rows[0];
};

const deletePlan = async (id) => {
  const existing = await pool.query(Q.getById, [id]);
  if (existing.rows.length === 0) throw new ApiError(404, 'Workout plan not found');
  await pool.query(Q.deleteById, [id]);
};

// ============================================================================
// TIPS HELPER
// ============================================================================

const getTips = (goal, level) => {
  const base = {
    lose_weight:   ['Stay in a caloric deficit', 'Prioritise sleep for fat loss', 'Drink at least 2L of water daily'],
    build_muscle:  ['Eat enough protein (1.6–2.2g per kg bodyweight)', 'Progressive overload every week', 'Rest at least 48h between same muscle groups'],
    stay_fit:      ['Consistency beats intensity', 'Mix strength and cardio each week', 'Stretch after every session'],
    endurance:     ['Build mileage gradually (10% rule)', 'Add one long session per week', 'Fuel with carbs before long sessions'],
  };
  const levelTip = {
    beginner:      'Focus on form before adding weight.',
    intermediate:  'Track your lifts to ensure progressive overload.',
    advanced:      'Periodize your training — include deload weeks every 4–6 weeks.',
  };
  return [...(base[goal] || []), levelTip[level]];
};

module.exports = { generatePlan, getPlansByMember, getPlanById, deletePlan };
