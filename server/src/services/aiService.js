import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the server root directory
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

console.log(
  "GEMINI_API_KEY loaded:",
  process.env.GEMINI_API_KEY ? "Yes" : "No"
);
console.log("API Key length:", process.env.GEMINI_API_KEY?.length);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const extractSubscriptionData = async (userInput) => {
  try {
    console.log(
      "Starting AI extraction with input:",
      userInput.substring(0, 50) + "..."
    );
    console.log("API Key available:", !!process.env.GEMINI_API_KEY);

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not found in environment variables");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a subscription data extraction assistant. Extract subscription information from the user's natural language input and return ONLY a valid JSON object with these exact fields:

{
  "serviceName": "string (name of the service)",
  "price": number (numeric value only, no currency symbols),
  "billingCycle": "string (must be one of: monthly, yearly, weekly, quarterly)",
  "renewalDate": "string (ISO date format YYYY-MM-DD)",
  "paymentMethod": "string (optional, payment method description )",
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

    console.log("=== GEMINI RAW RESPONSE ===");
    console.log(text);
    console.log("=========================");

    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/g, "");
    }

    // Parse the JSON
    const extractedData = JSON.parse(cleanedText);

    console.log("=== PARSED JSON DATA ===");
    console.log(JSON.stringify(extractedData, null, 2));
    console.log("========================");

    // Validate required fields
    if (
      !extractedData.serviceName ||
      !extractedData.price ||
      !extractedData.billingCycle ||
      !extractedData.renewalDate
    ) {
      throw new Error("Missing required fields in extracted data");
    }

    // Validate billingCycle
    const validCycles = ["monthly", "yearly", "weekly", "quarterly"];
    if (!validCycles.includes(extractedData.billingCycle)) {
      extractedData.billingCycle = "monthly"; // Default fallback
    }

    return extractedData;
  } catch (error) {
    console.error("AI extraction error:", error);
    console.error("Error details:", {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
    });
    throw new Error(`AI Error: ${error.message}`);
  }
};
