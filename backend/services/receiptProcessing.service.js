// backend/services/receiptProcessing.service.js
const vision = require('@google-cloud/vision');
const openai = require('openai');

const visionClient = new vision.ImageAnnotatorClient();
openai.apiKey = process.env.OPENAI_API_KEY;

async function extractTextFromImage(imagePath) {
  const [result] = await visionClient.textDetection(imagePath);
  const detections = result.textAnnotations;
  if (!detections || detections.length === 0) {
    throw new Error('No text detected in image');
  }
  return detections[0].description;
}

async function getCarbonEmission(receiptText) {
  const messages = [
    {
      role: 'system',
      content:
        "You are an expert assistant specialized in calculating carbon emissions from receipt data. " +
        "Given the receipt details (items and prices), output the total carbon emissions in kg CO2e."
    },
    {
      role: 'user',
      content: receiptText
    }
  ];

  const response = await openai.ChatCompletion.create({
    model: 'gpt-4',
    messages,
    temperature: 0.2,
    max_tokens: 150
  });
  return response.choices[0].message.content;
}

module.exports = { extractTextFromImage, getCarbonEmission };
