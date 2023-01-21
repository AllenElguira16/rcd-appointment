import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import { SubmitHandler, useForm } from 'react-hook-form';
import { announcementSchema } from '~/schema';
import { AnnouncementForm } from '~/types';
// eslint-disable-next-line import/no-cycle
import { MapInput } from '~/components';
import { LatLng } from 'leaflet';

export function Announcement({
  readonly,
  position,
  formInput,
  onSubmit,
  defaultValues,
  isSelectDisabled = false,
}: AnnouncementProps) {
  const {
    watch,
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema),
    defaultValues,
  });

  const handleSubmitParent = async () => {
    await onSubmit(watch());
    if (!isSelectDisabled) {
      reset();
      window.location.reload();
    }
  };

  const handleLatLngChange = ({ lat, lng }: LatLng) => {
    setValue('lat', lat);
    setValue('lng', lng);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitParent)}
      className="card-body grid gap-4"
    >
      <div className="card-title">
        <h2>Create Announcement</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {formInput.map((form) => (
          <div key={nanoid()}>
            <label htmlFor={form.id} className="text-xs">
              {form.label}
            </label>
            <input
              type="text"
              id={form.id}
              disabled={readonly}
              placeholder={form.placeholder}
              className={`input input-bordered w-full${
                errors[form.name] ? ' input-error' : ''
              }`}
              {...register(form.name)}
            />
            <small className="text-error">{errors[form.name]?.message}</small>
          </div>
        ))}
        <div>
          <label htmlFor="appointment_date" className="text-xs">
            Target Date of Announcement
          </label>
          <input
            type="date"
            id="appointment_date"
            disabled={readonly}
            className={`input input-bordered w-full${
              errors.date ? ' input-error' : ''
            }`}
            {...register('date')}
          />
          <small className="text-error">{errors.date?.message}</small>
        </div>
      </div>
      <div>
        <MapInput onChange={handleLatLngChange} position={position} />
        {(errors.lat || errors.lng) && (
          <small className="text-error">
            Select coordinates by Clicking map
          </small>
        )}
      </div>
      {!readonly && (
        <button type="submit" className="btn btn-primary">
          {isSelectDisabled ? 'Update' : 'Save'}
        </button>
      )}
    </form>
  );
}

export type AnnouncementFormInput = {
  id: string;
  name: keyof AnnouncementForm;
  label: string;
  placeholder: string;
};

type AnnouncementProps = {
  readonly?: true;
  position?: Pick<LatLng, 'lat' | 'lng'>;
  defaultValues: AnnouncementForm;
  formInput: AnnouncementFormInput[];
  onSubmit: SubmitHandler<AnnouncementForm>;
  isSelectDisabled?: boolean;
};
