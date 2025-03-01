const express = require('express');
const router = express.Router();
const companyController = require('../controllers/company.controller');

// Get all companies
router.get('/', companyController.getAllCompanies);

// Create a new company
router.post('/', companyController.createCompany);

// Get a specific company
router.get('/:companyId', companyController.getCompany);

// Update a company
router.put('/:companyId', companyController.updateCompany);

// Delete a company
router.delete('/:companyId', companyController.deleteCompany);

module.exports = router;
