import { NextRequest, NextResponse } from "next/server";
import { TASKORIA_SYSTEM_PROMPT } from "./systemPrompt";

const ipCache = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 60; // max requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "127.0.0.1";
}

// Request validation helper
function validateMessages(messages: any): boolean {
  if (!Array.isArray(messages)) return false;
  for (const m of messages) {
    if (typeof m !== "object" || m === null) return false;
    if (m.role !== "user" && m.role !== "assistant" && m.role !== "system") return false;
    if (typeof m.content !== "string") return false;
  }
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Basic Rate Limiting
    const ip = getClientIp(req);
    const now = Date.now();
    const clientData = ipCache.get(ip) || { count: 0, lastReset: now };

    if (now - clientData.lastReset > RATE_LIMIT_WINDOW) {
      clientData.count = 1;
      clientData.lastReset = now;
      ipCache.set(ip, clientData);
    } else {
      clientData.count += 1;
      ipCache.set(ip, clientData);
      if (clientData.count > RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "Too many requests. Please try again in a minute." },
          { status: 429 }
        );
      }
    }

    // 2. Request Validation
    const body = await req.json().catch(() => null);
    if (!body || !body.messages) {
      return NextResponse.json(
        { error: "Bad Request. Message history is required." },
        { status: 400 }
      );
    }

    const { messages } = body;
    if (!validateMessages(messages)) {
      return NextResponse.json(
        { error: "Bad Request. Messages format is invalid." },
        { status: 400 }
      );
    }

    // 3. Check for API key and handle fallback if missing
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not set. Using rule-based fallback response.");
      const lastUserMessageObj = [...messages].reverse().find((m) => m.role === "user");
      const userText = lastUserMessageObj ? lastUserMessageObj.content.toLowerCase() : "";

      let intent = "general";
      let text = "Hi, I'm Taskoria Assistant. I can help you post a job, find a provider, or join as a professional. Feel free to ask any questions!";
      let extractedData: any = {};

      // Simple mock parser rules to test flow transitions
      if (
        userText.includes("safety") ||
        userText.includes("trust") ||
        userText.includes("verify") ||
        userText.includes("licensed") ||
        userText.includes("insurance") ||
        userText.includes("legit") ||
        userText.includes("abn")
      ) {
        intent = "trust_safety";
        text = "Taskoria helps you get free quotes from trusted local professionals across Australia. Providers may be checked through identity verification, ABN validation, licence verification, and insurance validation where relevant. For licensed trades, please confirm licence, insurance, and scope before hiring.";
      } else if (
        userText.includes("price") ||
        userText.includes("cost") ||
        userText.includes("how much") ||
        userText.includes("charge") ||
        userText.includes("support") ||
        userText.includes("contact") ||
        userText.includes("email") ||
        userText.includes("phone") ||
        userText.includes("call")
      ) {
        intent = "pricing_support";
        text = "Posting a job on Taskoria is completely free! Service providers will quote for your job, allowing you to compare and choose. Taskoria can help you receive responses from relevant local professionals, but availability and pricing depend on provider responses. For urgent or support issues, feel free to email contact@taskoria.com or call 1300 531 727.";
      } else if (
        userText.includes("post") ||
        userText.includes("cleaner") ||
        userText.includes("plumber") ||
        userText.includes("gardener") ||
        userText.includes("electrician") ||
        userText.includes("removalist") ||
        userText.includes("accountant") ||
        userText.includes("builder") ||
        userText.includes("photographer") ||
        userText.includes("hire") ||
        userText.includes("need a service") ||
        userText.includes("find a pro")
      ) {
        intent = "post_job";
        text = "Sure! Let's get you set up to post a job. I will guide you through a few quick questions to collect your job details.";
        
        // Try to extract category
        const cats = ["cleaner", "plumber", "gardener", "electrician", "removalist", "accountant", "builder", "photographer"];
        for (const cat of cats) {
          if (userText.includes(cat)) {
            extractedData.service = cat;
            break;
          }
        }
      } else if (
        userText.includes("join") ||
        userText.includes("provider") ||
        userText.includes("register") ||
        userText.includes("sign up as") ||
        userText.includes("be a pro") ||
        userText.includes("list my business")
      ) {
        intent = "join_provider";
        text = "Excellent! Let's get your professional profile started on Taskoria so you can receive job opportunities. I'll ask you a few quick questions about your business.";
      }

      return NextResponse.json({ text, intent, extractedData });
    }

    // 4. Transform conversation history to Gemini format
    // Map roles: 'user' -> 'user', 'assistant' -> 'model'
    // Exclude 'system' role messages from contents as we pass the system instruction separately
    const geminiContents = messages
      .filter((m: any) => m.role !== "system")
      .map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

    // 5. Call Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: geminiContents,
        systemInstruction: {
          parts: [{ text: TASKORIA_SYSTEM_PROMPT }]
        },
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini API call failed:", errText);
      return NextResponse.json(
        { text: "I'm having trouble connecting to my brain right now. Taskoria can help you receive responses from relevant local professionals, but availability and pricing depend on provider responses. For urgent help, contact us at contact@taskoria.com.", intent: "general" },
        { status: 200 } // Return status 200 so the user gets a fallback response in the widget instead of breaking the UI
      );
    }

    const geminiData = await geminiResponse.json();
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return NextResponse.json({
        text: "I received an empty response. Taskoria can help you receive responses from relevant local professionals, but availability and pricing depend on provider responses.",
        intent: "general"
      });
    }

    // 6. Safe parsing of response
    try {
      const parsedJson = JSON.parse(generatedText.trim());
      return NextResponse.json(parsedJson);
    } catch (parseError) {
      console.error("Failed to parse Gemini output as JSON. Raw output:", generatedText);
      // Compliance check for text fallbacks
      let textResponse = generatedText;
      if (!textResponse.includes("confirm licence, insurance")) {
        textResponse += "\n\nFor licensed trades, please confirm licence, insurance, and scope before hiring.";
      }
      return NextResponse.json({
        text: textResponse,
        intent: "general"
      });
    }
  } catch (globalError: any) {
    console.error("Internal Server Error in chat route:", globalError);
    return NextResponse.json(
      { text: "An unexpected error occurred. Please contact us at contact@taskoria.com or call 1300 531 727 for support.", intent: "general" },
      { status: 500 }
    );
  }
}
