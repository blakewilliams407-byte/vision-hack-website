'use server';
/**
 * @fileOverview A Genkit flow for generating captivating event vibe descriptions.
 *
 * - generateVibeDescription - A function that handles the vibe description generation process.
 * - GenerateVibeDescriptionInput - The input type for the generateVibeDescription function.
 * - GenerateVibeDescriptionOutput - The return type for the generateVibeDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateVibeDescriptionInputSchema = z.object({
  eventName: z.string().describe('The name of the event.'),
  eventDate: z.string().describe('The date of the event (e.g., "October 26, 2024").'),
  eventTime: z.string().describe('The time of the event (e.g., "8:00 PM EST").'),
  eventVenue: z.string().describe('The venue where the event will take place.'),
  vibeKeywords: z.array(z.string()).optional().describe('Keywords or phrases describing the desired vibe (e.g., "energetic", "chill", "exclusive", "retro").'),
});
export type GenerateVibeDescriptionInput = z.infer<typeof GenerateVibeDescriptionInputSchema>;

const GenerateVibeDescriptionOutputSchema = z.object({
  description: z.string().describe('A captivating and creative description of the event vibe.'),
});
export type GenerateVibeDescriptionOutput = z.infer<typeof GenerateVibeDescriptionOutputSchema>;

export async function generateVibeDescription(input: GenerateVibeDescriptionInput): Promise<GenerateVibeDescriptionOutput> {
  return generateVibeDescriptionFlow(input);
}

const generateVibeDescriptionPrompt = ai.definePrompt({
  name: 'generateVibeDescriptionPrompt',
  input: { schema: GenerateVibeDescriptionInputSchema },
  output: { schema: GenerateVibeDescriptionOutputSchema },
  prompt: `You are an expert event promoter and copywriter. Your goal is to create a short, captivating, and creative "vibe description" for a party or event. This description should be bold, hype, and set the right expectations for potential guests.

Here are the event details:
Event Name: {{{eventName}}}
Date: {{{eventDate}}}
Time: {{{eventTime}}}
Venue: {{{eventVenue}}}

{{#if vibeKeywords}}
The host has provided the following keywords to describe the desired vibe: {{#each vibeKeywords}} "{{this}}"{{#unless @last}},{{/unless}}{{/each}}.
{{/if}}

Generate a vibe description that is between 50 and 150 words, focusing on excitement, exclusivity, and the unique atmosphere of the event. Do not use generic phrases. Emphasize the experience.
`,
});

const generateVibeDescriptionFlow = ai.defineFlow(
  {
    name: 'generateVibeDescriptionFlow',
    inputSchema: GenerateVibeDescriptionInputSchema,
    outputSchema: GenerateVibeDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await generateVibeDescriptionPrompt(input);
    return output!;
  }
);
