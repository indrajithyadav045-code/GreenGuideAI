const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const scoreCircle = document.getElementById("scoreCircle");
const scoreText = document.getElementById("scoreText");
const reportText = document.getElementById("reportText");
const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearBtn");
const quickButtons = document.querySelectorAll(".quick-buttons button");
const progressFill = document.getElementById("progressFill");
const badgeBox = document.getElementById("badgeBox");
const streakCount = document.getElementById("streakCount");
const completeGoalsBtn = document.getElementById("completeGoalsBtn");
const ecoChecks = document.querySelectorAll(".ecoCheck");
const actionPlanList = document.getElementById("actionPlanList");
const shareBtn = document.getElementById("shareBtn");
const themeToggle = document.getElementById("themeToggle");

let totalScore = Number(localStorage.getItem("ecoScore")) || 0;
let activityCount = Number(localStorage.getItem("activityCount")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;
let history = JSON.parse(localStorage.getItem("history")) || [];
let lastCategory = localStorage.getItem("lastCategory") || "General Habit";

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
}

const rules = [
  {
    keywords: ["car", "bike", "scooter", "petrol", "diesel", "vehicle", "drive"],
    impact: 25,
    category: "Travel",
    tip: "Try walking, cycling, carpooling, or public transport for short distances.",
    plan: [
      "Replace one short vehicle trip with walking.",
      "Use public transport at least once this week.",
      "Combine multiple trips into one planned route."
    ]
  },
  {
    keywords: ["bus", "train", "metro", "public transport", "walk", "cycle", "cycling"],
    impact: 5,
    category: "Low Carbon Travel",
    tip: "Great choice! Public transport, walking, and cycling reduce emissions.",
    plan: [
      "Continue using low-carbon travel.",
      "Encourage one friend to try public transport.",
      "Track how many private vehicle trips you avoid."
    ]
  },
  {
    keywords: ["light", "fan", "ac", "electricity", "charger", "power"],
    impact: 20,
    category: "Energy",
    tip: "Switch off unused lights, fans, chargers, and use natural light when possible.",
    plan: [
      "Unplug chargers after use.",
      "Switch off fans and lights when leaving a room.",
      "Use natural light during daytime."
    ]
  },
  {
    keywords: ["plastic", "bottle", "bag", "wrapper", "single use"],
    impact: 18,
    category: "Plastic",
    tip: "Use cloth bags, reusable bottles, and avoid single-use plastic.",
    plan: [
      "Carry a reusable water bottle.",
      "Use a cloth bag for shopping.",
      "Avoid single-use cups and straws."
    ]
  },
  {
    keywords: ["food", "waste", "leftover", "throw"],
    impact: 16,
    category: "Food Waste",
    tip: "Plan meals, save leftovers, and avoid wasting cooked food.",
    plan: [
      "Serve smaller portions first.",
      "Store leftovers safely.",
      "Plan meals before buying groceries."
    ]
  },
  {
    keywords: ["tree", "plant", "green", "garden", "sapling"],
    impact: -15,
    category: "Positive Green Action",
    tip: "Great! Continue planting and protecting green spaces.",
    plan: [
      "Water and care for planted saplings.",
      "Protect nearby green spaces.",
      "Share one green habit with others."
    ]
  }
];

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `message ${type}`;
  div.innerHTML = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function analyzeActivity(input) {
  const lower = input.toLowerCase();

  const matchedRule = rules.find(rule =>
    rule.keywords.some(keyword => lower.includes(keyword))
  );

  if (!matchedRule) {
    return {
      category: "General Habit",
      impact: 12,
      tip: "Reduce waste, save energy, reuse items, and make one greener choice today.",
      plan: [
        "Identify one habit that creates waste.",
        "Replace it with a reusable option.",
        "Repeat the greener habit for 7 days."
      ]
    };
  }

  return matchedRule;
}

function getEcoLevel(score) {
  if (score <= 20) return "Eco Hero 🌱";
  if (score <= 45) return "Good Progress ✅";
  if (score <= 70) return "Needs Improvement ⚠️";
  return "High Carbon Impact 🚨";
}

function getBadge(score) {
  if (score <= 20) return "🌍 Planet Protector";
  if (score <= 45) return "🌱 Green Achiever";
  if (score <= 70) return "🍃 Eco Learner";
  return "⚠️ Improvement Needed";
}

function updateActionPlan(plan) {
  actionPlanList.innerHTML = "";
  plan.forEach(point => {
    const li = document.createElement("li");
    li.textContent = point;
    actionPlanList.appendChild(li);
  });
}

function updateDashboard() {
  const average = activityCount === 0 ? 0 : Math.round(totalScore / activityCount);
  const safeAverage = Math.max(0, Math.min(100, average));

  scoreCircle.textContent = safeAverage;
  progressFill.style.width = `${safeAverage}%`;
  streakCount.textContent = streak;

  const level = getEcoLevel(safeAverage);
  scoreText.textContent = level;
  badgeBox.textContent = getBadge(safeAverage);

  reportText.innerHTML = `
    <b>Activities Analyzed:</b> ${activityCount}<br>
    <b>Average Carbon Impact:</b> ${safeAverage}/100<br>
    <b>Last Category:</b> ${lastCategory}<br>
    <b>Status:</b> ${level}<br><br>
    <b>Suggestion:</b> Focus on one high-impact habit and complete your daily eco checklist.
  `;

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<li>No activities yet. Start by analyzing one habit.</li>";
    updateActionPlan(["Add an activity to get your action plan."]);
    return;
  }

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.activity} → ${item.category} | Impact: ${item.impact}`;
    historyList.appendChild(li);
  });
}

function saveData() {
  localStorage.setItem("ecoScore", totalScore);
  localStorage.setItem("activityCount", activityCount);
  localStorage.setItem("streak", streak);
  localStorage.setItem("history", JSON.stringify(history));
  localStorage.setItem("lastCategory", lastCategory);
}

chatForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const input = userInput.value.trim();
  if (!input) return;

  addMessage(`<b>You:</b> ${input}`, "user");

  const result = analyzeActivity(input);

  totalScore += result.impact;
  activityCount++;
  lastCategory = result.category;

  history.unshift({
    activity: input,
    category: result.category,
    impact: result.impact
  });

  if (history.length > 8) history.pop();

  saveData();
  updateDashboard();
  updateActionPlan(result.plan);

  const response = `
    <b>GreenGuide AI:</b><br>
    <b>Detected Category:</b> ${result.category}<br>
    <b>Carbon Impact:</b> ${result.impact}/100<br><br>
    <b>Personalized Tip:</b> ${result.tip}<br><br>
    <b>Daily Challenge:</b> Complete at least 2 checklist goals today.
  `;

  setTimeout(() => addMessage(response, "bot"), 350);

  userInput.value = "";
});

quickButtons.forEach(button => {
  button.addEventListener("click", () => {
    userInput.value = button.dataset.text;
    chatForm.dispatchEvent(new Event("submit"));
  });
});

completeGoalsBtn.addEventListener("click", () => {
  let completed = 0;

  ecoChecks.forEach(check => {
    if (check.checked) completed++;
  });

  if (completed === 0) {
    addMessage("<b>GreenGuide AI:</b> Select at least one eco goal to update your streak.", "bot");
    return;
  }

  streak += completed;
  saveData();
  updateDashboard();

  addMessage(
    `<b>GreenGuide AI:</b> Great! You completed ${completed} eco goal(s). Your green streak increased.`,
    "bot"
  );

  ecoChecks.forEach(check => {
    check.checked = false;
  });
});

shareBtn.addEventListener("click", () => {
  const average = activityCount === 0 ? 0 : Math.round(totalScore / activityCount);
  const safeAverage = Math.max(0, Math.min(100, average));

  const shareText = `I used GreenGuide AI to analyze my carbon habits.
Eco Score: ${safeAverage}/100
Activities Analyzed: ${activityCount}
Green Streak: ${streak}
Let's build greener habits daily!`;

  navigator.clipboard.writeText(shareText).then(() => {
    addMessage("<b>GreenGuide AI:</b> Share report copied to clipboard.", "bot");
  });
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
});

clearBtn.addEventListener("click", () => {
  totalScore = 0;
  activityCount = 0;
  streak = 0;
  history = [];
  lastCategory = "General Habit";

  saveData();
  updateDashboard();
  updateActionPlan(["Add an activity to get your action plan."]);

  chatBox.innerHTML = `
    <div class="message bot">
      <b>GreenGuide AI:</b> All data cleared. Start again with a new activity.
    </div>
  `;
});

updateDashboard();
