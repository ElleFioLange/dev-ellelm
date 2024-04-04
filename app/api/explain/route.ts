import OpenAI from "openai";
import { AnthropicStream, OpenAIStream, StreamingTextResponse } from "ai";
import keywords from "@/utils/keywords";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "edge";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type Req = {
  selected: string[];
};

export async function POST(req: Request) {
  try {
    const { selected } = (await req.json()) as Req;

    const contexts = selected.map(
      (item) => keywords[item.toLowerCase() as "developer"]
    );

    // const openai = new OpenAI();

    // const response = await openai.chat.completions.create({
    //   model: "gpt-3.5-turbo",
    //   stream: true,
    //   messages: [
    //     {
    //       role: "user",
    //       content: "Give me a 500 word report on the phoenician empire.",
    //     },
    //   ],
    // });

    // const stream = OpenAIStream(response);

    const response = await anthropic.messages.create({
      messages: [
        {
          role: "user",
          content: "Give me a 500 word report on the phoenician empire.",
        },
      ],
      model: "claude-3-haiku-20240307",
      stream: true,
      max_tokens: 1024,
    });

    const stream = AnthropicStream(response);

    return new StreamingTextResponse(stream, { status: 200 });
  } catch (e) {
    return Response.json(e, { status: 500 });
  }
}
