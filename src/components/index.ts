import dynamic from 'next/dynamic';

export * from './NavLink';
export * from './Alert';
export * from './Appointment';
// eslint-disable-next-line import/no-cycle
export * from './Announcement';
export const MapInput = dynamic(() => import('./MapInput'), {
  ssr: false,
});
export const MapAnnouncement = dynamic(() => import('./MapAnnouncement'), {
  ssr: false,
});
export * from './EditModal';
