const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const scoreCircle = document.getElementById("scoreCircle");
const scoreText = document.getElementById("scoreText");
const reportText = document.getElementById("reportText");
const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearBtn");
const quickButtons = document.querySelectorAll(".quick-buttons button");

let totalScore = Number(localStorage.getItem("ecoScore")) || 0;
let activityCount = Number(localStorage.getItem("activityCount")) || 0;
let history = JSON.parse(localStorage.getItem("history")) || [];

const rules = [
  {
    keywords: ["car", "bike", "scooter", "petrol", "diesel", "vehicle"],
    impact: 25,
    category: "Travel",
    tip: "Try walking, cycling, carpooling, or public transport for short distances."
  },
  {
    keywords: ["light", "fan", "ac", "electricity", "charger", "power"],
    impact: 20,
    category: "Energy",
    tip: "Switch off unused lights, fans, chargers, and use natural light when possible."
  },
  {
    keywords: ["plastic", "bottle", "bag", "wrapper"],
    impact: 18,
    category: "Plastic",
    tip: "Use cloth bags, reusable bottles, and avoid single-use plastic."
  },
  {
    keywords: ["food", "waste", "leftover", "throw"],
    impact: 16,
    category: "Food",
    tip: "Plan meals, save leftovers, and avoid wasting cooked food."
  },
  {
    keywords: ["tree", "plant", "green", "garden"],
    impact: -15,
    category: "Positive Action",
    tip: "Great! Continue planting and protecting green spaces."
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
      tip: "Reduce waste, save energy, reuse items, and make one greener choice today."
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

function updateDashboard() {
  let average = activityCount === 0 ? 0 : Math.round(totalScore / activityCount);
  scoreCircle.textContent = average;

  const level = getEcoLevel(average);
  scoreText.textContent = level;

  reportText.innerHTML = `
    <b>Activities Analyzed:</b> ${activityCount}<br>
    <b>Average Carbon Impact:</b> ${average}/100<br>
    <b>Status:</b> ${level}<br><br>
    <b>Suggestion:</b> Choose one greener habit and repeat it daily.
  `;

  historyList.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.activity} → ${item.category} | Impact: ${item.impact}`;
    historyList.appendChild(li);
  });
}

function saveData() {
  localStorage.setItem("ecoScore", totalScore);
  localStorage.setItem("activityCount", activityCount);
  localStorage.setItem("history", JSON.stringify(history));
}

chatForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const input = userInput.value.trim();
  if (!input) return;

  addMessage(`<b>You:</b> ${input}`, "user");

  const result = analyzeActivity(input);

  totalScore += result.impact;
  activityCount++;

  history.unshift({
    activity: input,
    category: result.category,
    impact: result.impact
  });

  if (history.length > 6) {
    history.pop();
  }

  saveData();
  updateDashboard();

  const response = `
    <b>GreenGuide AI:</b><br>
    <b>Detected Category:</b> ${result.category}<br>
    <b>Carbon Impact:</b> ${result.impact}/100<br><br>
    <b>Personalized Tip:</b> ${result.tip}<br><br>
    <b>Daily Challenge:</b> Try one eco-friendly action today.
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

clearBtn.addEventListener("click", () => {
  totalScore = 0;
  activityCount = 0;
  history = [];
  saveData();
  updateDashboard();
  chatBox.innerHTML = `
    <div class="message bot">
      <b>GreenGuide AI:</b> History cleared. Start again with a new activity.
    </div>
  `;
});

updateDashboard();
