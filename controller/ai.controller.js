import { GoogleGenAI } from "@google/genai";
import File from "../model/file.model.js";
import dotenv from "dotenv";

dotenv.config();

export const getFileSummary = async (req, res) => {
  const fileId = req.params.fileId;

  if (!fileId) {
    return res.status(400).json({
      success: false,
      message: "File ID is required",
    });
  }

  try {
    const file = await File.findById(fileId).lean();

    if (!file || !file.fileUrl) {
      return res.status(404).json({
        success: false,
        message: "File not found or missing file URL",
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const pdfResponse = await fetch(file.fileUrl);
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();

    const contents = [
      {
        text: `
You are an expert educational assistant helping students understand academic materials.

Please analyze this document and provide a comprehensive summary suitable for student learning.

Focus on:
- Key concepts and main ideas
- Important facts and data
- Study-relevant information
- Clear, educational explanations

Return a JSON object with only the following structure:
{
  "summary": "A 3-5 sentence concise summary suitable for students",
  "keyConcepts": ["Concept 1", "Concept 2", "Concept 3", "Concept 4", "Concept 5"],
  "studyTips": ["Tip 1", "Tip 2", "Tip 3"],
  "difficultyLevel": "Beginner|Intermediate|Advanced",
  "estimatedStudyTime": "X hours"
}

Output must be valid JSON only. No additional text or commentary.
`,
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: Buffer.from(pdfArrayBuffer).toString("base64"),
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents,
    });

    let outputText = response.response?.text || response.text || "";

    outputText = outputText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

    let parsedJson;
    try {
      parsedJson = JSON.parse(outputText);
    } catch (e) {
      console.error("Failed to parse Gemini output as JSON:", outputText);
      return res.status(500).json({ success: false, message: "AI response was not valid JSON", rawOutput: outputText });
    }

    return res.status(200).json({ success: true, summary: parsedJson, file: file });
  } catch (err) {
    console.error("Gemini Summary Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate document summary",
      error: err.message,
    });
  }
};

export const getFileQuiz = async (req, res) => {
  const fileId = req.params.fileId;

  if (!fileId) {
    return res.status(400).json({
      success: false,
      message: "File ID is required",
    });
  }

  try {
    const file = await File.findById(fileId).lean();

    if (!file || !file.fileUrl) {
      return res.status(404).json({
        success: false,
        message: "File not found or missing file URL",
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const pdfResponse = await fetch(file.fileUrl);
    const pdfArrayBuffer = await pdfResponse.arrayBuffer();

    const contents = [
      {
        text: `
You are a professional educational quiz generator. Analyze this academic document and create a multiple-choice quiz
to help students test their understanding of the material.

Instructions:
- Generate **10 questions** only.
- Each question must have **4 answer options (A, B, C, D)**.
- Include the **correct answer** key for each question.
- Questions should test comprehension, not just memorization.

Return only a valid JSON object in the following structure:
{
  "quizTitle": "Title based on the document topic",
  "difficultyLevel": "Beginner|Intermediate|Advanced",
  "questions": [
    {
      "question": "Question text",
      "options": {
        "A": "Option 1",
        "B": "Option 2",
        "C": "Option 3",
        "D": "Option 4"
      },
      "correctAnswer": "A"
    }
  ]
}

Output must be **valid JSON only**, no extra text or formatting.
`,
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: Buffer.from(pdfArrayBuffer).toString("base64"),
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents,
    });

    let outputText = response.response?.text || response.text || "";

    outputText = outputText.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();

    let parsedJson;
    try {
      parsedJson = JSON.parse(outputText);
    } catch (e) {
      console.error("Failed to parse Gemini output as JSON:", outputText);
      return res.status(500).json({
        success: false,
        message: "AI response was not valid JSON",
        rawOutput: outputText,
      });
    }

    return res.status(200).json({
      success: true,
      quiz: parsedJson,
      file: file,
    });
  } catch (err) {
    console.error("Gemini Quiz Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate quiz from document",
      error: err.message,
    });
  }
};
