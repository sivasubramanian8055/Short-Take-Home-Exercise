import { Router, Request, Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import anthropic from "../lib/anthropic";

const router = Router();

const DEFAULT_SYSTEM =
  "You are a text analysis assistant. Analyze the user's input and call the format_response tool with a concise summary and exactly 3 key action items extracted directly from the text. Do not invent or infer anything not explicitly stated.";

router.post("/analyze", async (req: Request, res: Response) => {
  const { text, system } = req.body as { text: string; system?: string };

  if (!text || typeof text !== "string") {
    res.status(400).json({ error: "text is required" });
    return;
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: system ?? DEFAULT_SYSTEM,
          cache_control: { type: "ephemeral" },
        },
      ],
      tools: [
        {
          name: "format_response",
          description: "Format the analysis result with a summary and exactly 3 action items",
          input_schema: {
            type: "object",
            properties: {
              summary: {
                type: "string",
                description: "A concise 1-2 sentence summary of the input",
              },
              actionItems: {
                type: "array",
                description: "Exactly 3 key action items extracted from the input",
                items: { type: "string" },
                minItems: 3,
                maxItems: 3,
              },
            },
            required: ["summary", "actionItems"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "format_response" },
      messages: [{ role: "user", content: text }],
    });

    const toolBlock = message.content.find((b: Anthropic.ContentBlock) => b.type === "tool_use");
    if (!toolBlock || toolBlock.type !== "tool_use") {
      res.status(500).json({ error: "Unexpected response from Claude" });
      return;
    }

    const { summary, actionItems } = toolBlock.input as {
      summary: string;
      actionItems: string[];
    };

    res.json({ summary, actionItems });
  } catch (err) {
    const isApiError = err instanceof Anthropic.APIError;
    res.status(isApiError ? err.status ?? 500 : 500).json({
      error: isApiError ? err.message : "Internal server error",
    });
  }
});

export default router;
