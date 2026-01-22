const API_KEY = "AIzaSyDy9hcKbXgUAw9SUCVjN2gZK5G039D6zNw";
const API_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
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

  document.getElementById("sqlOutput").textContent = "Generating with Gemini...";
  document.getElementById("explanationOutput").textContent = "";
  document.getElementById("optimizationOutput").textContent = "";
  document.getElementById("assumptionsOutput").textContent = "";

  const prompt = `
You are a senior MySQL database engineer.

Database Schema:
${SCHEMA}

User Request:
"${userInput}"

Respond in plain text using EXACT section headers:

SQL:
Explanation:
Optimizations:
Assumptions:

Do NOT use markdown.
Do NOT rename headers.
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
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";

    // SHOW FULL GEMINI OUTPUT (NO PARSING RISK)
    document.getElementById("sqlOutput").textContent = text;
  } catch (error) {
    document.getElementById("sqlOutput").textContent =
      "Error calling Gemini API. Check console.";
    console.error(error);
  }
}

  document.getElementById("assumptionsOutput").textContent =
    extract("Assumptions|Assumption");
}

