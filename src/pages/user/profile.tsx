import { Portal } from 'react-portal';
import { UserLayout } from '~/layouts';
import { trpc } from '~/utils';

export default function Profile() {
  const { data } = trpc.user.getUser.useQuery();

  if (!data || !data.user) return null;

  const { user } = data;

  return (
    <UserLayout>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <header className="flex justify-between">
            <div>
              <div className="card-title">{user.name}</div>
              <small className="block">{user.email}</small>
            </div>
            <div>
              <label
                htmlFor="edit-profile-modal"
                className="btn btn-sm text-white btn-error"
              >
                <i className="material-icons">edit</i>
                <div>Edit Profile</div>
              </label>
            </div>
          </header>
          <div>
            <div className="font-bold">Full Name:</div>
            <div>{user.name}</div>
          </div>
          <div>
            <div className="font-bold">Email:</div>
            <div>{user.email}</div>
          </div>
          <div>
            <div className="font-bold">Address:</div>
            <div>{user.address}</div>
          </div>
        </div>
      </div>
      <Portal>
        <input type="checkbox" id="edit-profile-modal" className="modal" />
        <div className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Congratulations random Internet user!
            </h3>
            <p className="py-4">
              You&apos;ve been selected for a chance to get one year of
              subscription to use Wikipedia for free!
            </p>
            <div className="modal-action">
              <label htmlFor="edit-profile-modal" className="btn">
                Yay!
              </label>
            </div>
          </div>
        </div>
      </Portal>
    </UserLayout>
  );
}
