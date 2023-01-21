import { procedure, router } from '~/rpc';
import { announcementSchema } from '~/schema';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

export const announcementRouter = router({
  setAnnouncement: procedure(true)
    .input(announcementSchema)
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      await prisma.announcement.create({
        data: {
          title: input.title,
          address: input.address,
          date: new Date(input.date),
          lat: input.lat,
          lng: input.lng,
        },
      });

      return {
        status: true,
        message: 'Appointment created~!',
      };
    }),
  updateAppointment: procedure(true)
    .input(z.intersection(announcementSchema, z.object({ id: z.string() })))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      await prisma.announcement.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          address: input.address,
          date: new Date(input.date),
          lat: input.lat,
          lng: input.lng,
        },
      });

      return {
        status: true,
        message: 'Appointment created~!',
      };
    }),
  getAnnouncement: procedure(true).query(async ({ ctx }) => {
    if (!ctx.session.user)
      return {
        status: false,
        message: 'You have no access, please login first',
      };

    return {
      status: true,
      announcements: await prisma.announcement.findMany(),
    };
  }),
  deleteAnnouncement: procedure(true)
    .input(z.string())
    .mutation(async ({ ctx, input: announcementID }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      await prisma.announcement.delete({
        where: { id: announcementID },
      });

      return {
        status: true,
        message: 'successfully deleted~!',
      };
    }),
});
