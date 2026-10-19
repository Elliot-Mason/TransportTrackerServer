# NSW Transport API Proxy Server

This is a **Vercel Serverless** proxy service for fetching **real-time transport data** (trains, ferries, light rail, and metro) from the **Transport for NSW (TfNSW) Trip Planner API**.  
It simplifies frontend integration by securely managing the TfNSW API key and enabling CORS for cross-origin client apps.

---

## 📌 Features

- Fetch upcoming **train departures** between two stops.
- Fetch upcoming **ferry departures** between two stops.
- Fetch upcoming **light rail departures** between two stops.
- Fetch upcoming **metro departures** between two stops.
- Automatically calculates the **current date and time in Sydney timezone** (`Australia/Sydney`), handling AEST and AEDT (Daylight Saving Time).
- Built-in **CORS** headers and `OPTIONS` preflight support.
- Standardized error handling and request timeouts (10s).

---

## ⚙️ Setup & Deployment

### 1. Environment Variable

You need an API key from the [Transport for NSW Open Data Hub](https://opendata.transport.nsw.gov.au/).

Configure the following environment variable in your Vercel Project Settings (or in a local `.env` file):

```env
API_KEY=your_tfnsw_api_key_here
```

### 2. Local Testing

Run locally using Node.js:
```bash
# With Node 20.6+ native env file loading
node --env-file=.env test.js

# Or using Vercel CLI
vercel dev
```

---

## 📡 API Endpoints

All endpoints support `GET` and `OPTIONS` (preflight).

### Query Parameters

| Parameter | Required | Description |
| :--- | :--- | :--- |
| `name_origin` | **Yes** | Stop ID or station name of the departure location (e.g., `10101100` for Central Station). |
| `name_destination` | **Yes** | Stop ID or station name of the arrival location (e.g., `10101103` for Town Hall). |
| `count` | No | Number of trips to return (default: `5`, max: `10`). |
| `allow_buses` | No | Set to `true` to include replacement bus services during trackwork / disruptions (default: `false`). |
| `itdDate` | No | Custom date in `YYYYMMDD` format (e.g., `20261019`). Defaults to the current date in Sydney timezone. |
| `itdTime` | No | Custom time in 24-hour `HHMM` format (e.g., `1430`). Defaults to the current time in Sydney timezone. |

---

### 1️⃣ Trains
**GET** `/api/trains`

Example:
```
/api/trains?name_origin=10101100&name_destination=10101115
```

Returns up to 5 upcoming train journeys.

---

### 2️⃣ Ferries
**GET** `/api/ferries`

Example:
```
/api/ferries?name_origin=10101100&name_destination=10102027
```

Returns up to 5 upcoming ferry journeys.

---

### 3️⃣ Light Rail
**GET** `/api/lightrail`

Example:
```
/api/lightrail?name_origin=10101100&name_destination=10101234
```

Returns up to 5 upcoming light rail journeys.

---

### 4️⃣ Metro
**GET** `/api/metro`

Example:
```
/api/metro?name_origin=10101100&name_destination=10101345
```

Returns up to 5 upcoming metro journeys.

---

## 📂 Response Format

Each endpoint returns an array of journey objects from the TfNSW `rapidJSON` API.

> **Note on Departure Times:** Departure and arrival timestamps in TfNSW `rapidJSON` format are located within `journey.legs`:
> - `leg.origin.departureTimeEstimated`: Real-time predicted departure (ISO 8601 UTC).
> - `leg.origin.departureTimePlanned`: Scheduled timetable departure (ISO 8601 UTC). Fallback if estimated time is unavailable.

---

## 🛠 Tech Stack

- **Runtime:** Node.js (Vercel Serverless Functions)
- **HTTP Client:** [Axios](https://axios-http.com/)
