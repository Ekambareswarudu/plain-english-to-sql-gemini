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
  // Reset outputs
  document.getElementById("sqlOutput").textContent = "";
  document.getElementById("explanationOutput").textContent = "";
  document.getElementById("optimizationOutput").textContent = "";
  document.getElementById("assumptionsOutput").textContent = "";

  // Fallback: show full response if parsing fails
  if (!text || text.length < 10) {
    document.getElementById("sqlOutput").textContent =
      "Empty response from Gemini";
    return;
  }

  // Normalize text
  const normalized = text.replace(/\*\*/g, "");

  const extract = (label) => {
    const regex = new RegExp(
      `${label}\\s*[:\\-]?([\\s\\S]*?)(?=\\n[A-Z][a-zA-Z ]+\\s*[:\\-]|$)`,
      "i"
    );
    const match = normalized.match(regex);
    return match ? match[1].trim() : "Not provided";
  };

  document.getElementById("sqlOutput").textContent =
    extract("SQL");

  document.getElementById("explanationOutput").textContent =
    extract("Explanation");

  document.getElementById("optimizationOutput").textContent =
    extract("Optimizations|Optimization");

  document.getElementById("assumptionsOutput").textContent =
    extract("Assumptions|Assumption");
}

