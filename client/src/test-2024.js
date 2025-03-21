// This is a simple test script to check the API with specific year parameters

async function testYearFilter() {
  console.log("Testing API with 2024 as the year...");
  
  const dateRange = `2024-01-01,2025-12-31`;
  
  const filters = {
    genres: ["indie"],
    independentOnly: true,
    dates: dateRange
  };
  
  // Convert the filters to URLSearchParams
  const params = new URLSearchParams();
  params.set("genres", JSON.stringify(filters.genres));
  params.set("independentOnly", String(filters.independentOnly));
  params.set("dates", filters.dates);
  
  const url = `/api/games/random?${params.toString()}`;
  console.log("Requesting URL:", url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    console.log("API Response:", data);
    console.log("Game released date:", data.released);
    console.log("Game name:", data.name);
  } catch (error) {
    console.error("Error testing API:", error);
  }
}

// Run the test
testYearFilter(); 