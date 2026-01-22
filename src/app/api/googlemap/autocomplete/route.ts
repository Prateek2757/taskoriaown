import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await axios.post(
    "https://places.googleapis.com/v1/places:autocomplete",
    ({
      input: body.input,
      sessionToken: body.session,
      includedRegionCodes: ["AU"],
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        "X-Goog-FieldMask":
          "suggestions.placePrediction.placeId,suggestions.placePrediction.text,suggestions.placePrediction.structuredFormat",
      }
    }
  );

  const data = await res.data;

  if (data.suggestions) {
    data.suggestions = data.suggestions.map((suggestion: any) => {
      const prediction = suggestion.placePrediction;
      
      if (prediction.structuredFormat) {
        const mainText = prediction.structuredFormat.mainText?.text || "";
        const secondaryText = prediction.structuredFormat.secondaryText?.text || "";
        
        let displayText = mainText;
        if (secondaryText) {
          const cleanSecondary = secondaryText.replace(/,?\s*Australia$/i, "").trim();
          if (cleanSecondary) {
            displayText = `${mainText}, ${cleanSecondary}`;
          }
        }
        
        return {
          placePrediction: {
            placeId: prediction.placeId,
            text: {
              text: displayText,
            },
            originalText: prediction.text?.text || displayText,
          },
        };
      }
      
      const originalText = prediction.text?.text || "";
      const cleanedText = originalText.replace(/,?\s*Australia$/i, "").trim();
      
      return {
        placePrediction: {
          placeId: prediction.placeId,
          text: {
            text: cleanedText,
          },
          originalText: originalText,
        },
      };
    });
  }


  return NextResponse.json(data);
}