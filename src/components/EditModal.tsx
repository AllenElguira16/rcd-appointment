import { zodResolver } from '@hookform/resolvers/zod';
import { PropsWithChildren } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Portal } from 'react-portal';
import { useSetRecoilState } from 'recoil';
import { useDomReady } from '~/hooks';
import { editSchema } from '~/schema';
import { alertState } from '~/state';
import { EditForm } from '~/types';
import { trpc } from '~/utils';

export function EditModal({
  user: defaultValues,
  toggleClass,
  children,
}: PropsWithChildren<{
  toggleClass: string;
  user: {
    address: string;
    email: string;
    gender: string;
    name: string;
    id: string;
    createdAt: Date;
  };
}>) {
  const isDomReady = useDomReady();
  const { refetch } = trpc.user.getAll.useQuery();
  const setAlert = useSetRecoilState(alertState);

  const editMutation = trpc.user.edit.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      id: defaultValues.id,
      address: defaultValues.address,
      email: defaultValues.email,
      gender: defaultValues.gender,
      name: defaultValues.name,
      password: '',
    },
  });

  const onSubmit: SubmitHandler<EditForm> = async (data) => {
    const { status, message } = await editMutation.mutateAsync(data);

    await refetch();
    setAlert({
      message,
      isOpen: true,
      type: status ? 'success' : 'error',
    });
    window.location.reload();
  };
  return (
    <>
      {children}
      {isDomReady && (
        <Portal>
          <input type="checkbox" id={toggleClass} className="modal-toggle" />
          <div className="modal">
            <div className="modal-box">
              <label
                htmlFor={toggleClass}
                className="btn btn-sm btn-circle absolute right-2 top-2"
              >
                ✕
              </label>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="card-body grid gap-4"
                autoComplete="new-password"
              >
                <h1 className="card-title">Edit Profile</h1>
                <input type="hidden" {...register('id')} />
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    className={`input input-bordered w-full ${
                      errors.name ? ' input-error' : ''
                    }`}
                    autoComplete="off"
                    {...register('name')}
                  />
                  <small className="text-error">{errors.name?.message}</small>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Email"
                    autoComplete="off"
                    className={`input input-bordered w-full ${
                      errors.email ? ' input-error' : ''
                    }`}
                    {...register('email')}
                  />
                  <small className="text-error">{errors.email?.message}</small>
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    autoComplete="new-password"
                    className={`input input-bordered w-full ${
                      errors.password ? ' input-error' : ''
                    }`}
                    {...register('password')}
                  />
                  <small className="text-error">
                    {errors.password?.message}
                  </small>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Address"
                    autoComplete="off"
                    className={`input input-bordered w-full ${
                      errors.address ? ' input-error' : ''
                    }`}
                    {...register('address')}
                  />
                  <small className="text-error">{errors.email?.message}</small>
                </div>
                <div className="w-full">
                  <select
                    className="select select-primary w-full"
                    {...register('gender')}
                  >
                    <option disabled hidden value="">
                      Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Edit
                </button>
              </form>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
