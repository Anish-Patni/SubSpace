import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const extractSubscriptionData = async (userInput) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are a subscription data extraction assistant. Extract subscription information from the user's natural language input and return ONLY a valid JSON object with these exact fields:

{
  "serviceName": "string (name of the service)",
  "price": number (numeric value only, no currency symbols),
  "billingCycle": "string (must be one of: monthly, yearly, weekly, quarterly)",
  "renewalDate": "string (ISO date format YYYY-MM-DD)",
  "paymentMethod": "string (optional, payment method description)",
  "category": "string (optional, e.g., Entertainment, Productivity, etc.)",
  "notes": "string (optional, any additional details)"
}

Rules:
- Return ONLY the JSON object, no markdown, no explanations, no code blocks
- If renewalDate is not specified, estimate based on current date and billing cycle
- If information is missing, use reasonable defaults or omit optional fields
- Ensure billingCycle is exactly one of: monthly, yearly, weekly, quarterly
- Price must be a number without currency symbols

User input: "${userInput}"`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    // Parse the JSON
    const extractedData = JSON.parse(cleanedText);

    // Validate required fields
    if (!extractedData.serviceName || !extractedData.price || !extractedData.billingCycle || !extractedData.renewalDate) {
      throw new Error('Missing required fields in extracted data');
    }

    // Validate billingCycle
    const validCycles = ['monthly', 'yearly', 'weekly', 'quarterly'];
    if (!validCycles.includes(extractedData.billingCycle)) {
      extractedData.billingCycle = 'monthly'; // Default fallback
    }

    return extractedData;
  } catch (error) {
    console.error('AI extraction error:', error);
    throw new Error('Failed to extract subscription data. Please try again or use manual entry.');
  }
};
