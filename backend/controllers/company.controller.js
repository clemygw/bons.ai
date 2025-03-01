const Company = require('../models/company.model');
const User = require('../models/User.model');

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
  }
};

module.exports = companyController;

