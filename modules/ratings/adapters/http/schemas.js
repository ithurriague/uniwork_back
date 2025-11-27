import {z} from 'zod';

export const GetRatingsSchema = {
    query: z.object({
        limit: z
            .string()
            .transform((val) => parseInt(val, 10))
            .refine((num) => num > 0, {message: 'limit must be greater than 0'}),
        offset: z
            .string()
            .transform((val) => parseInt(val, 10)),
        applications_id: z.uuid().optional().default(null),
    }),
};

export const GetRatingsByIDSchema = {
    params: z.object({
        id: z.uuid(),
    }),
};

export const CreateRatingsSchema = {
    body: z.object({
        ratee_id: z.uuid(),
        applications_id: z.uuid(),
        // eslint-disable-next-line no-magic-numbers
        stars: z.float32().min(0.5).multipleOf(0.5).max(5),
        review: z.string().nonempty().optional().default(null),
    })
};
