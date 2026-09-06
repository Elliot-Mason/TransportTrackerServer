const { handleTransportRequest } = require('../lib/transport');

const EXCLUDED_MOT = {
  exclMOT_1: 1, // Exclude Trains
  exclMOT_2: 1, // Exclude Metro
  exclMOT_4: 1, // Exclude Light Rail
  exclMOT_5: 1, // Exclude Bus
  exclMOT_7: 1, // Exclude Coach
  exclMOT_11: 1, // Exclude School Bus
};

module.exports = async function handler(req, res) {
  return handleTransportRequest(req, res, EXCLUDED_MOT, 'ferries');
};
