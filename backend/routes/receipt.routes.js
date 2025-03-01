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

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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
router.post('/upload', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

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
          + "5. Be extremely thorough - do not skip any items, even if they seem insignificant\n"
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
    
    // Clean up: Delete the file after processing
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error processing receipt:', error);
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

// Use the error handler
router.use(multerErrorHandler);

router.get('/test', (req, res) => {
  res.json({ message: 'Receipt route is working' });
});

module.exports = router;
