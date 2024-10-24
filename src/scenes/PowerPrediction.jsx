import React, { useState, useRef } from "react";
import axios from "axios";
import Papa from "papaparse"; 
import "./PowerPrediction.css"; 
import { fetchPrediction } from "@/helper/helper";

const PowerPrediction = () => {
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const textareaRef = useRef(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; 
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; 
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setLocation(value);
    adjustTextareaHeight();

    if (value.length > 2) {
      try {
        const response = await axios.get(
          "https://api.opencagedata.com/geocode/v1/json",
          {
            params: {
              key: "84b677d039834de193924351d730c68a", 
              q: value,
              limit: 5,
            },
          }
        );
        setSuggestions(response.data.results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setLocation(suggestion.formatted);
    setSuggestions([]);
    adjustTextareaHeight();

    const lat = suggestion.geometry.lat;
    const lon = suggestion.geometry.lng;

    const localTime = new Date(); 
    const date = localTime.toISOString().split("T")[0]; 
    const currentHour = localTime.getHours(); 
    console.log(currentHour);
    try {
      
      const meteomaticsResponse = await axios.get(
        `https://api.meteomatics.com/${date}T${currentHour}:00:00Z/t_2m:C,relative_humidity_20m:p,msl_pressure:hPa,precip_3h:mm,fresh_snow_3h:cm,global_rad_mean_3h:W,wind_speed_10m:ms,wind_dir_10m:d,wind_speed_80m:ms,wind_dir_80m:d/${lat},${lon}/json`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2IjoxLCJ1c2VyIjoibmVkdW5pdmVyc2l0eV9zb2hhaWxfZGFuaXlhIiwiaXNzIjoibG9naW4ubWV0ZW9tYXRpY3MuY29tIiwiZXhwIjoxNzI5NzYzNzYyLCJzdWIiOiJhY2Nlc3MifQ.qY9VGYgG4wIDH8TBv5om2G-kNoGz7GCj0OaBkh9lUVLgaW_wkFN-b9eTy82FrejOzJygwXZEK_7rkQlU_0UZDA`,
          },
        }
      );

      const data = meteomaticsResponse.data;
      console.log(data);

      const windGustResponse = await axios.get(
        `https://api.meteomatics.com/${date}T${currentHour}:00:00Z/wind_gusts_10m_3h:ms,sun_elevation:d,sun_azimuth:d/${lat},${lon}/json`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2IjoxLCJ1c2VyIjoibmVkdW5pdmVyc2l0eV9zb2hhaWxfZGFuaXlhIiwiaXNzIjoibG9naW4ubWV0ZW9tYXRpY3MuY29tIiwiZXhwIjoxNzI5NzYzNzYyLCJzdWIiOiJhY2Nlc3MifQ.qY9VGYgG4wIDH8TBv5om2G-kNoGz7GCj0OaBkh9lUVLgaW_wkFN-b9eTy82FrejOzJygwXZEK_7rkQlU_0UZDA`,
          },
        }
      );

      const data2 = windGustResponse.data;
      const wind_url = `https://api.meteomatics.com/${date}T${currentHour}:00:00Z/wind_gusts_10m_3h:ms,sun_azimuth:d,sun_elevation:d/${lat},${lon}/json`;
      console.log(wind_url);
      console.log(data2);

      if (data && data.data && data2 && data2.data) {

        let temperatureValue = 0;
        let humidityValue = 0;
        let pressureValue = 0;
        let precipValue = 0;
        let snowValue = 0;
        let radValue = 0;
        let windSpeed = 0;
        let windDir = 0;
        let ws_80 = 0;
        let wd_80 = 0;
        let wg_10 = 0;
        let i_angle = 0;
        let azimuth_angle = 0;

        data.data.forEach((parameter) => {
          if (parameter.parameter === "t_2m:C") {
            temperatureValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "relative_humidity_20m:p") {
            humidityValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "msl_pressure:hPa") {
            pressureValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "precip_3h:mm") {
            precipValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "fresh_snow_3h:cm") {
            snowValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "global_rad_mean_3h:W") {
            radValue = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_speed_10m:ms") {
            windSpeed = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_dir_10m:d") {
            windDir = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_speed_80m:ms") {
            ws_80 = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_dir_80m:d") {
            wd_80 = parameter.coordinates[0].dates[0].value;
          } else if (parameter.parameter === "wind_gusts_10m_3h:ms") {
            wg_10 = parameter.coordinates[0].dates[0].value;
          }
        });

        data2.data.forEach((parameter2) => {
          if (parameter2.parameter === "wind_gusts_10m_3h:ms") {
            wg_10 = parameter2.coordinates[0].dates[0].value;
          } else if (parameter2.parameter === "sun_elevation:d") {

            i_angle = Math.abs(parameter2.coordinates[0].dates[0].value);
          } else if (parameter2.parameter === "sun_azimuth:d") {

            azimuth_angle = parameter2.coordinates[0].dates[0].value;
            console.log(azimuth_angle);
          }
        });

        let zenith_angle = 90 - i_angle;


        const predictionData = {
          temperature_2_m_above_gnd: temperatureValue || 0,
          relative_humidity_2_m_above_gnd: humidityValue || 0,
          mean_sea_level_pressure_MSL: pressureValue || 0,
          total_precipitation_sfc: precipValue || 0,
          snowfall_amount_sfc: snowValue || 0,
          total_cloud_cover_sfc: 0,
          high_cloud_cover_high_cld_lay: 0, 
          medium_cloud_cover_mid_cld_lay: 0, 
          low_cloud_cover_low_cld_lay: 0, 
          shortwave_radiation_backwards_sfc: radValue || 0, 
          wind_speed_10_m_above_gnd: windSpeed, 
          wind_direction_10_m_above_gnd: windDir, 
          wind_speed_80_m_above_gnd: ws_80 || 0, 
          wind_direction_80_m_above_gnd: wd_80 || 0, 
          wind_gust_10_m_above_gnd: wg_10 || 0, 
          angle_of_incidence: i_angle, 
          zenith: zenith_angle, 
          azimuth: azimuth_angle || 0, 
        };

        console.log(predictionData);
        console.log(azimuth_angle);
        console.log(data2);
        console.log(data);
        setPredictionData(predictionData); 


        const cloudCoverResponse = await axios.get(
          `https://api.meteomatics.com/${date}T12:00:00Z/high_cloud_cover_mean_2h:p,medium_cloud_cover_mean_2h:p,low_cloud_cover_mean_2h:p,total_cloud_cover_mean_2h:p/${lat},${lon}/csv`,
          {
            headers: {
              Authorization: `Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2IjoxLCJ1c2VyIjoibmVkdW5pdmVyc2l0eV9zb2hhaWxfZGFuaXlhIiwiaXNzIjoibG9naW4ubWV0ZW9tYXRpY3MuY29tIiwiZXhwIjoxNzI5NzYzNzYyLCJzdWIiOiJhY2Nlc3MifQ.qY9VGYgG4wIDH8TBv5om2G-kNoGz7GCj0OaBkh9lUVLgaW_wkFN-b9eTy82FrejOzJygwXZEK_7rkQlU_0UZDA`,
            },
          }
        );

        let csvData = cloudCoverResponse.data.trim();

        console.log("Raw CSV Data:", csvData);


        Papa.parse(csvData, {
          header: true,
          delimiter: ";", 
          complete: (results) => {
            console.log("Parsed Results:", results);


            if (results.errors.length > 0) {
              console.error("Parsing Errors:", results.errors);
              return; 
            }

            if (results.data.length > 0) {
              const lastRow = results.data[results.data.length - 1];

              console.log("Last Row Data:", lastRow);

              const highCloud =
                parseInt(lastRow["high_cloud_cover_mean_2h:p"]) || 0;
              const mediumCloud =
                parseInt(lastRow["medium_cloud_cover_mean_2h:p"]) || 0;
              const lowCloud =
                parseInt(lastRow["low_cloud_cover_mean_2h:p"]) || 0;
              const totalCloud =
                parseInt(lastRow["total_cloud_cover_mean_2h:p"]) || 0;

              console.log(
                `High Cloud Cover: ${highCloud}, Medium Cloud Cover: ${mediumCloud}, Low Cloud Cover: ${lowCloud}`
              );

              const updatedPredictionData = {
                ...predictionData,
                high_cloud_cover_high_cld_lay: highCloud,
                medium_cloud_cover_mid_cld_lay: mediumCloud,
                low_cloud_cover_low_cld_lay: lowCloud,
                total_cloud_cover_sfc: totalCloud,
              };

              setPredictionData(updatedPredictionData); 
            } else {
              console.warn("No data available in the CSV response.");
            }
          },
          error: (error) => {
            console.error("Parsing error:", error);
          },
        });
      } else {
        console.error("Invalid weather data received");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleGeneratePrediction = async () => {
    try {
      console.log(predictionData);
      const response = await fetchPrediction(predictionData); 
      setPrediction(response); 
    } catch (error) {
      console.error("Error generating prediction:", error);
    }
  };

  return (
    <div className="power-prediction">
      <h2 className="font-bold my-2">Enter Your Location</h2>
      <textarea
        ref={textareaRef}
        placeholder="Type your location"
        value={location}
        onChange={handleInputChange}
        className="autocomplete-input"
        rows={1}
        style={{
          resize: "none",
          overflow: "hidden",
          width: "100%",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          fontSize: "16px",
          lineHeight: "1.5",
        }}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.formatted}
            </li>
          ))}
        </ul>
      )}
      <h3 className="text-neutral-800 font-bold my-3 text-3xl">Weather Data: </h3>
      {predictionData && (
        
        <div className="prediction-data grid">
          
          <div className="grid-item temp1">
            <h4 className="foreground-text">Temperature</h4>
            <p>{predictionData.temperature_2_m_above_gnd.toFixed(2)} °C</p>
          </div>
          <div className="grid-item humid1">
            <h4>Relative Humidity</h4>
            <p>{predictionData.relative_humidity_2_m_above_gnd.toFixed(2)} %</p>
          </div>
          <div className="grid-item winds1">
            <h4>Wind Speed (10m)</h4>
            <p>{predictionData.wind_speed_10_m_above_gnd.toFixed(2)} m/s</p>
          </div>
          <div className="grid-item windg1">
            <h4>Wind Gust (10m)</h4>
            <p>{predictionData.wind_gust_10_m_above_gnd.toFixed(2)} m/s</p>
          </div>
          <div className="grid-item precip1">
            <h4>Precipitation</h4>
            <p>{predictionData.total_precipitation_sfc.toFixed(2)} mm</p>
          </div>
          <div className="grid-item snow1">
            <h4>Snow</h4>
            <p>{predictionData.snowfall_amount_sfc.toFixed(2)} mm</p>
          </div>
        </div>
      )}
      
      <button
        onClick={handleGeneratePrediction}
        className="generate-button mx-auto text-center flex justify-center items-center bg-amber-600 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded"
      >
        Generate Power Prediction
      </button>
      
      {prediction && (
        <div className="prediction-result">
          <h3>Power Prediction Result:</h3>
          <pre>{JSON.stringify(prediction, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PowerPrediction;










