import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { nanoid } from 'nanoid';
import { Announcement } from '@prisma/client';

export default function MapAnnouncement({
  announcements,
}: MapAnnouncementProps) {
  return (
    <MapContainer
      center={[16.0433, 120.3333]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {announcements?.map(({ title, lat, lng }) => (
        <Marker key={nanoid()} position={{ lat, lng }}>
          <Popup>{title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

type MapAnnouncementProps = {
  announcements: Announcement[];
};
