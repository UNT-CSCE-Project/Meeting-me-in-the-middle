'use client';
 
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useUser } from '@/app/UserContext';
// ...
 
export default function NavLinks() {
  const pathname = usePathname();

  const {userData} = useUser();
  const links = [
    { name: 'Mid Point Finder', href: '/midpoint-finder'},
    
  ] as any;

  
  return (
    <>
      {links.map(({link}:{link:any}) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
                'disabled:bg-gray-50 disabled:text-gray-400 bg-pink-100': userData,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block text-gray-600">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}