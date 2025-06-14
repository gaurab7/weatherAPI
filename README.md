
# 🌦️ Weather API (Backend)

A backend API for fetchingr eal-timew eather data fot any city using WeatherAPI, featuring rate limiting, city input validation, and integration with third-party weather services.
Built with testing in mind (Jest + Supertest).

## 🛠 Tech Stack
- **Backend**: Node.js, Express
- **APIs**: WeatherAPI (Weather), GeoNames (City Validation)
- **Testing**: Jest, Supertest
- **Rate Limiting**: express-rate-limit

## 🚀 Features

- **City Validation Middleware**  
  - Validates cities via GeoNames API
  - Handles special characters and case sensitivity (e.g., "nEw yOrk" → "New York"
- **Rate Limiting**  
  - 1 requests/minute(changeable).
- **Weather Data Fetching**  
  - Integrates with WeatherAPI.com.
- **Comprehensive Testing**  
  - Rate limiting & verification middleware tests (Jest + Supertest).
