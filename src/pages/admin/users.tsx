import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Portal } from 'react-portal';
import { useSetRecoilState } from 'recoil';
import { useDomReady } from '~/hooks';
import { AdminLayout } from '~/layouts';
import { editSchema } from '~/schema';
import { alertState } from '~/state';
import { EditForm } from '~/types';
import { formatDate, trpc } from '~/utils';

function Edit({ defaultValues }: { defaultValues: EditForm }) {
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
      password: defaultValues.password,
    },
  });

  const onSubmit: SubmitHandler<EditForm> = async (data) => {
    const { status, message } = await editMutation.mutateAsync(data);

    setAlert({
      message,
      isOpen: true,
      type: status ? 'success' : 'error',
    });
  };

  return (
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
        <small className="text-error">{errors.password?.message}</small>
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
  );
}

export default function Users() {
  const isDomReady = useDomReady();
  const setAlert = useSetRecoilState(alertState);
  const deleteMutation = trpc.user.delete.useMutation();
  const { data: users, refetch } = trpc.user.getAll.useQuery();

  const handleDeleteUser = (id: string) => async () => {
    const { status, message } = await deleteMutation.mutateAsync(id);

    if (status) {
      setAlert({ isOpen: true, message, type: 'success' });
      await refetch();
    }
  };

  return (
    <AdminLayout>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Users</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Address</th>
                  <th>Date of Created</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {users?.map((user, index) => (
                  <tr className="hover" key={nanoid()}>
                    <th className="leading-4">
                      <div>{user.name}</div>
                      <small className="text-gray-500">{user.email}</small>
                    </th>
                    <td>{user.address}</td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <div className="flex gap-2">
                        {/* <button type="button" className="btn btn-info">
                          <i className="material-icons">edit</i>
                        </button> */}
                        <label
                          htmlFor={`edit-profile-modal-${index}`}
                          className="btn btn-info"
                          // className="btn btn-sm text-white btn-error"
                        >
                          <i className="material-icons">edit</i>
                        </label>
                        {isDomReady && (
                          <Portal>
                            <input
                              type="checkbox"
                              id={`edit-profile-modal-${index}`}
                              className="modal-toggle"
                            />
                            <div className="modal">
                              <div className="modal-box">
                                <label
                                  htmlFor={`edit-profile-modal-${index}`}
                                  className="btn btn-sm btn-circle absolute right-2 top-2"
                                >
                                  ✕
                                </label>
                                <Edit
                                  defaultValues={{
                                    ...user,
                                    password: '',
                                  }}
                                />
                              </div>
                            </div>
                          </Portal>
                        )}
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={handleDeleteUser(user.id)}
                        >
                          <i className="material-icons">delete</i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
