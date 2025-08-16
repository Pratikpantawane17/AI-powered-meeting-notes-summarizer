const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_KEY });

const generateAiResponse = async (inputPrompt) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: inputPrompt }]
      }
    ]
  });


  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response text found";

  return text;
};


module.exports = {
  generateAiResponse,
};
