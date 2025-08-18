# NSW Transport API Proxy Server

This is an **Express.js** server that provides proxy API endpoints for fetching **real-time transport data** (trains, ferries, light rail, and metro) from the **Transport for NSW (TfNSW) API**.  
It is designed to make frontend integration easier by avoiding CORS issues and hiding the API key.

---

## 📌 Features

- Fetch upcoming **train departures** between two stops.
- Fetch upcoming **ferry departures** between two stops.
- Fetch upcoming **light rail departures** between two stops.
- Fetch upcoming **metro departures** between two stops.
- Automatically uses the **current date and time** when making requests.
- Supports **CORS** for cross-origin frontend access.
- Handles **error responses** gracefully.

---

## ⚙️ Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```env
   API_KEY=your_tfnsw_api_key_here
   PORT=5000
   ```

   - **API_KEY**: Your Transport for NSW API key ([apply here](https://opendata.transport.nsw.gov.au/)).
   - **PORT**: Optional. Defaults to `5000`.

---

## 🚀 Usage

Start the server:

```bash
node server.js
```

The server will be running at (unless hosted elsewhere):

```
http://localhost:5000
```

---

## 📡 API Endpoints

Each endpoint requires two query parameters:

- `name_origin`: The name or stop ID of the departure location.
- `name_destination`: The name or stop ID of the arrival location.

---

### 1️⃣ Trains
**GET** `/api/trains`

Example:
```
/api/trains?name_origin=Central&name_destination=Parramatta
```

Returns the **next train trip** between the two locations.

---

### 2️⃣ Ferries
**GET** `/api/ferries`

Example:
```
/api/ferries?name_origin=Circular Quay Wharf 5&name_destination=Manly Wharf
```

Returns the **next 5 ferry trips**.

---

### 3️⃣ Light Rail
**GET** `/api/lightrail`

Example:
```
/api/lightrail?name_origin=Central&name_destination=Dulwich Hill
```

Returns the **next 5 light rail trips**.

---

### 4️⃣ Metro
**GET** `/api/metro`

Example:
```
/api/metro?name_origin=Tallawong&name_destination=Chatswood
```

Returns the **next 5 metro trips**.

---

## 📂 Response Format

Each endpoint returns an array of up to **5 journey objects** from the TfNSW API, in JSON format.
>This can be modified by changing the parameter 'calcNumberOfTrips' in each request.

Example (truncated):
```json
[
  {
    "legs": [
      {
        "transportation": {
          "product": { "name": "Train" }
        },
        "origin": { "name": "Central Station" },
        "destination": { "name": "Parramatta Station" },
        "departure": "2025-08-15T14:35:00Z"
      }
    ]
  }
]
```

---

## 🛠 Dependencies

- [Express](https://expressjs.com/) – Web framework for Node.js.
- [Axios](https://axios-http.com/) – HTTP client for API calls.
- [dotenv](https://github.com/motdotla/dotenv) – Environment variable management.
- [cors](https://github.com/expressjs/cors) – Cross-origin resource sharing.

---

## ⚠️ Notes

- This server **does not cache results** — each request queries TfNSW directly.
- The `calcNumberOfTrips` parameter can be adjusted in the code to return more or fewer trips.
- The server hides your API key from frontend clients, but requests still count toward your TfNSW API usage limits.
