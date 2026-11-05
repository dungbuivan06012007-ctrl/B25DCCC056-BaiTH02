
import { useState, useEffect } from "react";
import "./App.css";

// DANH SÁCH 8 THÀNH PHỐ
const cities = [
  { name: "Hà Nội", lat: 21.0285, lon: 105.8542 },
  { name: "Hải Phòng", lat: 20.8449, lon: 106.6881 },
  { name: "Huế", lat: 16.4637, lon: 107.5909 },
  { name: "Đà Nẵng", lat: 16.0544, lon: 108.2022 },
  { name: "Nha Trang", lat: 12.2388, lon: 109.1967 },
  { name: "Đà Lạt", lat: 11.9404, lon: 108.4583 },
  { name: "TP. Hồ Chí Minh", lat: 10.8231, lon: 106.6297 },
  { name: "Cần Thơ", lat: 10.0452, lon: 105.7469 },
];

// LẤY BIỂU TƯỢNG VÀ MÔ TẢ THỜI TIẾT
function getWeather(code) {
  if (code === 0) return { icon: "☀️", text: "Trời quang" };
  if (code === 1) return { icon: "🌤️", text: "Ít mây" };
  if (code === 2) return { icon: "⛅", text: "Mây rải rác" };
  if (code === 3) return { icon: "☁️", text: "Nhiều mây" };

  if (code === 45 || code === 48) {
    return { icon: "🌫️", text: "Sương mù" };
  }

  if (code >= 51 && code <= 67) {
    return { icon: "🌧️", text: "Mưa" };
  }

  if (code >= 71 && code <= 77) {
    return { icon: "❄️", text: "Tuyết" };
  }

  if (code >= 80 && code <= 82) {
    return { icon: "🌦️", text: "Mưa rào" };
  }

  if (code >= 85 && code <= 86) {
    return { icon: "🌨️", text: "Mưa tuyết" };
  }

  if (code >= 95) {
    return { icon: "⛈️", text: "Dông" };
  }

  return { icon: "🌤️", text: "Thời tiết khác" };
}

// CHUYỂN ĐỔI ĐỘ C SANG ĐỘ F
function convertTemp(temp, unit) {
  if (unit === "F") {
    return Math.round((temp * 9) / 5 + 32);
  }

  return Math.round(temp);
}

// COMPONENT CHÍNH
function App() {
  // Thành phố đang chọn
  const [selectedCity, setSelectedCity] = useState(null);

  // Dữ liệu thời tiết
  const [weather, setWeather] = useState(null);

  // Trạng thái tải
  const [loading, setLoading] = useState(false);

  // Trạng thái lỗi
  const [error, setError] = useState("");

  // Đơn vị nhiệt độ
  const [unit, setUnit] = useState("C");

  // Số lần thử lại
  const [retry, setRetry] = useState(0);

  // GỌI API
  useEffect(() => {
    if (!selectedCity) return;

    async function fetchWeather() {
      setLoading(true);
      setError("");
      setWeather(null);

      try {
        const url =
          `https://api.open-meteo.com/v1/forecast?` +
          `latitude=${selectedCity.lat}` +
          `&longitude=${selectedCity.lon}` +
          `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
          `&timezone=Asia%2FHo_Chi_Minh` +
          `&forecast_days=7`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Lỗi khi gọi API");
        }

        const data = await response.json();

        setWeather(data);
      } catch (err) {
        setError("Không tải được dữ liệu thời tiết!");
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [selectedCity, retry]);

  // GIAO DIỆN KHI CHƯA CHỌN THÀNH PHỐ
  if (!selectedCity) {
    return (
      <div className="app">
        <header>
          <h1>🌤️ Weather Việt Nam</h1>
          <p>Xem thời tiết 8 thành phố Việt Nam</p>
        </header>

        <div className="select-city">
          <h2>Chọn thành phố của bạn</h2>

          <div className="city-list">
            {cities.map((city) => (
              <button
                key={city.name}
                onClick={() => setSelectedCity(city)}
              >
                📍 {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // GIAO DIỆN CHÍNH
  return (
    <div className="app">
      <header>
        <h1>🌤️ Weather Việt Nam</h1>
        <p>Thông tin thời tiết 8 thành phố</p>
      </header>

      <div className="layout">

        {/* DANH SÁCH THÀNH PHỐ */}
        <aside className="sidebar">
          <h2>📍 Thành phố</h2>

          {cities.map((city) => (
            <button
              key={city.name}
              className={
                selectedCity.name === city.name ? "active" : ""
              }
              onClick={() => setSelectedCity(city)}
            >
              {city.name}
            </button>
          ))}
        </aside>

        {/* NỘI DUNG THỜI TIẾT */}
        <main className="content">

          <div className="top">
            <h2>{selectedCity.name}</h2>

            <div className="unit">
              <button
                className={unit === "C" ? "active-unit" : ""}
                onClick={() => setUnit("C")}
              >
                °C
              </button>

              <button
                className={unit === "F" ? "active-unit" : ""}
                onClick={() => setUnit("F")}
              >
                °F
              </button>
            </div>
          </div>

          {/* TRẠNG THÁI ĐANG TẢI */}
          {loading && (
            <div className="message">
              <h2>⏳ Đang tải dữ liệu...</h2>
              <p>Vui lòng chờ một chút!</p>
            </div>
          )}

          {/* TRẠNG THÁI LỖI */}
          {error && (
            <div className="message error">
              <h2>Đã xảy ra lỗi!</h2>
              <p>{error}</p>

              <button
                onClick={() => setRetry(retry + 1)}
              >
                Thử lại
              </button>
            </div>
          )}

          {/* HIỂN THỊ THỜI TIẾT */}
          {!loading && !error && weather && (
            <>
              {/* THỜI TIẾT HIỆN TẠI */}
              <section className="current">
                <h2>Thời tiết hiện tại</h2>

                <div className="weather-main">
                  <span className="weather-icon">
                    {
                      getWeather(
                        weather.current.weather_code
                      ).icon
                    }
                  </span>

                  <div>
                    <h1>
                      {convertTemp(
                        weather.current.temperature_2m,
                        unit
                      )}
                      °{unit}
                    </h1>

                    <p>
                      {
                        getWeather(
                          weather.current.weather_code
                        ).text
                      }
                    </p>
                  </div>
                </div>

                <div className="details">

                  <div className="detail-box">
                    <p>💧 Độ ẩm</p>
                    <h3>
                      {weather.current.relative_humidity_2m}%
                    </h3>
                  </div>

                  <div className="detail-box">
                    <p>💨 Tốc độ gió</p>
                    <h3>
                      {weather.current.wind_speed_10m} km/h
                    </h3>
                  </div>

                </div>

                <p className="update">
                  Cập nhật lúc:{" "}
                  {weather.current.time.replace("T", " ")}
                </p>
              </section>

              {/* DỰ BÁO 7 NGÀY */}
              <section className="forecast">
                <h2>📅 Dự báo 7 ngày</h2>

                <div className="forecast-list">

                  {weather.daily.time.map((date, index) => {
                    const day = new Date(
                      date + "T12:00:00"
                    );

                    const dayName = day.toLocaleDateString(
                      "vi-VN",
                      { weekday: "long" }
                    );

                    const info = getWeather(
                      weather.daily.weather_code[index]
                    );

                    const maxTemp = convertTemp(
                      weather.daily.temperature_2m_max[index],
                      unit
                    );

                    const minTemp = convertTemp(
                      weather.daily.temperature_2m_min[index],
                      unit
                    );

                    return (
                      <div className="day" key={date}>
                        <p>{dayName}</p>

                        <p>
                          {date.split("-").reverse().join("/")}
                        </p>

                        <span>{info.icon}</span>

                        <p>{info.text}</p>

                        <h3>
                          {maxTemp}° / {minTemp}°
                        </h3>
                      </div>
                    );
                  })}

                </div>
              </section>
            </>
          )}

          {/* QUAY LẠI */}
          <button
            className="back"
            onClick={() => {
              setSelectedCity(null);
              setWeather(null);
              setError("");
            }}
          >
            ← Quay lại chọn thành phố
          </button>

        </main>
      </div>
    </div>
  );
}

export default App;
