import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
    apiKey: process.env.api_key,
});

export async function POST(req) {
    const { muscle } = await req.json();  

    console.log(`Received muscle: ${muscle}`);

    const { object: generatedWorkout } = await generateObject({
        model: google('gemini-1.5-flash'),
        schema: z.object({
            workout: z.object({
                name: z.array(z.object({ name: z.string()})),
                sets: z.number(),

            }),
        }),
        prompt: `Generate a workout for ${muscle} muscle.`,
    });

    console.log("Generated workout:", generatedWorkout);  
    return new Response(JSON.stringify(generatedWorkout), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
}
