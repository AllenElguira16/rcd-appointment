import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from 'react-leaflet';
import { LatLngExpression, LatLng } from 'leaflet';
import { useState } from 'react';

function LocationMarker({
  onChange,
  position: basePosition,
}: LocationMarkerProps) {
  const [position, setPosition] = useState<
    Pick<LatLng, 'lat' | 'lng'> | undefined
  >(basePosition);

  useMapEvents({
    click({ latlng }) {
      if (latlng !== position) {
        setPosition(latlng);
        onChange?.(latlng);
      }
    },
  });

  if (!position) return null;

  return (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

export default function MapInput({
  onChange,
  position: basePosition,
}: MapProps) {
  const position: LatLngExpression = basePosition ?? [16.0433, 120.3333];

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onChange={onChange} position={basePosition} />
    </MapContainer>
  );
}

type MapProps = {
  onChange?: (latlng: LatLng) => void;
  position?: Pick<LatLng, 'lat' | 'lng'>;
};

type LocationMarkerProps = {
  onChange?: (latlng: LatLng) => void;
  position?: Pick<LatLng, 'lat' | 'lng'>;
};
