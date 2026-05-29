import { G } from '../theme';
import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Chip,
  Button, LinearProgress, Divider, Tabs, Tab, List,
  ListItem, ListItemIcon, ListItemText, Checkbox, IconButton,
  Accordion, AccordionSummary, AccordionDetails, TextField, Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SpotifyWidget from '../components/SpotifyWidget';

const getDayIndex = () => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000) % 7;

const weeklyPlan = [
  {
    day: "Monday",
    focus: "Upper Body Strength",
    icon: "💪",
    workout: {
      warmup: "5 min light jogging in place + arm circles + shoulder rolls",
      exercises: [
        { name: "Push-Ups", sets: "4 sets × 12 reps", rest: "60 sec", muscles: "Chest, Triceps, Shoulders", howTo: "Start in plank position, lower chest to floor keeping body straight, push back up. Keep core tight throughout." },
        { name: "Pike Push-Ups", sets: "3 sets × 10 reps", rest: "60 sec", muscles: "Shoulders", howTo: "Start in downward dog position (hips high, straight legs). Bend elbows to lower head toward floor, push back up." },
        { name: "Tricep Dips (chair)", sets: "3 sets × 15 reps", rest: "45 sec", muscles: "Triceps", howTo: "Hands on edge of chair, slide off the edge, lower body by bending elbows to 90°, push back up." },
        { name: "Superman Hold", sets: "3 sets × 30 sec hold", rest: "45 sec", muscles: "Lower Back", howTo: "Lie face down, simultaneously lift arms and legs off ground, hold. Keep neck neutral." },
        { name: "Plank", sets: "3 sets × 45 sec", rest: "30 sec", muscles: "Core", howTo: "Elbows under shoulders, body in straight line from head to heels. Don't let hips drop or rise." },
      ],
      cooldown: "5 min: neck rolls, chest stretch, shoulder cross-body stretch, child's pose",
      totalTime: "35–40 minutes",
      calories: "200–280 calories"
    },
    meal: {
      name: "High-Protein Power Bowl",
      calories: "650 kcal",
      macros: { protein: "52g", carbs: "58g", fat: "18g" },
      prepTime: "20 minutes",
      ingredients: [
        "200g chicken breast (or 200g firm tofu for vegetarian)",
        "100g cooked quinoa (about 1/3 cup dry)",
        "1 cup spinach leaves",
        "1/2 cup cherry tomatoes, halved",
        "1/4 avocado, sliced",
        "1/4 red onion, thin slices",
        "1 tablespoon olive oil",
        "1 teaspoon garlic powder",
        "Salt, pepper, lemon juice to taste"
      ],
      steps: [
        "Cook quinoa: 1 part quinoa + 2 parts water, boil then simmer 15 min covered",
        "Season chicken with garlic powder, salt, pepper. Cook in pan with olive oil on medium heat, 6–7 min per side until internal temp is 165°F",
        "Slice chicken once rested (5 min rest is key — keeps it juicy)",
        "Layer bowl: quinoa base → spinach → chicken → tomatoes, onion, avocado",
        "Drizzle with lemon juice and a tiny bit more olive oil"
      ],
      mealPrepTip: "Cook 4× the chicken and quinoa on Sunday. This meal takes 3 minutes when ingredients are ready.",
      whyItWorks: "High protein supports muscle recovery after upper body training. Quinoa has all essential amino acids. Avocado provides healthy fats for hormone production."
    }
  },
  {
    day: "Tuesday",
    focus: "Cardio & Core",
    icon: "🔥",
    workout: {
      warmup: "5 min walk → light jog, increasing pace gradually",
      exercises: [
        { name: "Jump Rope (or simulate)", sets: "3 × 3 min", rest: "90 sec", muscles: "Full body cardio", howTo: "If no rope, simulate the jumping motion and arm rotation. Keep on balls of feet, small jumps." },
        { name: "Burpees", sets: "4 sets × 10 reps", rest: "60 sec", muscles: "Full body", howTo: "Stand → squat down → jump feet back to plank → do a push-up → jump feet forward → jump up with hands overhead." },
        { name: "Mountain Climbers", sets: "3 sets × 40 reps (20 each leg)", rest: "45 sec", muscles: "Core, Shoulders", howTo: "Plank position, drive knees to chest alternately in a running motion. Keep hips level." },
        { name: "Russian Twists", sets: "3 sets × 20 reps", rest: "30 sec", muscles: "Obliques", howTo: "Sit with knees bent, lean back 45°, hold hands together, rotate side to side. Harder: lift feet off floor." },
        { name: "Bicycle Crunches", sets: "3 sets × 30 reps", rest: "30 sec", muscles: "Core, Abs", howTo: "Lie on back, hands behind head, bring opposite elbow to opposite knee while extending the other leg, alternate." },
      ],
      cooldown: "5 min: deep breathing, hip flexor stretch, hamstring stretch, spinal twist",
      totalTime: "30–35 minutes",
      calories: "320–400 calories"
    },
    meal: {
      name: "Salmon & Sweet Potato Recovery Plate",
      calories: "580 kcal",
      macros: { protein: "42g", carbs: "52g", fat: "22g" },
      prepTime: "25 minutes",
      ingredients: [
        "180g salmon fillet (wild-caught preferred)",
        "200g sweet potato (1 medium)",
        "2 cups mixed greens or arugula",
        "1/2 lemon",
        "1 tablespoon olive oil",
        "1 teaspoon paprika",
        "1 teaspoon dried herbs (thyme or rosemary)",
        "Salt and pepper"
      ],
      steps: [
        "Preheat oven to 400°F / 200°C",
        "Cube sweet potato, toss with olive oil, paprika, salt — roast 20–25 min until golden",
        "Season salmon with herbs, salt, pepper. Pan-sear skin-side down for 4 min, flip for 2 min. Don't move it — let it sear.",
        "Squeeze lemon over salmon when done",
        "Plate: greens → sweet potato → salmon on top"
      ],
      mealPrepTip: "Roast a whole tray of sweet potato cubes weekly. They reheat perfectly. Salmon is best fresh but can be prepped 1 day ahead.",
      whyItWorks: "Salmon's omega-3s reduce inflammation after cardio. Sweet potato provides fast-digesting carbs to replenish glycogen. High in vitamins A, C for immune support."
    }
  },
  {
    day: "Wednesday",
    focus: "Lower Body Power",
    icon: "🦵",
    workout: {
      warmup: "5 min: leg swings, hip circles, bodyweight squats × 10, ankle rotations",
      exercises: [
        { name: "Bodyweight Squats", sets: "4 sets × 20 reps", rest: "60 sec", muscles: "Quads, Glutes, Hamstrings", howTo: "Feet shoulder-width, toes slightly out. Lower until thighs parallel (or lower), keep chest up, knees track over toes. Drive through heels to stand." },
        { name: "Bulgarian Split Squats", sets: "3 sets × 12 reps each leg", rest: "75 sec", muscles: "Quads, Glutes", howTo: "Back foot elevated on chair, front foot forward. Lower back knee toward floor, front knee stays behind toes. Keep torso upright." },
        { name: "Glute Bridges", sets: "4 sets × 20 reps", rest: "45 sec", muscles: "Glutes, Hamstrings", howTo: "Lie on back, feet flat, drive hips up squeezing glutes hard at top. Don't arch lower back. Slow and controlled." },
        { name: "Calf Raises", sets: "3 sets × 25 reps", rest: "30 sec", muscles: "Calves", howTo: "Stand on edge of step if available, lower heels below step level, rise up as high as possible. Pause at top." },
        { name: "Wall Sit", sets: "3 × 45 sec", rest: "60 sec", muscles: "Quads", howTo: "Back flat on wall, thighs parallel to floor, knees at 90°. Hold. Feel the burn — that's it working." },
      ],
      cooldown: "5 min: pigeon pose (each side), quad stretch, figure-4 glute stretch, hamstring stretch",
      totalTime: "40 minutes",
      calories: "250–330 calories"
    },
    meal: {
      name: "Turkey & Brown Rice Stir-Fry",
      calories: "620 kcal",
      macros: { protein: "48g", carbs: "65g", fat: "14g" },
      prepTime: "20 minutes",
      ingredients: [
        "200g ground turkey (or chicken)",
        "150g cooked brown rice",
        "1 cup broccoli florets",
        "1/2 bell pepper, sliced",
        "1 carrot, julienned",
        "2 cloves garlic, minced",
        "2 tablespoons soy sauce (low sodium)",
        "1 teaspoon sesame oil",
        "1 teaspoon ginger (fresh or powder)",
        "1 tablespoon olive oil"
      ],
      steps: [
        "Cook brown rice if not prepped (30 min) — this is why meal prep matters",
        "Heat olive oil in pan/wok on high. Add garlic and ginger, stir 30 seconds until fragrant",
        "Add turkey, break apart with spatula, cook until no pink remains (5–7 min)",
        "Push turkey to side, add vegetables. Stir-fry 3–4 min until tender-crisp",
        "Add cooked rice, soy sauce, sesame oil. Toss everything together for 2 min.",
        "Taste and adjust seasoning"
      ],
      mealPrepTip: "This is the ultimate meal prep dish. Make 4× portions in one pan, store in containers. Reheats in 90 seconds. Tastes better the next day.",
      whyItWorks: "After leg day, your muscles need glycogen replenishment (brown rice) and protein for repair. Turkey is lean, high in B vitamins for energy metabolism."
    }
  },
  {
    day: "Thursday",
    focus: "Active Recovery & Mobility",
    icon: "🧘",
    workout: {
      warmup: "Just start — this IS the workout. Begin slow.",
      exercises: [
        { name: "Cat-Cow Stretch", sets: "2 min continuous", rest: "0", muscles: "Spine, Back", howTo: "On hands and knees. Inhale: drop belly, lift head (cow). Exhale: round spine, tuck chin (cat). Slow and fluid." },
        { name: "Hip Flexor Lunge Stretch", sets: "90 sec each side", rest: "30 sec", muscles: "Hip Flexors", howTo: "Kneeling lunge, front foot flat, sink hips forward. Feel stretch in front of back leg's hip. Don't let knee cave inward." },
        { name: "Thoracic Rotation", sets: "3 × 10 each side", rest: "20 sec", muscles: "Upper Back, Spine", howTo: "Seated or on knees, hands behind head, rotate upper body slowly left and right. Keep hips still." },
        { name: "Pigeon Pose", sets: "2 min each side", rest: "0", muscles: "Hips, Glutes", howTo: "From plank, bring right knee forward behind right wrist, extend left leg back. Lower to elbows or floor. Breathe into the stretch." },
        { name: "20-Min Walk Outside", sets: "1 × 20 min", rest: "—", muscles: "Full body, mental reset", howTo: "No phone if possible. Walk at a pace where you can hold a conversation. Focus on breathing." },
      ],
      cooldown: "This IS a cooldown day — end with 5 min of deep breathing",
      totalTime: "40–45 minutes",
      calories: "100–150 calories"
    },
    meal: {
      name: "Greek Yogurt Bowl + Egg Scramble",
      calories: "490 kcal",
      macros: { protein: "44g", carbs: "38g", fat: "16g" },
      prepTime: "10 minutes",
      ingredients: [
        "200g full-fat Greek yogurt (no flavoring, plain)",
        "1 tablespoon honey",
        "1/4 cup mixed berries (fresh or frozen)",
        "2 tablespoons granola",
        "3 eggs",
        "1 tablespoon butter or olive oil",
        "Pinch of salt and herbs"
      ],
      steps: [
        "Scramble eggs: whisk eggs with pinch of salt, cook low and slow in butter, fold gently — don't rush",
        "Build yogurt bowl: yogurt → drizzle honey → berries → granola on top",
        "Serve together — one is protein-forward, one is recovery fuel"
      ],
      mealPrepTip: "Recovery days need less fuel. This lighter meal matches the lower training intensity. Berries deliver antioxidants that reduce muscle inflammation.",
      whyItWorks: "Greek yogurt has probiotics for gut health + casein protein (slow-digesting, great for rest days). Berries fight muscle soreness. Eggs are the most complete protein source."
    }
  },
  {
    day: "Friday",
    focus: "Full Body HIIT",
    icon: "⚡",
    workout: {
      warmup: "5 min: jumping jacks, high knees, arm circles, dynamic leg swings",
      exercises: [
        { name: "HIIT Circuit (4 rounds)", sets: "No rest between exercises in circuit", rest: "90 sec between rounds", muscles: "Full Body", howTo: "Do all 5 exercises back to back = 1 round. Rest 90 sec. Repeat 4 times total." },
        { name: "→ Jump Squats", sets: "40 sec", rest: "—", muscles: "Legs, Cardio", howTo: "Squat down, explode up, land softly bending knees. Immediately into next rep." },
        { name: "→ Push-Up to T", sets: "40 sec", rest: "—", muscles: "Chest, Core, Shoulder", howTo: "Do a push-up, then rotate into side plank with arm pointing up. Alternate sides." },
        { name: "→ High Knees", sets: "40 sec", rest: "—", muscles: "Cardio, Core", howTo: "Run in place driving knees as high as possible. Arms pump like running. FAST." },
        { name: "→ Reverse Lunges", sets: "40 sec (alternating)", rest: "—", muscles: "Quads, Glutes", howTo: "Step back into lunge, back knee nearly touches floor, drive front foot to return to stand." },
        { name: "→ Hollow Body Hold", sets: "40 sec", rest: "—", muscles: "Core", howTo: "Lie on back, arms overhead, lower back pressed to floor. Lift shoulders and feet 6 inches. Hold the tension." },
      ],
      cooldown: "10 min: full body stretch, especially hips, chest, and back",
      totalTime: "30 minutes",
      calories: "350–450 calories"
    },
    meal: {
      name: "Post-HIIT Protein Smoothie + Eggs",
      calories: "600 kcal",
      macros: { protein: "50g", carbs: "55g", fat: "16g" },
      prepTime: "5 minutes",
      ingredients: [
        "1 banana (frozen is thicker)",
        "1 cup milk (dairy or oat milk)",
        "1 scoop protein powder or 150g Greek yogurt",
        "1 tablespoon peanut butter",
        "1/2 cup frozen berries",
        "2 hard-boiled eggs (prep the night before)"
      ],
      steps: [
        "Blend everything except eggs until smooth",
        "Add ice if you want it thicker",
        "Drink within 30 minutes of finishing workout — this is the optimal window",
        "Eat the hard-boiled eggs alongside the smoothie"
      ],
      mealPrepTip: "Hard boil 6 eggs every Sunday. They keep for 7 days. Fastest post-workout protein source there is.",
      whyItWorks: "After HIIT, your body is in a catabolic state — it's breaking down muscle for fuel. Getting protein and fast carbs in within 30–45 minutes stops this and kickstarts recovery."
    }
  },
  {
    day: "Saturday",
    focus: "Strength + Stretch",
    icon: "🏋️",
    workout: {
      warmup: "5 min: band pull-aparts (or towel), hip hinges, wrist circles",
      exercises: [
        { name: "Diamond Push-Ups", sets: "4 sets × 10 reps", rest: "60 sec", muscles: "Triceps, Chest", howTo: "Hands form a diamond shape (thumbs and index fingers touching) under chest. Lower slowly, push up. Hard version." },
        { name: "Wide Push-Ups", sets: "4 sets × 15 reps", rest: "60 sec", muscles: "Chest outer, Shoulders", howTo: "Hands wider than shoulder width. Lower chest between hands. Emphasizes outer chest." },
        { name: "Isometric Wall Push", sets: "3 × 30 sec", rest: "30 sec", muscles: "Chest, Shoulders", howTo: "Place palms on wall, push as hard as you can — wall doesn't move, but the muscle tension is real and effective." },
        { name: "Doorframe Row", sets: "3 × 15 reps", rest: "60 sec", muscles: "Back, Biceps", howTo: "Stand in doorframe, grip sides, lean back (body at angle), pull chest toward frame. Balance with feet close to door." },
        { name: "Dead Bug", sets: "3 sets × 10 reps", rest: "30 sec", muscles: "Core stability", howTo: "Lie on back, arms and legs up (90° knees). Slowly lower opposite arm/leg toward floor, lower back stays pressed down. Return. Switch sides." },
      ],
      cooldown: "10 min full stretch routine — spend extra time on what felt tight today",
      totalTime: "40 minutes",
      calories: "220–300 calories"
    },
    meal: {
      name: "Chickpea & Spinach Curry + Rice",
      calories: "560 kcal",
      macros: { protein: "24g", carbs: "78g", fat: "14g" },
      prepTime: "20 minutes",
      ingredients: [
        "1 can (400g) chickpeas, drained",
        "1 can (400g) coconut milk (light)",
        "1 can diced tomatoes",
        "3 cups fresh spinach",
        "1 onion, diced",
        "3 cloves garlic, minced",
        "1 teaspoon each: cumin, turmeric, garam masala, coriander",
        "1 tablespoon olive oil",
        "Salt to taste",
        "150g cooked basmati rice"
      ],
      steps: [
        "Heat oil in large pan, add onion, cook 5 min until soft",
        "Add garlic + all spices, stir 1 min until fragrant",
        "Add tomatoes and coconut milk, stir to combine",
        "Add chickpeas, simmer 10 min to thicken",
        "Add spinach in handfuls, stir until wilted (2 min)",
        "Taste, adjust salt. Serve over rice."
      ],
      mealPrepTip: "This curry tastes 3× better the next day. Make a huge batch. Freezes perfectly for up to 3 months.",
      whyItWorks: "Plant-based protein from chickpeas, iron from spinach, anti-inflammatory turmeric. A rest-day-friendly meal that's filling, cheap, and builds your gut microbiome."
    }
  },
  {
    day: "Sunday",
    focus: "Rest & Meal Prep Day",
    icon: "🥗",
    workout: {
      warmup: "Optional — a gentle walk or yoga flow only",
      exercises: [
        { name: "20–30 min Walk", sets: "Optional", rest: "—", muscles: "Light movement, mental health", howTo: "No structure. Just move your body gently. Listen to a podcast or music." },
        { name: "10 min Yoga Flow", sets: "Optional", rest: "—", muscles: "Full body flexibility", howTo: "Sun salutation × 3, warrior poses, seated forward fold, spinal twist, corpse pose." },
      ],
      cooldown: "No formal workout = no formal cooldown needed",
      totalTime: "0–30 minutes (your choice)",
      calories: "60–100 calories"
    },
    meal: {
      name: "Sunday Meal Prep Guide",
      calories: "Varies",
      macros: { protein: "—", carbs: "—", fat: "—" },
      prepTime: "90 minutes (for the whole week)",
      ingredients: [
        "2 cups dry rice or quinoa → cook once, use all week",
        "500g chicken breast → season and bake or pan-cook in bulk",
        "6 eggs → hard boil for quick protein all week",
        "1 bag baby spinach → pre-washed, ready to grab",
        "2 sweet potatoes → cube, roast, store in containers",
        "1 head broccoli → cut into florets, steam, refrigerate",
        "Canned chickpeas (2 cans) → drain and store",
        "Containers: 5 lunch-sized containers for weekday prep"
      ],
      steps: [
        "Start the rice cooker or pot first — it takes the longest",
        "While rice cooks: boil eggs (11 min for hard boil), then immediately into ice water",
        "Season and bake chicken at 400°F for 25 min while rice finishes",
        "Cube and roast sweet potatoes (can go in same oven as chicken)",
        "Steam broccoli for 5 min, set aside",
        "Build 5 containers: rice/quinoa base + protein + 2 veggies. Done.",
        "Store in fridge — meals last 4–5 days, reducing daily cooking to zero"
      ],
      mealPrepTip: "The biggest health obstacle is not bad choices — it's not having good food available. Spend 90 min Sunday and your nutrition is handled all week.",
      whyItWorks: "Meal prep removes decision fatigue, saves 45–60 min daily, prevents impulse eating, and saves $50–$100 weekly compared to takeout."
    }
  }
];

function ExerciseCard({ exercise, index }) {
  const [done, setDone] = useState(false);
  return (
    <Box sx={{
      display: 'flex', gap: 2, p: 2.5, borderRadius: 2,
      bgcolor: done ? '#0f2b1a' : 'rgba(71,133,89,0.08)',
      border: `1px solid ${done ? G.pine : 'rgba(71,133,89,0.18)'}`,
      mb: 1.5, transition: 'all 0.2s'
    }}>
      <Box sx={{
        minWidth: 32, height: 32, borderRadius: '50%',
        bgcolor: done ? G.pine : G.pine,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: done ? G.mint : G.foam, fontWeight: 700, fontSize: '0.8rem', mt: 0.3
      }}>
        {done ? '✓' : index + 1}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography fontWeight={700} sx={{ color: done ? G.mint : G.forest }}>
            {exercise.name}
          </Typography>
          <Chip label={exercise.sets} size="small" sx={{ bgcolor: 'rgba(71,133,89,0.12)', color: 'G.textLight', fontSize: '0.7rem' }} />
        </Box>
        <Typography variant="caption" sx={{ color: G.sage, display: 'block', mb: 0.5 }}>
          {exercise.muscles}
        </Typography>
        <Typography variant="body2" sx={{ color: 'G.textLight', fontSize: '0.8rem' }}>
          {exercise.howTo}
        </Typography>
        {exercise.rest !== '—' && exercise.rest !== '0' && (
          <Typography variant="caption" sx={{ color: 'G.textMid', mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TimerIcon sx={{ fontSize: 12 }} /> Rest: {exercise.rest}
          </Typography>
        )}
      </Box>
      <Checkbox
        checked={done}
        onChange={() => setDone(!done)}
        sx={{ color: 'rgba(71,133,89,0.18)', '&.Mui-checked': { color: G.mid }, alignSelf: 'flex-start', mt: -0.5 }}
      />
    </Box>
  );
}

export default function Health() {
  const [tab, setTab] = useState(0);
  const [dayIndex, setDayIndex] = useState(getDayIndex());
  const [expandedMealStep, setExpandedMealStep] = useState(null);
  const [waterCount, setWaterCount] = useState(0);
  const [completedSections, setCompletedSections] = useState([]);
  const [checklist, setChecklist] = useState([false, false, false, false, false, false]);

  const today = weeklyPlan[dayIndex];
  const WATER_GOAL = 8;

  const markSectionDone = (section) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Spotify Widget — workout music */}
      <Box sx={{ mb: 3 }}>
        <SpotifyWidget />
      </Box>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ color: G.foam }}>
            🏃 Health
          </Typography>
          <Typography variant="body2" sx={{ color: 'G.textLight', mt: 0.5 }}>
            Daily workout + meal plan with full instructions
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {weeklyPlan.map((d, i) => (
            <IconButton
              key={i}
              onClick={() => setDayIndex(i)}
              size="small"
              sx={{
                bgcolor: i === dayIndex ? G.pine : 'rgba(71,133,89,0.08)',
                color: i === dayIndex ? G.foam : 'G.textMid',
                border: `1px solid ${i === dayIndex ? '#3b82f6' : 'rgba(71,133,89,0.18)'}`,
                borderRadius: 1.5,
                fontSize: '0.65rem',
                fontWeight: 700,
                width: 34, height: 34,
                '&:hover': { bgcolor: 'rgba(71,133,89,0.18)' }
              }}
            >
              {d.day.slice(0, 2)}
            </IconButton>
          ))}
        </Box>
      </Box>

      {/* Day Overview */}
      <Card sx={{ bgcolor: 'rgba(71,133,89,0.12)', border: '1px solid rgba(71,133,89,0.08)', borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h2" component="span">{today.icon}</Typography>
            <Box>
              <Typography variant="h5" fontWeight={700} sx={{ color: G.foam }}>
                {today.day} — {today.focus}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, mt: 1, flexWrap: 'wrap' }}>
                <Chip icon={<TimerIcon sx={{ fontSize: 14 }} />} label={today.workout.totalTime} size="small" sx={{ bgcolor: 'rgba(71,133,89,0.08)', color: 'G.textLight' }} />
                <Chip icon={<LocalFireDepartmentIcon sx={{ fontSize: 14 }} />} label={today.workout.calories} size="small" sx={{ bgcolor: 'rgba(71,133,89,0.08)', color: '#f97316' }} />
                <Chip icon={<RestaurantIcon sx={{ fontSize: 14 }} />} label={today.meal.name} size="small" sx={{ bgcolor: 'rgba(71,133,89,0.08)', color: G.sage }} />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: '1px solid rgba(71,133,89,0.08)', mb: 3 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{ '& .MuiTab-root': { color: 'G.textLight', textTransform: 'none', fontWeight: 600 }, '& .Mui-selected': { color: G.sage }, '& .MuiTabs-indicator': { bgcolor: G.sage } }}
        >
          <Tab icon={<FitnessCenterIcon />} label="Workout" iconPosition="start" />
          <Tab icon={<RestaurantIcon />} label="Meal Plan" iconPosition="start" />
          <Tab icon={<WaterDropIcon />} label="Tracker" iconPosition="start" />
        </Tabs>
      </Box>

      {/* WORKOUT TAB */}
      {tab === 0 && (
        <Box>
          <Box sx={{ bgcolor: 'rgba(71,133,89,0.08)', borderRadius: 2, p: 2, mb: 3, border: '1px solid rgba(71,133,89,0.18)' }}>
            <Typography variant="overline" sx={{ color: '#f59e0b', letterSpacing: 2 }}>🔥 WARM UP</Typography>
            <Typography sx={{ color: 'G.textDark', mt: 0.5 }}>{today.workout.warmup}</Typography>
          </Box>

          <Typography variant="h6" fontWeight={700} sx={{ color: G.foam, mb: 2 }}>Exercises</Typography>
          {today.workout.exercises.map((ex, i) => (
            <ExerciseCard key={i} exercise={ex} index={i} />
          ))}

          <Box sx={{ bgcolor: 'rgba(71,133,89,0.08)', borderRadius: 2, p: 2, mt: 3, border: '1px solid rgba(71,133,89,0.18)' }}>
            <Typography variant="overline" sx={{ color: G.mid, letterSpacing: 2 }}>🧊 COOL DOWN</Typography>
            <Typography sx={{ color: 'G.textDark', mt: 0.5 }}>{today.workout.cooldown}</Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3, bgcolor: G.pine, '&:hover': { bgcolor: '#15803d' }, textTransform: 'none', fontWeight: 700, py: 1.5 }}
            startIcon={<CheckCircleIcon />}
            onClick={() => markSectionDone('workout')}
          >
            {completedSections.includes('workout') ? '✅ Workout Logged!' : 'Mark Workout Complete'}
          </Button>
        </Box>
      )}

      {/* MEAL TAB */}
      {tab === 1 && (
        <Box>
          <Card sx={{ bgcolor: 'rgba(71,133,89,0.12)', border: '1px solid rgba(71,133,89,0.08)', borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight={700} sx={{ color: G.foam, mb: 1 }}>
                🍽 {today.meal.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 3 }}>
                <Chip label={`${today.meal.calories}`} sx={{ bgcolor: G.pine, color: G.foam, fontWeight: 700 }} />
                <Chip label={`Protein: ${today.meal.macros.protein}`} sx={{ bgcolor: 'rgba(71,133,89,0.08)', color: G.mint }} />
                <Chip label={`Carbs: ${today.meal.macros.carbs}`} sx={{ bgcolor: 'rgba(71,133,89,0.08)', color: '#f59e0b' }} />
                <Chip label={`Fat: ${today.meal.macros.fat}`} sx={{ bgcolor: 'rgba(71,133,89,0.08)', color: '#f97316' }} />
                <Chip icon={<TimerIcon sx={{ fontSize: 14 }} />} label={today.meal.prepTime} sx={{ bgcolor: 'rgba(71,133,89,0.08)', color: 'G.textLight' }} />
              </Box>

              {/* Ingredients */}
              <Typography variant="h6" fontWeight={700} sx={{ color: G.foam, mb: 2 }}>
                🛒 Ingredients
              </Typography>
              <Box sx={{ bgcolor: 'rgba(71,133,89,0.08)', borderRadius: 2, p: 2, mb: 3 }}>
                {today.meal.ingredients.map((ing, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 1, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#3b82f6', mt: 1, minWidth: 6 }} />
                    <Typography sx={{ color: 'G.textDark' }}>{ing}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Steps */}
              <Typography variant="h6" fontWeight={700} sx={{ color: G.foam, mb: 2 }}>
                👨‍🍳 How to Make It
              </Typography>
              {today.meal.steps.map((step, i) => (
                <Box
                  key={i}
                  onClick={() => setExpandedMealStep(expandedMealStep === i ? null : i)}
                  sx={{
                    display: 'flex', gap: 2, p: 2, borderRadius: 2, mb: 1.5,
                    bgcolor: expandedMealStep === i ? 'rgba(71,133,89,0.12)' : 'rgba(71,133,89,0.08)',
                    border: `1px solid ${expandedMealStep === i ? G.sage : 'rgba(71,133,89,0.18)'}`,
                    cursor: 'pointer', transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'rgba(71,133,89,0.12)' }
                  }}
                >
                  <Box sx={{
                    minWidth: 28, height: 28, borderRadius: '50%',
                    bgcolor: G.pine, color: G.foam,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.8rem', mt: 0.2
                  }}>
                    {i + 1}
                  </Box>
                  <Typography sx={{ color: 'G.textDark', lineHeight: 1.7 }}>{step}</Typography>
                </Box>
              ))}

              {/* Why it works */}
              <Box sx={{ bgcolor: '#0f2b1a', borderRadius: 2, p: 2, mb: 2, border: '1px solid G.pine', mt: 3 }}>
                <Typography variant="overline" sx={{ color: G.mint, letterSpacing: 2 }}>⚡ WHY THIS MEAL</Typography>
                <Typography sx={{ color: '#86efac', mt: 0.5, lineHeight: 1.7 }}>{today.meal.whyItWorks}</Typography>
              </Box>

              {/* Meal Prep Tip */}
              <Box sx={{ bgcolor: '#1c1810', borderRadius: 2, p: 2, border: '1px solid #78350f' }}>
                <Typography variant="overline" sx={{ color: '#f59e0b', letterSpacing: 2 }}>⏱ MEAL PREP TIP</Typography>
                <Typography sx={{ color: '#fcd34d', mt: 0.5, lineHeight: 1.7 }}>{today.meal.mealPrepTip}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* TRACKER TAB */}
      {tab === 2 && (
        <Box>
          {/* Water Tracker */}
          <Card sx={{ bgcolor: 'rgba(71,133,89,0.12)', border: '1px solid rgba(71,133,89,0.08)', borderRadius: 3, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: G.foam, mb: 1 }}>
                💧 Water Tracker
              </Typography>
              <Typography variant="body2" sx={{ color: 'G.textLight', mb: 3 }}>
                Goal: {WATER_GOAL} glasses (2L) per day
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(waterCount / WATER_GOAL) * 100}
                sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(71,133,89,0.08)', '& .MuiLinearProgress-bar': { bgcolor: '#38bdf8' }, mb: 2 }}
              />
              <Typography sx={{ color: '#38bdf8', fontWeight: 700, mb: 3 }}>
                {waterCount} / {WATER_GOAL} glasses {waterCount >= WATER_GOAL ? '🎉 Goal reached!' : ''}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={() => setWaterCount(Math.min(waterCount + 1, WATER_GOAL + 4))}
                  sx={{ bgcolor: '#0369a1', '&:hover': { bgcolor: '#0284c7' }, textTransform: 'none', fontWeight: 600 }}
                  startIcon={<WaterDropIcon />}
                >
                  + Drank a glass
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setWaterCount(Math.max(waterCount - 1, 0))}
                  sx={{ borderColor: 'rgba(71,133,89,0.18)', color: 'G.textLight', textTransform: 'none' }}
                >
                  Undo
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Daily Checklist */}
          <Card sx={{ bgcolor: 'rgba(71,133,89,0.12)', border: '1px solid rgba(71,133,89,0.08)', borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: G.foam, mb: 2 }}>
                ✅ Daily Health Checklist
              </Typography>
              {[
                { label: "Completed today's workout", detail: `${today.focus}` },
                { label: "Drank 2L+ water", detail: `${waterCount}/${WATER_GOAL} glasses tracked` },
                { label: "Ate a protein-rich meal", detail: today.meal.name },
                { label: "7–9 hours of sleep last night", detail: "Optimal recovery window" },
                { label: "No processed sugar or junk food", detail: "Discipline is freedom" },
                { label: "10+ min outside / sunlight", detail: "Vitamin D + mental reset" },
              ].map((item, i) => {
                const checked = checklist[i];
                return (
                  <Box key={i}
                    onClick={() => {
                      const next = [...checklist];
                      next[i] = !next[i];
                      setChecklist(next);
                    }}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 2, p: 1.5,
                      borderRadius: 2, cursor: 'pointer',
                      bgcolor: checked ? '#0f2b1a' : 'transparent',
                      border: `1px solid ${checked ? G.pine : 'transparent'}`,
                      mb: 1, transition: 'all 0.2s', '&:hover': { bgcolor: 'rgba(71,133,89,0.08)' }
                    }}
                  >
                    <Checkbox
                      checked={checked}
                      sx={{ color: 'rgba(71,133,89,0.18)', '&.Mui-checked': { color: G.mid }, p: 0.5 }}
                    />
                    <Box>
                      <Typography fontWeight={600} sx={{ color: checked ? G.mint : G.forest, textDecoration: checked ? 'line-through' : 'none' }}>
                        {item.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'G.textMid' }}>{item.detail}</Typography>
                    </Box>
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
}
