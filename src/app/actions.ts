'use server';

import { generateVibeDescription } from '@/ai/flows/generate-vibe-description';
import { z } from 'zod';

const VibeSchema = z.object({
    eventName: z.string().min(1, 'Event name is required.'),
    eventDate: z.string().min(1, 'Event date is required.'),
    eventTime: z.string().min(1, 'Event time is required.'),
    eventVenue: z.string().min(1, 'Event venue is required.'),
    vibeKeywords: z.string(),
});

export type VibeGenerationState = {
    message: string | null;
    description: string | null;
    errors?: {
        [key:string]: string[] | undefined
    }
};

export async function createVibeDescription(
    prevState: VibeGenerationState,
    formData: FormData
): Promise<VibeGenerationState> {
    const validatedFields = VibeSchema.safeParse({
        eventName: formData.get('eventName'),
        eventDate: formData.get('eventDate'),
        eventTime: formData.get('eventTime'),
        eventVenue: formData.get('eventVenue'),
        vibeKeywords: formData.get('vibeKeywords'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Invalid form data.',
            description: null,
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const { eventName, eventDate, eventTime, eventVenue, vibeKeywords } = validatedFields.data;
        const keywordsArray = vibeKeywords.split(',').map(k => k.trim()).filter(Boolean);

        const result = await generateVibeDescription({
            eventName,
            eventDate,
            eventTime,
            eventVenue,
            vibeKeywords: keywordsArray,
        });

        return {
            message: 'Description generated successfully.',
            description: result.description,
        };

    } catch (error) {
        console.error(error);
        return {
            message: 'An unexpected error occurred. Failed to generate description.',
            description: null,
        };
    }
}
