import { NextRequest, NextResponse } from "next/server";
import { getOrCreateSession, resetSession, simulateTurn } from "../../../sandboxEngine";
import { ChatRequest, ChatResponse } from "../../../types";

export async function POST(req: NextRequest): Promise<NextResponse<ChatResponse | { error: string }>> {
  try {
    const body = (await req.json()) as Partial<ChatRequest>;

    if (!body.sessionId || !body.userMessage || !body.defenses || !body.mode) {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    let state = getOrCreateSession(body.sessionId);
    if (body.reset) {
      state = resetSession(body.sessionId);
    }

    state.security_profile = body.mode;
    state.defenses_enabled = body.defenses;

    const result = simulateTurn(body.userMessage, state);

    return NextResponse.json({
      assistantMessage: result.assistantMessage,
      telemetry: result.telemetry
    });
  } catch {
    return NextResponse.json(
      {
        error: "Safe sandbox error. Request could not be processed."
      },
      { status: 500 }
    );
  }
}
