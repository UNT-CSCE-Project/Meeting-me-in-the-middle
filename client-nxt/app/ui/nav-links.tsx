'use client';
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

import { usePathname } from 'next/navigation';
// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Mid Point Finder', href: '/midpoint-finder'},
  {name: 'Manage Friends',  href: '/friends'},
  { name: 'Location Approval', href: '/location-approval', },
  { name: 'Travel History', href: '/travel-history', },
  { name: 'Reviews', href: '/reviews', },
  

];

import clsx from 'clsx';
export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        
        console.log(pathname)
        console.log(link.href)
        return (
          <a
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center text-white  justify-center gap-2 rounded-md p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-black font-weight-bold': pathname == link.href,
              },
            )}
          >

            <p className=" md:block">{link.name}</p>
          </a>
        );
      })}
    </>
  );
}
