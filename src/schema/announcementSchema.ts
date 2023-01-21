import { z } from 'zod';

export const announcementSchema = z
  .object({
    title: z.string().min(2),
    address: z.string().min(2),
    date: z.string(),
    lat: z.number(),
    lng: z.number(),
  })
  .required();
