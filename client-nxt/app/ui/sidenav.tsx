
import Link from 'next/link';
import NavLinks from '@/app/ui/nav-links';
import Logo from '@/app/ui/logo';
import { PowerIcon } from '@heroicons/react/24/outline';
// import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2" style={{background: "#2c2c2c"}}>
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <Logo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2  md:flex-col md:space-x-0 md:space-y-2" style={
    {background: "#2c2c2c"}}>
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md  md:block" style={{background: "#2c2c2c"}}></div>
        <form
        //   action={async () => {
        //     'use server';
        //     await signOut();
        //   }}
        >

        </form>
      </div>
    </div>
  );
}
