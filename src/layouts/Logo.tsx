import Image from 'next/image';

export function Logo() {
  return (
    <div className="flex gap-2 items-center">
      <Image
        src="/images/logo.jpg"
        alt="logo"
        width={40}
        height={40}
        className="w-[30px] h-[30px] rounded-full"
      />
      <div className="font-title text-primary inline-flex text-lg transition-all duration-200 md:text-3xl">
        <span>Red Cross Dagupan</span>
      </div>
    </div>
  );
}
