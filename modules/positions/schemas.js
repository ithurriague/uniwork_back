import {z} from 'zod';

export const GetPositionsSchema = {
    query: z.object({
        limit: z
            .string()
            .transform((val) => parseInt(val, 10))
            .refine((num) => num > 0, {message: 'limit must be greater than 0'}),
        offset: z
            .string()
            .transform((val) => parseInt(val, 10)),
    }),
};

export const GetPositionByIDSchema = {
    params: z.object({
        id: z.uuid(),
    }),
};

export const CreatePositionSchema = {
    body: z.object({
        categories_id: z.number().int().positive(),
        name: z.string().trim().nonempty(),
        description: z.string().trim().nonempty().optional().default(null),
        pay: z.number().int().positive().optional().default(null),
        location: z.string().trim().nonempty().optional().default(null),
        is_remote: z.boolean().optional().default(null),
        skills: z.array(
            z.object({
                skills_id: z.number().int().positive(),
                // eslint-disable-next-line no-magic-numbers
                expertise: z.number().int().min(1).max(10),
                is_required: z.boolean(),
            })
        ).optional().default(null),
    }).superRefine((data, ctx) => {
        // Location
        if ((data.is_remote === false || data.is_remote === null) && (!data.location || !data.location.trim())) {
            ctx.addIssue({
                path: ['location'],
                message: 'location is required when the position is not remote',
            });
        }

        // Skill duplication
        const skills_ids = data.skills?.map(s => s.skills_id) ?? [];
        const duplicates = skills_ids.filter((id, i) => skills_ids.indexOf(id) !== i);
        if (duplicates.length) {
            ctx.addIssue({
                path: ['skills'],
                message: 'duplicate skills_id are not allowed',
            });
        }
    })
};

export const DeletePositionByIDSchema = {
    params: z.object({
        id: z.uuid(),
    }),
};

