import { GoogleGenerativeAI } from "@google/generative-ai";

// Reverting to 2.0/1.5 series as 3.0 proved unavailable (404)
const PRIMARY_MODEL = "gemini-3-flash-preview"; 
const FALLBACK_MODEL = "gemini-2.5-pro";

export async function generateWithFallback(
  genAI: GoogleGenerativeAI, 
  prompt: any, 
  systemInstruction?: string
) {
  try {
    // Try Primary Model
    console.log(`Using Primary Model: ${PRIMARY_MODEL}`);
    const model = genAI.getGenerativeModel({ 
        model: PRIMARY_MODEL,
        systemInstruction: systemInstruction 
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    // Check for Service Unavailable (503), Too Many Requests (429), or Not Found (404 - e.g. model deprecation/unavailability)
    if (error.message?.includes("503") || error.message?.includes("429") || error.message?.includes("404") || 
        error.status === 503 || error.status === 429 || error.status === 404) {
        
        console.warn(`Primary model failed (${error.status || 'Unknown'}). Switching to Fallback: ${FALLBACK_MODEL}`);
        
        try {
            const fallbackModel = genAI.getGenerativeModel({ 
                model: FALLBACK_MODEL,
                systemInstruction: systemInstruction
            });
            const result = await fallbackModel.generateContent(prompt);
            const response = await result.response;
            return response.text();
            
        } catch (fallbackError) {
            console.error("Fallback model also failed:", fallbackError);
            throw fallbackError; // If both fail, throw original or new error
        }
    }
    
    throw error; // Rethrow other errors
  }
}
