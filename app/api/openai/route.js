import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
 
// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure your API key is set in environment variables
});
 
 
 
 
// Handle POST requests
export async function POST(request) {
  const { title, body } = await request.json();
 
  try {
    // Call OpenAI API to generate a task description
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: `Generate a task priority based on the body: "${body}". From the below categories
        Low Priority,
        Medium Priority,
        Hard Priority` },
      ],
    });
 
    const description = response.choices[0].message.content; // Extract the generated description
    return NextResponse.json({ description }); // Return the description in JSON format
  } catch (error) {
    console.error("Error generating description:", error);
    return NextResponse.json({ error: 'Failed to generate description' }, { status: 500 });
  }
}