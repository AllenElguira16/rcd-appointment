import type { Appointment } from '@prisma/client';

export type AppointmentForm = {
  appointmentType: Appointment['type'];
  bloodType: string;
  firstName: string;
  lastName: string;
  middleName: string;
  address: string;
  email: string;
  contactNumber: string;
  gender: string;
};
