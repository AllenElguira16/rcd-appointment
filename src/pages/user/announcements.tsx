import {
  Announcement,
  AnnouncementFormInput,
  MapAnnouncement,
} from '~/components';
import { useDomReady } from '~/hooks';
import { UserLayout } from '~/layouts';
import { alertState } from '~/state';
import { AnnouncementForm } from '~/types';
import { formatDate, trpc } from '~/utils';
import { SubmitHandler } from 'react-hook-form';
import { Portal } from 'react-portal';
import { useSetRecoilState } from 'recoil';
import { nanoid } from 'nanoid';
import { LatLng } from 'leaflet';

const announcementFormInput: AnnouncementFormInput[] = [
  {
    id: 'title',
    name: 'title',
    label: 'Title',
    placeholder: 'Red Cross',
  },
  {
    id: 'address',
    name: 'address',
    label: 'Address',
    placeholder: 'Address',
  },
];

function MapModal() {
  const { data } = trpc.announcement.getAnnouncement.useQuery();

  if (!data || !data.announcements) return null;

  const { announcements } = data;

  return (
    <>
      <div className="card-title">
        <h2>Map Announcement</h2>
      </div>
      <MapAnnouncement announcements={announcements} />
    </>
  );
}

function AnnouncementModal({
  id,
  readonly,
  announcement,
  position,
}: AnnouncementModalProps) {
  const { refetch } = trpc.announcement.getAnnouncement.useQuery(undefined, {
    enabled: false,
  });
  const setAnnouncement = trpc.announcement.setAnnouncement.useMutation();
  const updateAnnouncement = trpc.announcement.updateAppointment.useMutation();
  const setAlert = useSetRecoilState(alertState);

  const defaultValues: AnnouncementForm = {
    address: announcement?.address || '',
    lat: announcement?.lat || null,
    lng: announcement?.lng || null,
    date: formatDate(
      announcement?.date ? new Date(announcement?.date) : new Date(),
    ),
    title: announcement?.title || '',
  };

  const onSubmit: SubmitHandler<AnnouncementForm> = async (data) => {
    if (!data.lat || !data.lng) return;

    if (id) {
      await updateAnnouncement.mutateAsync({
        ...data,
        id,
        lat: data.lat,
        lng: data.lng,
      });
    } else {
      await setAnnouncement.mutateAsync({
        ...data,
        lat: data.lat,
        lng: data.lng,
      });
    }

    await refetch();

    setAlert({
      isOpen: true,
      message: 'Announcement Updated!',
      type: 'success',
    });
  };

  return (
    <Announcement
      readonly={readonly}
      position={position}
      defaultValues={defaultValues}
      formInput={announcementFormInput}
      onSubmit={onSubmit}
    />
  );
}

export default function AppointmentPage() {
  const isDom = useDomReady();
  const { data } = trpc.announcement.getAnnouncement.useQuery();

  if (!data || !data.announcements) return null;

  const { announcements } = data;

  return (
    <UserLayout>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between">
            <h2 className="card-title">Announcements</h2>
            <div className="flex gap-4">
              {/* <label className="btn" htmlFor="create-announcement-modal">
                Create Announcement
              </label>
              {isDom && (
                <Portal>
                  <input
                    type="checkbox"
                    id="create-announcement-modal"
                    className="modal-toggle"
                  />
                  <div className="modal">
                    <div className="modal-box relative max-w-7xl">
                      <label
                        htmlFor="create-announcement-modal"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                      >
                        ✕
                      </label>
                      <MapModal />
                    </div>
                  </div>
                </Portal>
              )} */}
              <label className="btn" htmlFor="announcement-modal">
                View Map
              </label>
              {isDom && (
                <Portal>
                  <input
                    type="checkbox"
                    id="announcement-modal"
                    className="modal-toggle"
                  />
                  <div className="modal">
                    <div className="modal-box relative max-w-7xl">
                      <label
                        htmlFor="announcement-modal"
                        className="btn btn-sm btn-circle absolute right-2 top-2"
                      >
                        ✕
                      </label>
                      <MapModal />
                    </div>
                  </div>
                </Portal>
              )}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {announcements.length === 0 && (
                  <tr>
                    <td colSpan={5} className="font-bold text-center">
                      Empty huh?
                    </td>
                  </tr>
                )}
                {announcements.map((announcement, key) => (
                  <tr className="hover" key={nanoid()}>
                    <th className="leading-4">
                      <div>{announcement.title}</div>
                      <small className="text-gray-500">
                        {announcement.title}
                      </small>
                    </th>
                    <td>{announcement.address}</td>
                    <td>{formatDate(announcement.date)}</td>
                    <td>
                      <div className="flex gap-2">
                        <label
                          htmlFor={`announcement-modal-${key}`}
                          className="btn btn-info"
                        >
                          <i className="material-icons">open_in_new</i>
                        </label>
                      </div>
                      {isDom && (
                        <Portal>
                          <input
                            type="checkbox"
                            id={`announcement-modal-${key}`}
                            className="modal-toggle"
                          />
                          <div className="modal">
                            <div className="modal-box relative max-w-7xl">
                              <label
                                htmlFor={`announcement-modal-${key}`}
                                className="btn btn-sm btn-circle absolute right-2 top-2"
                              >
                                ✕
                              </label>
                              <AnnouncementModal
                                readonly
                                id={announcement.id}
                                announcement={announcement}
                                position={{
                                  lat: announcement.lat,
                                  lng: announcement.lng,
                                }}
                              />
                            </div>
                          </div>
                        </Portal>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

type AnnouncementModalProps = {
  id?: string;
  readonly?: true;
  position?: Pick<LatLng, 'lat' | 'lng'>;
  announcement?: {
    title: string;
    address: string;
    date: Date;
    lat: number | null;
    lng: number | null;
  };
};
