import { z } from 'zod';

export const appointmentSchema = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    middleName: z.string().min(2),
    address: z.string(),
    email: z.string(),
    contactNumber: z.string(),
    gender: z.string(),
  })
  .required();
