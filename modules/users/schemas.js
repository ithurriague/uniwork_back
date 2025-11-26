import {z} from 'zod';

export const GetUsersSchema = {
    query: z.object({
        user_type: z.enum(['organization', 'student']),
    }),
};

export const GetUserByIDSchema = {
    params: z.object({
        userID: z.uuid(),
    }),
    query: z.object({
        user_type: z.enum(['organization', 'student']),
    }),
};

export const CreateUserSchema = {
    body: z.object({
        user_type: z.enum(['organization', 'student']),
        university: z.string().min(1).optional().transform((val) => val ?? null),
        degree: z.string().min(1).optional().transform((val) => val ?? null),
    }).superRefine((data, ctx) => {
        if (data.user_type === 'student') {
            if (!data.university) {
                ctx.addIssue({
                    message: 'university is required for students',
                    path: ['university'],
                });
            }

            if (!data.degree) {
                ctx.addIssue({
                    message: 'degree is required for students',
                    path: ['degree'],
                });
            }
        } else if (data.user_type === 'organization') {
            if (data.university) {
                ctx.addIssue({
                    message: 'university must not be provided for organizations',
                    path: ['university'],
                });
            }
            if (data.degree) {
                ctx.addIssue({
                    message: 'degree must not be provided for organizations',
                    path: ['degree'],
                });
            }
        }
    })
};
