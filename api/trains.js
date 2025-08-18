// File: /pages/api/trains.js
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { name_origin, name_destination } = req.query;

    if (!process.env.API_KEY) {
      return res.status(500).json({
        error: "API_KEY not set in environment variables",
      });
    }


    if (!name_origin || !name_destination) {
      return res.status(400).json({
        error: 'Missing required query parameters: name_origin and name_destination',
      });
    }

    const now = new Date();
    const itdDate = now.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    const itdTime = now.toTimeString().split(' ')[0].replace(/:/g, '').slice(0, 4); // HHMM

    const requestConfig = {
      headers: { 'Authorization': `apikey ${process.env.API_KEY}` },
      params: {
        outputFormat: 'rapidJSON',
        coordOutputFormat: 'EPSG:4326',
        depArrMacro: 'dep',
        itdDate,
        itdTime,
        type_origin: 'any',
        name_origin: 10101100,
        type_destination: 'any',
        name_destination: 10101252,
        calcNumberOfTrips: 1,
        TfNSWTR: true,
        version: '10.2.1.42',
        itOptionsActive: 1,
        cycleSpeed: 16,
        excludedMeans: 'checkbox',
        exclMOT_2: 1,
        exclMOT_4: 1,
        exclMOT_5: 1,
        exclMOT_7: 1,
        exclMOT_9: 1,
        exclMOT_11: 1,
      },
      timeout: 10000, // 10s timeout
    };

    let response;
    try {
      response = await axios.get('https://api.transport.nsw.gov.au/v1/tp/trip', requestConfig);
    } catch (axiosError) {
      console.error('Transport API request failed:', axiosError.response?.data || axiosError.message);
      const status = axiosError.response?.status || 500;
      return res.status(status).json({
        error: 'Transport API request failed',
        details: axiosError.response?.data || axiosError.message,
      });
    }

    if (!response.data || !Array.isArray(response.data.journeys)) {
      console.error('Invalid API response:', response.data);
      return res.status(500).json({
        error: 'Transport API returned invalid data',
        details: response.data || null,
      });
    }

    res.status(200).json(response.data.journeys.slice(0, 5));
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Failed to fetch train data', details: error.message });
  }
}
