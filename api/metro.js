import axios from 'axios';

export default async function handler(req, res) {
    try {
        const { name_origin, name_destination } = req.query;

        if (!name_origin || !name_destination) {
            return res.status(400).json({ error: 'Missing required query parameters: name_origin and name_destination' });
        }

        const now = new Date();
        const itdDate = now.toISOString().split('T')[0].replace(/-/g, '');
        const itdTime = now.toTimeString().split(' ')[0].replace(/:/g, '').slice(0, 4);

        const requestConfig = {
            headers: { 'Authorization': `apikey ${process.env.API_KEY}` },
            params: {
                outputFormat: 'rapidJSON',
                coordOutputFormat: 'EPSG:4326',
                depArrMacro: 'dep',
                itdDate,
                itdTime,
                type_origin: 'any',
                name_origin,
                type_destination: 'any',
                name_destination,
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

        const response = await axios.get('https://api.transport.nsw.gov.au/v1/tp/trip', requestConfig);

        res.status(200).json(response.data.journeys?.slice(0, 5) || []);
    } catch (error) {
        console.error('Error fetching metro:', error.message);
        res.status(500).json({ error: 'Failed to fetch metro data' });
    }
}
