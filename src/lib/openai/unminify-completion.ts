import OpenAI from  "openai";
import { OPENAI_API_KEY } from "$env/static/private";
import { error } from "@sveltejs/kit";

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
})

export const unminifyCompletion = async (code: string) => {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: "You are a helpful code assistant that specializes in unminifying code. Your specialty is replacing variable names with meaningful names. the code you minify will contain GTM style variable names (\"{{var1}}\", \"{{var2}}\", etc.). Leave those as is.",
        },
        {
            role: "user",
            content: "Please unminify the following code:\n---\n" + code,
        }
    ]

    const model = "gpt-3.5-turbo";

    const res = await openai.chat.completions.create({
        messages,
        model,
    });

    const resContent = res.choices[0].message.content;

    if (!resContent) {
        error(500, "Internal server error");
    }

    const codeMatch = resContent.match(/```.*\n([^]+)```/);

    if (!codeMatch) {
        error(500, "Internal server error");
    }

    return codeMatch[1];
};
