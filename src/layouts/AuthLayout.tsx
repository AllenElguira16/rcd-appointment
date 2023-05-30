import Image from 'next/image';
import { PropsWithChildren } from 'react';

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <div className="w-1/3 flex flex-col gap-4 mx-auto mt-48">
        <div className="flex flex-col gap-4">
          <Image
            src="/images/logo.png"
            className="mx-auto"
            alt=""
            width={250}
            height={200}
          />
          <div className="font-bold text-red-800 text-2xl text-center">
            THE PHILIPPINE RED CROSS APPOINTMENT
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">{children}</div>
      </div>
    </div>
  );
}
