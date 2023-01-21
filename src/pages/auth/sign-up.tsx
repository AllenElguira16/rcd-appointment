import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '~/utils';
import { SignUpForm } from '~/types';
import { signUpSchema } from '~/schema';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const registerMutation = trpc.user.register.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      address: '',
      email: '',
      gender: '',
      name: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<SignUpForm> = async (data) => {
    const { user, status } = await registerMutation.mutateAsync(data);

    if (status && user) router.push(`/${user.role}`);
  };

  return (
    <div className="grid place-items-center min-h-screen">
      <div className="card w-1/3 bg-base-100 shadow-xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card-body grid gap-4"
        >
          <h1 className="card-title">Sign In</h1>
          <div>
            <input
              type="text"
              placeholder="Name"
              className={`input input-bordered w-full ${
                errors.name ? ' input-error' : ''
              }`}
              {...register('name')}
            />
            <small className="text-error">{errors.name?.message}</small>
          </div>
          <div>
            <input
              type="text"
              placeholder="Email"
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
              className={`input input-bordered w-full ${
                errors.address ? ' input-error' : ''
              }`}
              {...register('address')}
            />
            <small className="text-error">{errors.email?.message}</small>
          </div>
          {/* <div className="w-full">
            <select
              className="select select-primary w-full"
              {...register("bloodType")}
            >
              <option disabled selected hidden>
                Blood Type
              </option>
              <option value="AB_POSITIVE">AB+</option>
              <option value="AB_NEGATIVE">AB-</option>
              <option value="A_POSITIVE">A+</option>
              <option value="A_NEGATIVE">A-</option>
              <option value="B_POSITIVE">B+</option>
              <option value="B_NEGATIVE">B-</option>
              <option value="O_POSITIVE">O+</option>
              <option value="O_NEGATIVE">O-</option>
            </select>
          </div> */}
          <div className="w-full">
            <select
              className="select select-primary w-full"
              {...register('gender')}
            >
              <option disabled value="" hidden>
                Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <small className="text-error">{errors.gender?.message}</small>
          </div>
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
          <div className="flex justify-center gap-1">
            <span>Already have an account?</span>{' '}
            <Link href="/auth/sign-in" className="font-bold">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
