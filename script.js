const API_KEY = "AIzaSyDy9hcKbXgUAw9SUCVjN2gZK5G039D6zNw";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=" +
  API_KEY;

const SCHEMA = `
users(id, name, email, created_at)
orders(id, user_id, amount, status, created_at)
products(id, name, price, category)
order_items(order_id, product_id, quantity)
`;

async function generateSQL() {
  const userInput = document.getElementById("userInput").value.trim();

  if (!userInput) {
    alert("Enter a request");
    return;
  }

  setLoading();

  const prompt = `
You are a senior MySQL database engineer.

Database Schema:
${SCHEMA}

User Request:
"${userInput}"

Respond exactly in this format:

SQL:
Explanation:
Optimizations:
Assumptions:
`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    parseAndDisplay(text);
  } catch (error) {
    document.getElementById("sqlOutput").textContent =
      "Error calling Gemini API";
    console.error(error);
  }
}

function setLoading() {
  document.getElementById("sqlOutput").textContent = "Generating...";
  document.getElementById("explanationOutput").textContent = "";
  document.getElementById("optimizationOutput").textContent = "";
  document.getElementById("assumptionsOutput").textContent = "";
}

function parseAndDisplay(text) {
  const sections = {
    SQL: "",
    Explanation: "",
    Optimizations: "",
    Assumptions: "",
  };

  let current = null;

  text.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (sections.hasOwnProperty(trimmed.replace(":", ""))) {
      current = trimmed.replace(":", "");
    } else if (current) {
      sections[current] += line + "\n";
    }
  });

  document.getElementById("sqlOutput").textContent = sections.SQL.trim();
  document.getElementById("explanationOutput").textContent =
    sections.Explanation.trim();
  document.getElementById("optimizationOutput").textContent =
    sections.Optimizations.trim();
  document.getElementById("assumptionsOutput").textContent =
    sections.Assumptions.trim();
}
