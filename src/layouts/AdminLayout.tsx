import { trpc } from '~/utils';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';
import { NavLink } from '~/components';
import { CommonLayout } from './CommonLayout';

export function AdminLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const logoutMutation = trpc.user.logout.useMutation();

  const handleSignOut = async () => {
    const { status } = await logoutMutation.mutateAsync();

    if (status) router.replace('/');
  };

  return (
    <CommonLayout
      nav={
        <ul className="menu p-2">
          <li>
            <NavLink href="/admin/users">
              <i className="material-icons">person_add</i>
              <small className="font-bold">Users</small>
            </NavLink>
          </li>
          {/* NEEDS CLARIFICATION */}
          {/* <li>
            <Link href="/admin/billing">
              <i className="material-icons">credit_card</i>
              <small className="font-bold">Billing</small>
            </Link>
          </li> */}
          <li>
            <NavLink href="/admin/appointment">
              <i className="material-icons">account_circle</i>
              <small className="font-bold">Appointments</small>
            </NavLink>
          </li>
          <li>
            <NavLink href="/admin/announcements">
              <i className="material-icons">description</i>
              <small className="font-bold">Announcements</small>
            </NavLink>
          </li>
          <li className="menu-title">
            <span>Profile</span>
          </li>
          <li>
            <NavLink href="/admin/profile">
              <i className="material-icons">manage_accounts</i>
              <small className="font-bold">User Profile</small>
            </NavLink>
          </li>
          <li>
            <button type="button" onClick={handleSignOut}>
              <i className="material-icons">logout</i>
              <small className="font-bold">Sign Out</small>
            </button>
          </li>
        </ul>
      }
    >
      {children}
    </CommonLayout>
  );
}
