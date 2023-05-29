import { procedure, router } from '~/rpc';
import { appointmentSchema } from '~/schema';
import { AppointmentEnum, PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { AppointmentForm } from '~/types';

const prisma = new PrismaClient();

export const appointmentRouter = router({
  setAppointment: procedure(true)
    .input((val: unknown) => {
      if (typeof val === 'object') {
        const appointmentForm = val as AppointmentForm;

        if (appointmentSchema) return appointmentForm;
        throw new Error(`Invalid input: ${typeof appointmentForm}`);
      }
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      const { appointmentType: type, ...info } = input;

      await prisma.appointment.create({
        data: {
          info,
          type,
          userId: ctx.session.user.id,
        },
      });
      return {
        status: true,
        message: 'Appointment created~!',
      };
    }),
  updateAppointment: procedure(true)
    .input((val: unknown) => {
      if (typeof val === 'object') {
        const appointmentForm = val as AppointmentForm & {
          appointmentId: string;
        };

        if (appointmentSchema) return appointmentForm;
        throw new Error(`Invalid input: ${typeof appointmentForm}`);
      }
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .mutation(async ({ input, ctx }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      const { appointmentType: type, appointmentId, ...info } = input;

      await prisma.appointment.update({
        where: {
          id: appointmentId,
        },
        data: {
          info,
          type,
          userId: ctx.session.user.id,
        },
      });

      return {
        status: true,
        message: 'Appointment updated~!',
      };
    }),
  setAsApproved: procedure(true)
    .input(z.string())
    .mutation(async ({ ctx, input: id }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      await prisma.appointment.update({
        where: {
          id,
        },
        data: {
          approved: true,
        },
      });
      return {
        status: true,
        message: 'Appointment updated~!',
      };
    }),
  getUserAppointment: procedure(true).query(async ({ ctx }) => {
    if (!ctx.session.user)
      return {
        status: false,
        message: 'You have no access, please login first',
      };

    return {
      status: true,
      appointments: await prisma.appointment.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          user: true,
          info: true,
          type: true,
          createdAt: true,
          id: true,
          approved: true,
        },
      }),
    };
  }),
  getAll: procedure(true)
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      return prisma.appointment.findMany({
        where: {
          type: input
            ? (input.toLocaleUpperCase() as AppointmentEnum)
            : undefined,
        },
        select: {
          user: true,
          info: true,
          type: true,
          createdAt: true,
          id: true,
          approved: true,
        },
      });
    }),
  getAllByBlood: procedure(true)
    .input(z.string().optional())
    .query(async ({ ctx, input }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      return {
        status: true,
        appointments: await prisma.appointment.findMany({
          where: input
            ? {
                info: {
                  path: ['bloodType'],
                  equals: input,
                },
              }
            : undefined,
          select: {
            user: true,
            info: true,
            type: true,
            createdAt: true,
            id: true,
            approved: true,
          },
        }),
      };
    }),
  delete: procedure(true)
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user)
        return {
          status: false,
          message: 'You have no access, please login first',
        };

      await prisma.appointment.delete({
        where: {
          id: input,
        },
      });
      return {
        status: true,
        message: 'Appointment Deleted!',
      };
    }),
});
