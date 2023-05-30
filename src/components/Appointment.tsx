import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import { SubmitHandler, useForm } from 'react-hook-form';
import { appointmentSchema } from '~/schema';
import { AppointmentForm } from '~/types';

export function Appointment({
  formInput,
  onSubmit,
  defaultValues,
  isSelectDisabled = false,
}: AppointmentProps) {
  const {
    watch,
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentForm>({
    resolver: zodResolver(appointmentSchema),
    defaultValues,
  });

  const handleSubmitParent = async () => {
    await onSubmit(watch());
    if (!isSelectDisabled) reset();
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitParent)}
      className="card-body grid gap-4"
    >
      <div className="card-title">
        <h2>Set Appointment</h2>
        <div className="ml-auto flex gap-4">
          <div>
            <label htmlFor="" className="text-xs">
              Appointment Type
            </label>
            <select
              className={`select select-primary w-full${
                errors.appointmentType ? ' input-error' : ''
              }`}
              disabled={isSelectDisabled}
              {...register('appointmentType')}
            >
              <option value="DONOR">Donor</option>
              <option value="RECIPIENT">Recipient</option>
            </select>
          </div>
          <div>
            <label htmlFor="" className="text-xs">
              Blood Type
            </label>
            <select
              className={`select select-primary w-full${
                errors.bloodType ? ' input-error' : ''
              }`}
              {...register('bloodType')}
            >
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
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
              placeholder={form.placeholder}
              className={`input input-bordered w-full${
                errors[form.name] ? ' input-error' : ''
              }`}
              {...register(form.name)}
            />
            <small className="text-error">{errors[form.name]?.message}</small>
          </div>
        ))}
      </div>
      <div className="w-full">
        <label htmlFor="gender" className="text-xs">
          Gender
        </label>
        <select
          id="gender"
          className={`select select-primary w-full${
            errors.gender ? ' input-error' : ''
          }`}
          {...register('gender')}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        {isSelectDisabled ? 'Update' : 'Submit'}
      </button>
    </form>
  );
}

export type AppointmentFormInput = {
  id: string;
  name: keyof AppointmentForm;
  label: string;
  placeholder: string;
};

type AppointmentProps = {
  defaultValues: AppointmentForm;
  formInput: AppointmentFormInput[];
  onSubmit: SubmitHandler<AppointmentForm>;
  isSelectDisabled?: boolean;
};
