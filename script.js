const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const quickButtons = document.querySelectorAll(".quick-actions button");

const knowledgeBase = [
  {
    keywords: ["car", "bike", "scooter", "travel", "drive", "vehicle", "petrol", "diesel"],
    score: "Medium to High",
    reply:
      "Your travel habit can increase your carbon footprint, especially for short distances. Try walking, cycling, carpooling, or using public transport when possible."
  },
  {
    keywords: ["light", "fan", "ac", "electricity", "power", "charge", "energy"],
    score: "Medium",
    reply:
      "Energy usage matters. Switch off lights, fans, chargers, and AC when not needed. Use natural light and energy-efficient appliances."
  },
  {
    keywords: ["plastic", "bottle", "bag", "wrapper", "single use"],
    score: "Medium",
    reply:
      "Single-use plastic creates long-term waste. Carry a reusable bottle, cloth bag, and avoid unnecessary packaging."
  },
  {
    keywords: ["food", "waste", "meat", "leftover", "throw"],
    score: "Medium",
    reply:
      "Food waste adds to emissions. Plan meals, store leftovers safely, and avoid wasting cooked food."
  },
  {
    keywords: ["tree", "plant", "garden", "green"],
    score: "Positive",
    reply:
      "Great habit! Planting trees and protecting green spaces helps absorb carbon and improves local air quality."
  }
];

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `message ${type}`;
  message.innerHTML = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function analyzeInput(input) {
  const lowerInput = input.toLowerCase();

  const matched = knowledgeBase.find(item =>
    item.keywords.some(keyword => lowerInput.includes(keyword))
  );

  if (matched) {
    return `
      <strong>GreenGuide AI:</strong><br>
      <b>Carbon Impact:</b> ${matched.score}<br><br>
      ${matched.reply}<br><br>
      <b>Daily Goal:</b> Choose one greener action today and repeat it for 7 days.
    `;
  }

  return `
    <strong>GreenGuide AI:</strong><br>
    I understand your activity. To reduce your carbon footprint, try saving energy,
    reducing waste, reusing items, and choosing eco-friendly alternatives whenever possible.<br><br>
    <b>Daily Goal:</b> Make one small sustainable choice today.
  `;
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const input = userInput.value.trim();
  if (!input) return;

  addMessage(`<strong>You:</strong> ${input}`, "user");

  const response = analyzeInput(input);
  setTimeout(() => addMessage(response, "bot"), 400);

  userInput.value = "";
});

quickButtons.forEach(button => {
  button.addEventListener("click", () => {
    userInput.value = button.dataset.prompt;
    chatForm.dispatchEvent(new Event("submit"));
  });
});
