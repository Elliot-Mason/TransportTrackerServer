const axios = require('axios');

/**
 * Returns the current date (YYYYMMDD) and time (HHMM) in Australia/Sydney time.
 * Automatically handles Australian Eastern Standard Time (AEST) and
 * Australian Eastern Daylight Time (AEDT).
 */
function getSydneyDateTime(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Sydney',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((p) => [p.type, p.value])
  );

  return {
    itdDate: `${parts.year}${parts.month}${parts.day}`,
    itdTime: `${parts.hour}${parts.minute}`,
  };
}

/**
 * Applies standard CORS headers to the response.
 * Returns true if the request was an OPTIONS preflight (and ended).
 */
function handleCors(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

/**
 * Common handler for all TfNSW transport mode trip requests.
 *
 * @param {object} req - HTTP request object
 * @param {object} res - HTTP response object
 * @param {object} excludedMot - Mode of transport exclusion dictionary
 * @param {string} modeName - Name of mode for logging / diagnostics
 */
async function handleTransportRequest(req, res, excludedMot, modeName) {
  // 1. Handle CORS preflight
  if (handleCors(req, res)) {
    return;
  }

  // 2. Validate method
  if (req.method && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Only GET is supported.' });
  }

  // 3. Validate environment
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error(`[${modeName}] API_KEY not set in environment variables`);
    return res.status(500).json({
      error: 'API_KEY not set in environment variables',
    });
  }

  // 4. Validate query parameters
  const query = req.query || {};
  const { name_origin, name_destination, count, allow_buses } = query;
  if (!name_origin || !name_destination) {
    return res.status(400).json({
      error: 'Missing required query parameters: name_origin and name_destination',
    });
  }

  // Determine number of trips to request (default 5, max 10)
  const tripCount = Math.min(Math.max(parseInt(count, 10) || 5, 1), 10);

  // If allow_buses is enabled, permit bus services (e.g. for rail replacement during trackwork)
  const activeExclusions = { ...excludedMot };
  if (allow_buses === 'true' || allow_buses === '1') {
    delete activeExclusions.exclMOT_5;
  }

  // 5. Get current date & time in Sydney timezone
  const { itdDate, itdTime } = getSydneyDateTime();

  const requestConfig = {
    headers: {
      Authorization: `apikey ${apiKey}`,
    },
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
      calcNumberOfTrips: tripCount + 1,
      TfNSWTR: true,
      version: '10.2.1.42',
      itOptionsActive: 1,
      cycleSpeed: 16,
      excludedMeans: 'checkbox',
      ...activeExclusions,
    },
    timeout: 10000, // 10-second timeout
  };

  try {
    const response = await axios.get(
      'https://api.transport.nsw.gov.au/v1/tp/trip',
      requestConfig
    );

    if (response.data?.error) {
      console.warn(`[${modeName}] TfNSW returned error payload:`, response.data.error);
      return res.status(400).json({
        error: 'Transport for NSW returned an error',
        details: response.data.error,
      });
    }

    const journeys = Array.isArray(response.data?.journeys)
      ? response.data.journeys
      : [];

    return res.status(200).json(journeys.slice(0, tripCount));
  } catch (error) {
    if (error.response) {
      console.error(
        `[${modeName}] TfNSW API error (${error.response.status}):`,
        error.response.data || error.message
      );
      const status =
        error.response.status >= 400 && error.response.status < 600
          ? error.response.status
          : 500;
      return res.status(status).json({
        error: 'Transport for NSW API request failed',
        details: error.response.data || error.message,
      });
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error(`[${modeName}] Request timed out:`, error.message);
      return res.status(504).json({
        error: 'Transport for NSW API request timed out',
      });
    } else {
      console.error(`[${modeName}] Internal server error:`, error.message);
      return res.status(500).json({
        error: `Failed to fetch ${modeName} data`,
        details: error.message,
      });
    }
  }
}

module.exports = {
  getSydneyDateTime,
  handleCors,
  handleTransportRequest,
};
