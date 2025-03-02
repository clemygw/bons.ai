const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Get insights for user's transactions
router.get('/user-insights/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Fetching insights for userId:', userId); // Debug log

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const transactions = await Transaction.find({
      user: userId,
      date: { $gte: oneMonthAgo }
    }).sort({ date: -1 });

    console.log('Found transactions:', transactions.length); // Debug log

    if (!transactions.length) {
      return res.status(404).json({ 
        message: 'No transactions found for the past month' 
      });
    }

    // Safely prepare transaction data for JSON
    const safeTransactions = transactions.map(t => ({
      merchant: t.merchant,
      amount: t.amount,
      date: t.date,
      category: t.category,
      co2Emissions: t.co2Emissions
    }));

    console.log('Processing transactions for OpenAI...'); // Debug log

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful financial and environmental advisor. Analyze the user's recent transactions and provide personalized insights about their spending patterns and environmental impact."
        },
        {
          role: "user",
          content: `Here are my transactions from the last month: ${JSON.stringify(safeTransactions)}. 
          Please provide:
          1. Key spending patterns
          2. Environmental impact insights
          3. Specific recommendations for reducing both costs and carbon footprint
          4. Any notable trends or areas of concern

          Keep it short and concise, with a friendly tone.
          Emphasize the importance of cost-effectiveness first, then environmental impact.
          
          Answer in this format:
          Spending Patterns: {1-2 sentences}
          Environmental Impact: {1-2 sentences}
          Recommendations: {1-3 sentences}
          Trends/Concerns: {1 sentence}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    console.log('Received OpenAI response'); // Debug log

    res.json({ 
      insights: response.choices[0].message.content,
      transactionCount: transactions.length,
      dateRange: {
        from: oneMonthAgo,
        to: new Date()
      }
    });
  } catch (error) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    if (error instanceof SyntaxError) {
      return res.status(400).json({
        error: 'Invalid JSON format',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.status(500).json({ 
      error: 'Failed to generate insights',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router; 