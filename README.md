
# Moist Weather 

A lightweight **Node.js backend** for the **Moist Weather** web application, responsible for securely fetching real-time weather data for any city using **WeatherAPI**.  
The backend handles city input validation, communicates with third-party APIs, and supports safe deployment with environment variables.  
It complements a **frontend-driven project** built with HTML, CSS, and vanilla JavaScript.  

The backend is primarily for **API handling and learning purposes**, while the frontend drives the user experience.

---

## Tech Stack

- **Backend**: Node.js, Express  
- **APIs**: WeatherAPI (Weather Data), GeoNames (City Validation)  
- **Environment Variables**: API keys stored in `.env` and excluded from Git  
- **Testing**: Jest, Supertest, REST Client  

---

## Features

### 1. City Validation Middleware
- Validates user input city names via **GeoNames API**.  
- Handles **special characters, casing, and spacing** (e.g., `"nEw yOrk"` → `"New York"`).  
- Prevents invalid requests from reaching the weather API.  

### 2. Rate Limiting
- Limits requests to **1 request/minute** (configurable).  
- Protects the API and prevents misuse.  

### 3. Weather Data Fetching
- Fetches real-time weather data from **WeatherAPI.com**.  
- Supports temperature, humidity, feels-like temperature, wind speed, and other standard weather metrics.  
- Sends JSON responses formatted for easy consumption by the frontend.  

### 4. Testing & Reliability
- Middleware and rate limiting tested with **Jest + Supertest**.  
- Weather API fetches tested using **REST Client**.  
- Local testing facilitated via **Nodemon** for automatic reloads.  

---

## Folder Structure

```text
weatherAPI/
│
├─ src/
│   ├─ controllers/       # Handles API response logic
│   ├─ routers/           # Defines routes and links them to controllers
│   ├─ services/          # Business logic & API calls
│   ├─ middleware/        # Validation, rate limiting, error handling
│   └─ server.js          # Entry point of the backend
│
├─ public/                # Frontend files (HTML, CSS, JS, images)
├─ .env                   # Environment variables (API keys)
├─ package.json           # Project dependencies and scripts
└─ render.yaml            # Render deployment configuration
```

---

 ## Link to live site:
 - https://moist-weather.onrender.com


