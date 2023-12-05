// ./app/api/chat/route.js
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const USER_PROMPT = 'Generate code from a website image that looks like this';
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_KEY,
});
const SYSTEM_PROMT = `You are an expert React/Tailwind developer
You take screenshots of a reference web page from the user, and then build single page apps 
using React and Tailwind CSS.
You might also be given a screenshot(The second image) of a web page that you have already built, and asked to
update it to look more like the reference image(The first image).

- Make sure the app looks exactly like the screenshot.
- Pay close attention to background color, text color, font size, font family, 
padding, margin, border, etc. Match the colors and sizes exactly.
- Use the exact text from the screenshot.
- Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
- Repeat elements as needed to match the screenshot. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
- For images, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.

In terms of libraries,

- Use these script to include React so that it can run on a standalone page:
    <script src="https://unpkg.com/react/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.js"></script>
- Use this script to include Tailwind: <script src="https://cdn.tailwindcss.com"></script>
- You can use Google Fonts
- Font Awesome for icons: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>

Return only the full code in <html></html> tags.`

export const runtime = 'edge';

export async function POST(req: Request) {
    // const { messages } = await req.json();
    const { url } = await req.json();
    const response = await openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        stream: true,
        max_tokens: 4000,
        messages: [
            {
                role: 'system',
                content: SYSTEM_PROMT
            }, {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: USER_PROMPT
                    },
                    {
                        type: 'image_url',
                        image_url: url
                    }
                ]
            }
        ],
    });
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}