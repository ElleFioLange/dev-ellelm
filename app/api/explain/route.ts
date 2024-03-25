import OpenAI from "openai";
import keywords from "@/utils/constants/keywords";
import { OpenAIStream, StreamingTextResponse } from "ai";

export type Req = {
  selected: string[];
};

export async function POST(req: Request) {
  try {
    const { selected } = (await req.json()) as Req;

    const contexts = selected.map(
      (item) => keywords[item.toLowerCase() as "developer"]
    );

    const openai = new OpenAI();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "user",
          content: "Give me a 500 word report on the phoenician empire.",
        },
      ],
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream, { status: 200 });
  } catch (e) {
    return Response.json(e, { status: 500 });
  }
}
