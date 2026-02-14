import { GoogleGenerativeAI } from "@google/generative-ai";

const PRIMARY_MODEL = "gemini-3-flash-preview"; 
const FALLBACK_MODEL = "gemini-2.5-pro";
const LAST_RESORT_MODEL = "gemini-2.0-flash-lite"; 

export async function generateWithFallback(
  genAI: GoogleGenerativeAI, 
  prompt: any, 
  systemInstruction?: string
) {
  // Helper to try a model
  const tryModel = async (modelName: string) => {
      console.log(`Trying Model: ${modelName}`);
      const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: systemInstruction 
      });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
  };

  try {
    return await tryModel(PRIMARY_MODEL);
  } catch (error: any) {
    if (isRetryableError(error)) {
        console.warn(`Primary model (${PRIMARY_MODEL}) failed (${error.status}). Switching to Fallback: ${FALLBACK_MODEL}`);
        
        try {
            return await tryModel(FALLBACK_MODEL);
        } catch (fallbackError: any) {
             if (isRetryableError(fallbackError)) {
                 console.warn(`Fallback model (${FALLBACK_MODEL}) failed (${fallbackError.status}). Switching to Last Resort: ${LAST_RESORT_MODEL}`);
                 try {
                     return await tryModel(LAST_RESORT_MODEL);
                 } catch (lastError) {
                     console.error("All models failed.", lastError);
                     throw lastError;
                 }
             }
             throw fallbackError;
        }
    }
    throw error; 
  }
}

function isRetryableError(error: any) {
    return error.message?.includes("503") || error.message?.includes("429") || error.message?.includes("404") || 
           error.status === 503 || error.status === 429 || error.status === 404;
}
