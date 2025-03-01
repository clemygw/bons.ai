const Transaction = require('../models/Transaction.model');

// Constants could be moved to utils/constants.js
const AVERAGE_US_EMISSIONS_PER_YEAR = 15.52; // metric tons

const calculateEmissionsReduced = async (userId) => {
  try {
    // Get all transactions for user within the last year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const userTransactions = await Transaction.find({
      user: userId,
      createdAt: { $gte: oneYearAgo }
    });

    // Sum up all CO2 emissions from transactions
    const userTotalEmissions = userTransactions.reduce((total, transaction) => {
      return total + (transaction.co2Emissions || 0);
    }, 0);

    // Convert to metric tons if stored in different unit
    const userEmissionsInMetricTons = userTotalEmissions / 1000; // assuming stored in kg

    // Calculate reduction (negative means they reduced emissions)
    const emissionsReduced = AVERAGE_US_EMISSIONS_PER_YEAR - userEmissionsInMetricTons;

    return {
      userEmissions: userEmissionsInMetricTons,
      averageEmissions: AVERAGE_US_EMISSIONS_PER_YEAR,
      emissionsReduced: emissionsReduced,
      percentageReduced: (emissionsReduced / AVERAGE_US_EMISSIONS_PER_YEAR) * 100
    };
  } catch (error) {
    throw new Error(`Error calculating emissions reduced: ${error.message}`);
  }
};

module.exports = {
  calculateEmissionsReduced
}; 