import { UserLayout } from '~/layouts';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AppointmentForm } from '~/types';
import { SubmitHandler } from 'react-hook-form';
import { trpc } from '~/utils';
import { Appointment, AppointmentFormInput } from '~/components';
import { alertState } from '~/state';
import { useSetRecoilState } from 'recoil';

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

const defaultValues: AppointmentForm = {
  address: '',
  appointmentType: 'DONOR',
  bloodType: 'AB+',
  contactNumber: '',
  email: '',
  firstName: '',
  gender: 'male',
  lastName: '',
  middleName: '',
};

export default function AppointmentPage() {
  const setAlert = useSetRecoilState(alertState);
  const router = useRouter();
  const setAppointmentMutation = trpc.appointment.setAppointment.useMutation();

  const onSubmit: SubmitHandler<AppointmentForm> = async (data) => {
    await setAppointmentMutation.mutateAsync(data);
    setAlert({
      isOpen: true,
      message: 'Appointment Created!',
      type: 'success',
    });
  };

  return (
    <UserLayout>
      {router.query.success === 'false' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body grid gap-4">An error occurred</div>
        </div>
      )}
      {router.query.success === 'true' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body grid gap-4">
            Payment Successful, <Link href="/user/appointment">Go back</Link>
          </div>
        </div>
      )}
      {!router.query.success && (
        <div className="card bg-base-100 shadow-xl">
          <Appointment
            defaultValues={defaultValues}
            formInput={formInput}
            onSubmit={onSubmit}
          />
        </div>
      )}
    </UserLayout>
  );
}
