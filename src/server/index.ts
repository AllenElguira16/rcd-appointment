import { router } from '~/rpc';
import { appointmentRouter } from './appointment';
import { userRouter } from './user';
import { announcementRouter } from './announcement';

export const appRouter = router({
  user: userRouter,
  appointment: appointmentRouter,
  announcement: announcementRouter,
});

export type AppRouter = typeof appRouter;
