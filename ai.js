const { GoogleGenerativeAI } = require("@google/generative-ai");

async function getAIResponse(question) {
    if (typeof question !== "string" || question.trim() === "") {
        throw new Error("AI input must be a non-empty string");
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("AI API key not configured");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        // ⚠️ Use a model that ACTUALLY EXISTS
        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview"
        });

        const prompt =
            `Answer in ONLY one word.\nQuestion: ${question}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        if (!text) {
            throw new Error("No response from AI");
        }

        return text
            .trim()
            .split(/\s+/)[0]
            .replace(/[^\w]/g, "");

    } catch (error) {
        console.error("AI API Error:", error);
        throw new Error("AI processing failed");
    }
}

module.exports = { getAIResponse };
