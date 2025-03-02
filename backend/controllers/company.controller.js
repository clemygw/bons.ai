const Company = require('../models/company.model');
const User = require('../models/User.model');
// Constants for emissions calculations
const CO2_PER_DOLLAR = 3.7; // Average US CO2 emissions per dollar spent

const companyController = {
  // Get all companies
  getAllCompanies: async (req, res) => {
    try {
      const companies = await Company.find();
      res.status(200).json(companies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create a new company
  createCompany: async (req, res) => {
    try {
      const newCompany = new Company(req.body);
      const savedCompany = await newCompany.save();
      res.status(201).json(savedCompany);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Get a specific company
  getCompany: async (req, res) => {
    try {
      const company = await Company.findById(req.params.companyId);
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }
      res.status(200).json(company);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Update a company
  updateCompany: async (req, res) => {
    try {
      const updatedCompany = await Company.findByIdAndUpdate(
        req.params.companyId,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!updatedCompany) {
        return res.status(404).json({ message: 'Company not found' });
      }
      
      res.status(200).json(updatedCompany);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Delete a company
  deleteCompany: async (req, res) => {
    try {
      const company = await Company.findById(req.params.companyId);
      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      // Update users who belong to this company
      await User.updateMany(
        { company: company._id },
        { $unset: { company: 1 } }
      );

      await Company.findByIdAndDelete(req.params.companyId);
      res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getCompanyById: async (req, res) => {
    try {
      const company = await Company.findById(req.params.id);
      if (!company) {
        return res.status(404).json({ error: 'Company not found' });
      }
      res.json(company);
    } catch (error) {
      console.error('Error fetching company:', error);
      res.status(500).json({ error: 'Server error' });
    }
  },

  getCompanyLeaderboard: async (req, res) => {
    try {
      const { timeRange = '6m' } = req.query; // Default to 6 months if not specified
      
      // Calculate start date based on time range
      const startDate = new Date();
      switch(timeRange) {
        case '1m':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case '3m':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case '6m':
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        case '1y':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(startDate.getMonth() - 6);
      }

      const company = await Company.findById(req.params.id)
        .populate({
          path: 'users',
          select: 'firstName lastName transactions',
          populate: {
            path: 'transactions',
            select: 'co2Emissions amount date',
            match: { date: { $gte: startDate } }
          }
        });

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      // Calculate emissions for each user based on spending
      const leaderboardData = company.users.map(user => {
        const totalSpending = user.transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const actualEmissions = user.transactions.reduce((sum, t) => sum + (t.co2Emissions || 0), 0);
        const expectedEmissions = totalSpending * CO2_PER_DOLLAR;
        const emissionsReduced = Math.max(0, expectedEmissions - actualEmissions);
        const percentageReduced = expectedEmissions > 0 
          ? ((emissionsReduced / expectedEmissions) * 100).toFixed(1)
          : "0.0";
        
        return {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          totalSpending,
          actualEmissions,
          emissionsReduced,
          percentageReduced
        };
      });

      // Sort by emissions reduced (highest reduction first)
      const sortedLeaderboard = leaderboardData.sort((a, b) => 
        b.emissionsReduced - a.emissionsReduced
      );

      // Add rank to each entry
      const rankedLeaderboard = sortedLeaderboard.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

      // Calculate company-wide stats
      const totalSpending = rankedLeaderboard.reduce((sum, user) => sum + user.totalSpending, 0);
      const totalActualEmissions = rankedLeaderboard.reduce((sum, user) => sum + user.actualEmissions, 0);
      const totalExpectedEmissions = totalSpending * CO2_PER_DOLLAR;
      const totalEmissionsReduced = rankedLeaderboard.reduce((sum, user) => sum + user.emissionsReduced, 0);
      
      const averageSpending = totalSpending / company.users.length;
      const averageActualEmissions = totalActualEmissions / company.users.length;
      const averageExpectedEmissions = averageSpending * CO2_PER_DOLLAR;
      const averageReductionPerUser = totalEmissionsReduced / company.users.length;

      res.json({
        companyName: company.name,
        timeRange,
        totalUsers: company.users.length,
        leaderboard: rankedLeaderboard,
        companyStats: {
          totalSpending,
          totalActualEmissions,
          totalEmissionsReduced,
          averageSpending,
          averageActualEmissions,
          averageReductionPerUser,
          topPerformer: rankedLeaderboard[0] ? 
            `${rankedLeaderboard[0].firstName} ${rankedLeaderboard[0].lastName}` : 
            'No users yet'
        }
      });

    } catch (error) {
      console.error('Leaderboard error:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = companyController;

