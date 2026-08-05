const { useState } = React;

function WeatherApp() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (query) => {
    setError("");
    setWeather(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/weather?q=${encodeURIComponent(query)}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to load weather data");
      }

      setWeather(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!location.trim()) {
      setError("Please enter a city, region, or postal code.");
      return;
    }
    fetchWeather(location.trim());
  };

  const handleQuickCity = (city) => {
    setLocation(city);
    fetchWeather(city);
  };

  const weatherCard = weather && (
    <div className="weather-card glass">
      <div className="weather-card-header">
        <div>
          <h2>{weather.location.name}, {weather.location.region || weather.location.country}</h2>
          <p>{new Date(weather.location.localtime).toLocaleString()}</p>
        </div>
        <img src={`https:${weather.current.condition.icon}`} alt={weather.current.condition.text} />
      </div>
      <div className="weather-details">
        <div className="weather-main">
          <span className="temp">{weather.current.temp_c}°C</span>
          <span className="condition">{weather.current.condition.text}</span>
        </div>
        <div className="weather-meta">
          <div>
            <strong>Feels like</strong>
            <span>{weather.current.feelslike_c}°C</span>
          </div>
          <div>
            <strong>Humidity</strong>
            <span>{weather.current.humidity}%</span>
          </div>
          <div>
            <strong>Wind</strong>
            <span>{weather.current.wind_kph} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="page-shell">
      <section className="hero glass">
        <div className="hero-copy">
          <p className="eyebrow">Welcome to Dot2 Weather</p>
          <h1>Ask for any location — get live weather instantly.</h1>
          <p className="hero-description">
            Enter a city, postal code, or region to fetch weather from the backend securely using your API key.
          </p>
        </div>

        <form className="search-form glass" onSubmit={handleSubmit}>
          <label htmlFor="location-input">Your location</label>
          <div className="input-group">
            <input
              id="location-input"
              type="text"
              placeholder="e.g. New York, London, Paris"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Get Weather"}
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>

        <div className="quick-links">
          <button type="button" onClick={() => handleQuickCity("San Francisco")}>San Francisco</button>
          <button type="button" onClick={() => handleQuickCity("Tokyo")}>Tokyo</button>
          <button type="button" onClick={() => handleQuickCity("London")}>London</button>
        </div>
      </section>

      <section className="result-area">
        {weatherCard || (
          <div className="empty-state glass">
            <p>Search for a location above to see temperature, humidity and live weather conditions.</p>
          </div>
        )}
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<WeatherApp />);
