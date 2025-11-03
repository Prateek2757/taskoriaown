"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Bot, Calculator, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuoteBreakdown {
  item: string;
  hours: number;
  rate: number;
}

interface Quote {
  estimatedHours: number;
  hourlyRate: number;
  total: number;
  breakdown: QuoteBreakdown[];
  confidence: number;
}

export function AIQuoteGenerator() {
  const [request, setRequest] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQuote = async () => {
    if (!request.trim()) return;

    setIsGenerating(true);
    setQuote(null);

    // Simulate AI processing delay
    setTimeout(() => {
      const estimatedHours = Math.floor(Math.random() * 20) + 5;
      const hourlyRate = Math.floor(Math.random() * 50) + 50;
      const total = estimatedHours * hourlyRate;

      setQuote({
        estimatedHours,
        hourlyRate,
        total,
        breakdown: [
          { item: "Initial consultation", hours: 2, rate: hourlyRate },
          {
            item: "Planning & design",
            hours: Math.floor(estimatedHours * 0.4),
            rate: hourlyRate,
          },
          {
            item: "Implementation",
            hours: Math.floor(estimatedHours * 0.6),
            rate: hourlyRate,
          },
        ],
        confidence: Math.floor(Math.random() * 20) + 80,
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          AI Quote Generator
        </CardTitle>
        <p className="text-sm text-gray-600">
          Describe your project and get an instant AI-powered estimate
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input */}
        <Textarea
          placeholder="Describe your project requirements in detail..."
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          rows={4}
        />

        {/* Action */}
        <Button
          onClick={generateQuote}
          disabled={!request.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Calculator className="w-4 h-4 mr-2" />
              </motion.div>
              Generating Quote...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Get AI Quote
            </>
          )}
        </Button>

        {/* Result */}
        <AnimatePresence mode="wait">
          {quote && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold">Estimated Quote</h4>
                      <Badge className="bg-blue-100 text-blue-800">
                        {quote.confidence}% confidence
                      </Badge>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-2">
                      {quote.breakdown.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.item} ({item.hours}h)
                          </span>
                          <span>${item.hours * item.rate}</span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total Estimate</span>
                      <span className="text-cyan-600">${quote.total}</span>
                    </div>

                    <p className="text-xs text-gray-500">
                      This is an AI-generated estimate. Final pricing may vary
                      based on specific requirements.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
