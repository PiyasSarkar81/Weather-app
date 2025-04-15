import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";

const Weather = () => {
  const inputRef = useRef(null);
  const [weatherData, setWeatherData] = useState(null); // Tracks weather data
  const [errorMessage, setErrorMessage] = useState(""); // Tracks error messages

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const search = async (city) => {
    if (!city.trim()) {
      setErrorMessage("Please enter a valid city name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "City not found. Please try again.");
        setWeatherData(null);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        temperature: Math.floor(data.main.temp),
        location: data.name,
        country: data.sys.country,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        weatherCondition: data.weather[0].main,
        icon: icon,
      });

      setErrorMessage("");
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setErrorMessage("An error occurred while fetching weather data.");
      setWeatherData(null);
    }
  };

  useEffect(() => {
    search("Kolkata");
  }, []);

  return (
    <div className="weather-dashboard">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for a city..."
          className="search-input"
        />
        <button
          className="search-button"
          onClick={() => search(inputRef.current.value)}
        >
          <img src={search_icon} alt="search icon" />
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Weather Information */}
      {weatherData ? (
        <div className="weather-info">
          <div className="weather-header">
            <img
              src={weatherData.icon}
              alt="weather icon"
              className="weather-icon"
            />
            <div className="temperature">{weatherData.temperature}°C</div>
            <div className="location">
              {weatherData.location}, {weatherData.country}
            </div>
            <div className="condition">{weatherData.weatherCondition}</div>
          </div>

          <div className="weather-details">
            <div className="detail-item">
              <img src={humidity_icon} alt="humidity icon" />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="detail-item">
              <img src={wind_icon} alt="wind icon" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        !errorMessage && <div className="loading">Loading weather data...</div>
      )}
    </div>
  );
};

export default Weather;
