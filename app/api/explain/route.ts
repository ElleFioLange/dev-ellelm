import { AnthropicStream, StreamingTextResponse } from "ai";
import contexts from "@/utils/keywords/contexts";
import relations from "@/utils/keywords/relations";
import Anthropic from "@anthropic-ai/sdk";
import { Keyword } from "@/utils/types/keywords";

export const runtime = "edge";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type Req = {
  keywords: string[];
};

export async function POST(req: Request) {
  try {
    const { keywords } = (await req.json()) as Req;

    // Put keywords in alphabetical order
    keywords.sort();

    const names = keywords.map(
      (item) =>
        // Lowercase here instead of pre-call to preserve casing when writing prompt
        item.toLowerCase() as string
    );

    // Get pairs that match relation contexts
    const pairs: [number, number][] = [];
    names.forEach((a, i) => {
      names.forEach((b, j) => {
        if (i !== j) {
          if (Object.keys(relations).includes(a + "_" + b)) {
            // Storing as indexes to access from keywords array to get original casing
            pairs.push([i, j]);
          }
        }
      });
    });

    let system = `A visitor to my personal portfolio website is interested in learning more about the following topics.
I've written some contextual info about each topic to help you formulate a response.
All of this info is written from my perspective, and your response should be as well.
Synthesize this information to create a response that is informative and engaging.
Match the the tone of the contextual info I've provided and formulate your response in a conversational way.
Just FYI, I use she/her pronouns.
You can use emojis sparingly, but make sure to stay professional (I am looking for a job, after all).`;

    names.forEach((name, i) => {
      const context = contexts[name as Keyword];

      // Using the original keyword to preserve casing
      const keyword = keywords[i];
      system += `\n\n${keyword}:${context}`;
    });

    if (pairs.length) {
      system += `\n\n`;
      system += `Some of the topics have interesting relationships, here's some info on those relationships:`;

      pairs.forEach(([i, j]) => {
        const kA = keywords[i];
        const kB = keywords[j];
        const nA = names[i];
        const nB = names[j];
        const context = relations[(nA + "_" + nB) as keyof typeof relations];

        system += `\n\n${kA} & ${kB}:${context}`;
      });
    }

    const response = await anthropic.messages.create({
      system,
      messages: [
        {
          role: "user",
          content: `Hi! Can you tell me a bit about these topics?
    ${keywords.join("\n")}`,
        },
      ],
      model: "claude-3-haiku-20240307",
      stream: true,
      max_tokens: 256 + 128 * (keywords.length + pairs.length),
    });

    const stream = AnthropicStream(response);

    return new StreamingTextResponse(stream, { status: 200 });
  } catch (e) {
    return Response.json(e, { status: 500 });
  }
}
