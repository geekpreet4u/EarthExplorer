async function getWeatherByUUID() {
    const uuid = crypto.randomUUID();
    const numbers = uuid.replace(/\D/g, "").slice(0, 6);
    const lat = (parseInt(numbers.slice(0, 3), 10) % 180) - 90;  // Generate between -90 and 90 for latitude
    const lon = (parseInt(numbers.slice(3, 6), 10) % 360) - 180;  // Generate between -180 and 180 for longitude

    const placeName = await getPlaceName(lat, lon);
    const wikiSummary = await getWikipediaSummary(placeName);
    const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    try {
        const response = await fetch(weatherApiUrl);
        if (!response.ok) throw new Error("Weather API error");

        const data = await response.json();
        console.clear();
        console.log(`🌎 **UUID-Based Random Earth Explorer**`);
        console.log(`🔮 Generated UUID: ${uuid}`);
        console.log(`📍 Location: ${placeName} (Latitude: ${lat.toFixed(2)}, Longitude: ${lon.toFixed(2)})`);

        // Convert temperature from Celsius to Fahrenheit
        const tempCelsius = data.current_weather.temperature;
        const tempFahrenheit = (tempCelsius * 9/5) + 32;

        console.log(`🌤️ Current Weather: ${tempFahrenheit.toFixed(1)}°F`);
        console.log(`🗺️ Google Maps: https://www.google.com/maps?q=${lat},${lon}`);
        console.log(`📖 Wikipedia Fact: ${wikiSummary}`);

        // 🚨 Special Messages for Remote Areas
        if (placeName.includes("Ocean")) {
            console.log("🌊 Looks like you've been dropped into the sea! Maybe a shipwreck awaits? 🏴‍☠️⚓");
        } else if (placeName.includes("Desert")) {
            console.log("🏜️ You've landed in a barren wasteland... Hopefully, there's an oasis nearby! 🏕️");
        } else if (placeName.includes("Ice") || placeName.includes("Penguins")) {
            console.log("❄️ You've ended up in the frozen wild! Better bring a warm coat! 🧥🐧");
        } else {
            console.log("✨ What a cool random place! Maybe it’s time to visit?");
        }
    } catch (error) {
        console.error("⚠️ Error fetching weather:", error);
    }
}

// Run multiple times to test different results
getWeatherByUUID();
