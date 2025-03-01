// backend/routes/receipt.routes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer
const upload = multer({ 
    dest: uploadsDir,
    limits: {
        fileSize: 15 * 1024 * 1024 // 10MB limit
    }
});

// Add this before your routes
const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: 'File is too large. Maximum size is 15MB'
            });
        }
    }
    next(err);
};

// POST /api/receipt
router.post('/', upload.single('receipt'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const imageData = fs.readFileSync(filePath, { encoding: 'base64' });

    const messages = [
      {
        role: 'system',
        content: (
          "You are an expert at analyzing receipts and calculating carbon emissions. Your task:\n"
          + "1. Extract all receipt information including merchant name, items, prices, and quantities\n"
          + "2. Categorize the transaction as: 'dining', 'grocery', 'retail', or 'other'\n"
          + "3. Calculate CO2 emissions using these values (kg CO2e per kg food produced):\n"
          + "4. Even if the item is not listed, if it is a meat, assume it is a beef herd animal and use the value for beef (beef herd) \n"
          + "- Beef (beef herd): 99.48\n"
          + "- Beef (dairy herd): 33.3\n"
          + "- Lamb & Mutton: 39.72\n"
          + "- Cheese: 23.88\n"
          + "- Dark Chocolate: 46.65\n"
          + "- Coffee: 28.53\n"
          + "- Shrimps (farmed): 26.87\n"
          + "- Fish (farmed): 13.63\n"
          + "- Pig Meat: 12.31\n"
          + "- Poultry Meat: 9.87\n"
          + "- Eggs: 4.67\n"
          + "- Rice: 4.45\n"
          + "- Milk: 3.15\n"
          + "- Other items: 3.2\n"
          + "\nReturn a JSON object with EXACTLY this structure:\n"
          + "{\n"
          + "  \"merchant\": \"store name\",\n"
          + "  \"category\": \"grocery/dining/retail/other\",\n"
          + "  \"amount\": total_receipt_amount,\n"
          + "  \"items\": [\n"
          + "    {\n"
          + "      \"name\": \"item name\",\n"
          + "      \"price\": item_price,\n"
          + "      \"quantity\": item_quantity\n"
          + "    }\n"
          + "  ],\n"
          + "  \"co2Emissions\": total_emissions_in_kg\n"
          + "}"
        )
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Extract all receipt information and calculate total CO2 emissions.'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageData}`
            }
          }
        ]
      }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.1,
      max_tokens: 1000
    });

    const result = response.choices[0].message.content;
    
    res.json({
      success: true,
      totalEmissions: parseFloat(result) || result
    });

  } catch (error) {
    console.error('Error processing receipt:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

// Use the error handler
router.use(multerErrorHandler);

module.exports = router;
