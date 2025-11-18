import { NextRequest, NextResponse } from "next/server";
import { generateMockAIResponse } from "@/lib/mock/ai-responses";

export async function POST(request: NextRequest) {
  try {
    const { message, provider = "claude" } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check if in mock mode
    const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

    if (isMockMode) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = generateMockAIResponse(message);
      return NextResponse.json({
        response,
        provider,
        mock: true,
      });
    }

    // Real API implementation would go here
    return NextResponse.json(
      { error: "Real API not implemented. Enable mock mode." },
      { status: 501 }
    );
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
