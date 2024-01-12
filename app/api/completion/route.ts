import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  // // Set CORS headers
  // const headers = new Headers();
  // headers.set("Access-Control-Allow-Origin", "*"); // Allows requests from any origin
  // headers.set("Access-Control-Allow-Methods", "POST, OPTIONS"); // Specifies the allowed methods
  // headers.set("Access-Control-Allow-Headers", "Content-Type"); // Specifies the allowed headers

  // // Handle preflight request for CORS
  // if (req.method === "OPTIONS") {
  //   return new Response(null, { status: 204, headers }); // 204 No Content
  // }
  const { prompt } = await req.json();

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    stream: true,
    temperature: 0.6,
    prompt: `You are a chatbot helping human with their questions. 
    Help them ask the best questions by completing this input ${prompt}.`,
  });
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  // Respond with the stream and include the CORS headers
  return new StreamingTextResponse(stream);
}
