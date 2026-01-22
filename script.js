//const API_KEY = "AIzaSyDy9hcKbXgUAw9SUCVjN2gZK5G039D6zNw";
function generateSQL() {
  const input = document.getElementById("userInput").value;

  if (!input) {
    alert("Enter a request");
    return;
  }

  // TEMP placeholder
  document.getElementById("sqlOutput").textContent = "Waiting for Gemini...";
  document.getElementById("explanationOutput").textContent = "";
  document.getElementById("optimizationOutput").textContent = "";
  document.getElementById("assumptionsOutput").textContent = "";
}
