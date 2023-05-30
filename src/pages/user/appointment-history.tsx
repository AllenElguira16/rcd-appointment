import { Appointment, AppointmentFormInput } from '~/components';
import { useDomReady } from '~/hooks';
import { UserLayout } from '~/layouts';
import { alertState } from '~/state';
import { AppointmentForm, AppointmentInfo } from '~/types';
import { trpc } from '~/utils';
import { AppointmentEnum, Prisma, User } from '@prisma/client';
import { SubmitHandler } from 'react-hook-form';
import { Portal } from 'react-portal';
import { useSetRecoilState } from 'recoil';
import { nanoid } from 'nanoid';
import { ChangeEventHandler, useState } from 'react';

const formInput: AppointmentFormInput[] = [
  {
    id: 'first_name',
    name: 'firstName',
    label: 'First Name',
    placeholder: 'John',
  },
  {
    id: 'middle_name',
    name: 'middleName',
    label: 'Middle Name',
    placeholder: 'Nommensen',
  },
  {
    id: 'last_name',
    name: 'lastName',
    label: 'Last Name',
    placeholder: 'Doe',
  },
  {
    id: 'address',
    name: 'address',
    label: 'Address',
    placeholder:
      'Robert Robertson, 1234 NW Bobcat Lane, St. Robert, MO 65584-5678.',
  },
  {
    id: 'email',
    name: 'email',
    label: 'E-mail Address',
    placeholder: 'johndoe@email.com',
  },
  {
    id: 'contact_number',
    name: 'contactNumber',
    label: 'Contact Number',
    placeholder: '09xx-xxx-xxxx',
  },
];

function AppointmentModal({ appointment }: AppointmentModalProps) {
  const { refetch } = trpc.appointment.getUserAppointment.useQuery();
  const updateMutation = trpc.appointment.updateAppointment.useMutation();
  const setAlert = useSetRecoilState(alertState);

  const info = appointment.info as AppointmentForm;

  const defaultValues: AppointmentForm = {
    firstName: info.firstName,
    lastName: info.lastName,
    middleName: info.middleName,
    address: info.address,
    contactNumber: info.contactNumber,
    email: info.email,
    appointmentType: appointment.type,
    bloodType: info.bloodType,
    gender: info.gender,
  };

  const onSubmit: SubmitHandler<AppointmentForm> = async (data) => {
    await updateMutation.mutateAsync({
      ...data,
      appointmentId: appointment.id,
    });

    await refetch();

    setAlert({
      isOpen: true,
      message: 'Appointment Updated!',
      type: 'success',
    });
  };

  return (
    <Appointment
      defaultValues={defaultValues}
      formInput={formInput}
      onSubmit={onSubmit}
      isSelectDisabled
    />
  );
}

export default function AppointmentHistory() {
  const [bloodType, setBloodType] = useState('');
  const isDom = useDomReady();
  const setAlert = useSetRecoilState(alertState);
  // const { data, refetch } = trpc.appointment.getUserAppointment.useQuery();
  const { data, refetch } = trpc.appointment.getAllByBlood.useQuery(bloodType);
  const deleteMutation = trpc.appointment.delete.useMutation();

  const handleDelete = (id: string) => async () => {
    const { status, message } = await deleteMutation.mutateAsync(id);

    if (status) {
      setAlert({ isOpen: true, message, type: 'success' });
      await refetch();
    }
  };

  const handleBloodType: ChangeEventHandler<HTMLSelectElement> = (event) => {
    setBloodType(event.currentTarget.value);
  };

  if (!data) return null;

  const { appointments } = data;

  return (
    <UserLayout>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex justify-between">
            <h2 className="card-title">Appointments</h2>
            <select
              className="select select-primary"
              onChange={handleBloodType}
              value={bloodType}
            >
              <option value="">All</option>
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
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Appointment Type</th>
                  <th>Blood Type</th>
                  <th>Address</th>
                  <th>Approved</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {appointments?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="font-bold text-center">
                      Empty huh?
                    </td>
                  </tr>
                )}
                {appointments?.map((appointment, key) => (
                  <tr className="hover" key={nanoid()}>
                    <td>{appointment.type}</td>
                    <td>{(appointment.info as AppointmentInfo).bloodType}</td>
                    <td>{appointment.user.address}</td>
                    <td>{appointment.approved ? 'Yes' : 'No'}</td>
                    <td>
                      <div className="flex gap-2">
                        <label
                          htmlFor={`appointment-modal-${key}`}
                          className="btn btn-info"
                        >
                          <i className="material-icons">edit</i>
                        </label>
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={handleDelete(appointment.id)}
                        >
                          <i className="material-icons">delete</i>
                        </button>
                      </div>
                      {isDom && (
                        <Portal>
                          <input
                            type="checkbox"
                            id={`appointment-modal-${key}`}
                            className="modal-toggle"
                          />
                          <div className="modal">
                            <div className="modal-box relative max-w-7xl">
                              <label
                                htmlFor={`appointment-modal-${key}`}
                                className="btn btn-sm btn-circle absolute right-2 top-2"
                              >
                                ✕
                              </label>
                              <AppointmentModal appointment={appointment} />
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

type AppointmentModalProps = {
  appointment: {
    type: AppointmentEnum;
    id: string;
    createdAt: Date;
    user: User;
    info: Prisma.JsonValue;
    approved: boolean;
  };
};
