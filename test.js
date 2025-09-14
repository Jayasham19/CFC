async function loadEmissionData() {
  try {
    let response = await fetch("https://api.v2.emissions-api.org/api/v2/carbonmonoxide/average.json?country=IN&begin=2024-09-01&end=2024-09-10");
    let data = await response.json();

    console.log("API response:", data);  // 👈 this prints the entire JSON

    // Don’t assume the structure yet
    document.getElementById("emissionCounter").innerText = JSON.stringify(data, null, 2);

  } catch (err) {
    console.error("Error fetching API:", err);
    document.getElementById("emissionCounter").innerText = "⚠️ Failed to load data";
  }
}
