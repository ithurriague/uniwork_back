import {z} from 'zod';

import {USER_TYPE} from '../../../../common/types/user_type.js';

export const GetUsersSchema = {
    query: z.object({
        user_type: z.enum(['organization', 'student']),
        limit: z
            .string()
            .transform((val) => parseInt(val, 10))
            .refine((num) => num > 0, {message: 'limit must be greater than 0'}),
        offset: z
            .string()
            .transform((val) => parseInt(val, 10)),
    }),
};

export const GetUserByIDSchema = {
    params: z.object({
        id: z.uuid(),
    }),
};

export const CreateUserSchema = {
    body: z.object({
        user_type: z.enum([USER_TYPE.ORGANIZATION, USER_TYPE.STUDENT]),
        university: z.string().min(1).optional().transform((val) => val ?? null),
        degree: z.string().min(1).optional().transform((val) => val ?? null),
    }).superRefine((data, ctx) => {
        if (data.user_type === USER_TYPE.STUDENT) {
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
        } else if (data.user_type === USER_TYPE.ORGANIZATION) {
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

export const DeleteUserByIDSchema = {
    params: z.object({
        id: z.uuid(),
    }),
};

