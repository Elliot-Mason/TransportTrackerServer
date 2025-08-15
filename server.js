require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// API endpoint to fetch train data
app.get('/api/trains', async (req, res) => {
    try {
        const { name_origin, name_destination } = req.query;

        if (!name_origin || !name_destination) {
            return res.status(400).json({ error: 'Missing required query parameters: name_origin and name_destination' });
        }

        const now = new Date();
        const itdDate = now.toISOString().split('T')[0].replace(/-/g, ''); // Format: YYYYMMDD
        const itdTime = now.toTimeString().split(' ')[0].replace(/:/g, '').slice(0, 4); // Format: HHMM

        const requestConfig = {
            headers: { 'Authorization': `apikey ${process.env.API_KEY}` },
            params: {
                outputFormat: 'rapidJSON',
                coordOutputFormat: 'EPSG:4326',
                depArrMacro: 'dep',
                itdDate: itdDate,
                itdTime: itdTime,
                type_origin: 'any',
                name_origin: name_origin,
                type_destination: 'any',
                name_destination: name_destination,
                calcNumberOfTrips: 1, //this can be adjusted to fetch more trips, currently set to 1 for e-ink display however for the react app it can be changed to suit purpose
                TfNSWTR: true,
                version: '10.2.1.42',
                itOptionsActive: 1,
                cycleSpeed: 16,
                excludedMeans: 'checkbox',
                exclMOT_2:1,
                exclMOT_4:1,
                exclMOT_5:1,
                exclMOT_7:1,
                exclMOT_9:1,
                exclMOT_11:1
            }
        };
        const response = await axios.get('https://api.transport.nsw.gov.au/v1/tp/trip', requestConfig);
        const trains = response.data.journeys.slice(0, 5);
        res.json(trains);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch train data' });
    }
});

// API endpoint to fetch ferry data
app.get('/api/ferries', async (req, res) => {
    try {
        const { name_origin, name_destination } = req.query;

        if (!name_origin || !name_destination) {
            return res.status(400).json({ error: 'Missing required query parameters: name_origin and name_destination' });
        }

        const now = new Date();
        const itdDate = now.toISOString().split('T')[0].replace(/-/g, ''); // Format: YYYYMMDD
        const itdTime = now.toTimeString().split(' ')[0].replace(/:/g, '').slice(0, 4); // Format: HHMM

        const requestConfig = {
            headers: { 'Authorization': `apikey ${process.env.API_KEY}` },
            params: {
                outputFormat: 'rapidJSON',
                coordOutputFormat: 'EPSG:4326',
                depArrMacro: 'dep',
                itdDate: itdDate,
                itdTime: itdTime,
                type_origin: 'any',
                name_origin: name_origin,
                type_destination: 'any',
                name_destination: name_destination,
                calcNumberOfTrips: 6,
                TfNSWTR: true,
                version: '10.2.1.42',
                itOptionsActive: 1,
                cycleSpeed: 16,
                excludedMeans: 'checkbox',
                exclMOT_1:1,
                exclMOT_2:1,
                exclMOT_4:1,
                exclMOT_5:1,
                exclMOT_7:1,
                exclMOT_11:1
            }
        };
        const response = await axios.get('https://api.transport.nsw.gov.au/v1/tp/trip', requestConfig);
        const ferries = response.data.journeys.slice(0, 5);
        res.json(ferries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch ferry data' });
    }
});

// API endpoint to fetch lightrail data
app.get('/api/lightrail', async (req, res) => {
    try {
        const { name_origin, name_destination } = req.query;

        if (!name_origin || !name_destination) {
            return res.status(400).json({ error: 'Missing required query parameters: name_origin and name_destination' });
        }

        const now = new Date();
        const itdDate = now.toISOString().split('T')[0].replace(/-/g, ''); // Format: YYYYMMDD
        const itdTime = now.toTimeString().split(' ')[0].replace(/:/g, '').slice(0, 4); // Format: HHMM

        const requestConfig = {
            headers: { 'Authorization': `apikey ${process.env.API_KEY}` },
            params: {
                outputFormat: 'rapidJSON',
                coordOutputFormat: 'EPSG:4326',
                depArrMacro: 'dep',
                itdDate: itdDate,
                itdTime: itdTime,
                type_origin: 'any',
                name_origin: name_origin,
                type_destination: 'any',
                name_destination: name_destination,
                calcNumberOfTrips: 6,
                TfNSWTR: true,
                version: '10.2.1.42',
                itOptionsActive: 1,
                cycleSpeed: 16,
                excludedMeans: 'checkbox',
                exclMOT_1:1,
                exclMOT_2:1,
                exclMOT_5:1,
                exclMOT_7:1,
                exclMOT_9:1,
                exclMOT_11:1
            }
        };
        const response = await axios.get('https://api.transport.nsw.gov.au/v1/tp/trip', requestConfig);
        const lightrail = response.data.journeys.slice(0, 5);
        res.json(lightrail);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch lightrail data' });
    }
});

// API endpoint to fetch metro data
app.get('/api/metro', async (req, res) => {
    try {
        const { name_origin, name_destination } = req.query;

        if (!name_origin || !name_destination) {
            return res.status(400).json({ error: 'Missing required query parameters: name_origin and name_destination' });
        }

        const now = new Date();
        const itdDate = now.toISOString().split('T')[0].replace(/-/g, ''); // Format: YYYYMMDD
        const itdTime = now.toTimeString().split(' ')[0].replace(/:/g, '').slice(0, 4); // Format: HHMM

        const requestConfig = {
            headers: { 'Authorization': `apikey ${process.env.API_KEY}` },
            params: {
                outputFormat: 'rapidJSON',
                coordOutputFormat: 'EPSG:4326',
                depArrMacro: 'dep',
                itdDate: itdDate,
                itdTime: itdTime,
                type_origin: 'any',
                name_origin: name_origin,
                type_destination: 'any',
                name_destination: name_destination,
                calcNumberOfTrips: 6,
                TfNSWTR: true,
                version: '10.2.1.42',
                itOptionsActive: 1,
                cycleSpeed: 16,
                excludedMeans: 'checkbox',
                exclMOT_1:1,
                exclMOT_4:1,
                exclMOT_5:1,
                exclMOT_7:1,
                exclMOT_9:1,
                exclMOT_11:1
            }
        };

        // Construct the full request URL
        const requestUrl = `https://api.transport.nsw.gov.au/v1/tp/trip?${new URLSearchParams(requestConfig.params).toString()}`;
        console.log('Trips Request URL:', requestUrl);

        const response = await axios.get(requestUrl, requestConfig);
        console.log('API Response:', response.data);

        if (!response.data.journeys) {
            console.error('Journeys property is missing in the API response');
            return res.status(500).json({ error: 'Journeys property is missing in the API response' });
        }

        const metro = response.data.journeys.slice(0, 5);
        res.json(metro);
    } catch (error) {
        console.error('Error fetching metro data:', error);
        res.status(500).json({ error: 'Failed to fetch metro data' });
    }
});



