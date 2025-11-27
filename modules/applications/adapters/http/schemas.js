import {z} from 'zod';

import {APPLICATION_STATUS} from '../../../../common/types/application_status.js';

export const GetApplicationsSchema = {
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

export const GetApplicationsByIDSchema = {
    params: z.object({
        id: z.uuid(),
    }),
};

export const CreateApplicationsSchema = {
    body: z.object({
        positions_id: z.uuid(),
    })
};

export const UpdateApplicationsSchema = {
    body: z.object({
        positions_id: z.uuid(),
        status: z.enum([APPLICATION_STATUS.PENDING, APPLICATION_STATUS.REJECTED, APPLICATION_STATUS.ACCEPTED, APPLICATION_STATUS.EXPIRED]),
    })
};

export const DeleteApplicationsByIDSchema = {
    params: z.object({
        id: z.uuid(),
    }),
};

