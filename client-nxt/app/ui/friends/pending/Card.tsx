import {
    BanknotesIcon,
    ClockIcon,
    UserGroupIcon,
    InboxIcon,
  } from '@heroicons/react/24/outline';
import Link from "next/link";
const iconMap = {
    collected: BanknotesIcon,
    customers: UserGroupIcon,
    pending: ClockIcon,
    invoices: InboxIcon,
  };
export function Card({
    title,
    value,
    type,
  }: {
    title: string;
    value: number | string;
    type: 'invoices' | 'customers' | 'pending' | 'collected';
  }) {
    const Icon = iconMap[type];
  
    return (
      
      <div className="rounded-xl bg-blue-50 p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-start">
        {/* Avatar Section */}
        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
          <img
            className="object-cover"
            src={"https://picsum.photos/200/300"} // Add dynamic avatar URL
            alt="Avatar"
            width={50}
            height={50}
          />
        </div>

        {/* Name, Title and Address Section */}
        <div className="ml-4">
          <h3 className="text-sm font-medium">Avijeet</h3>
          <p className="text-xs text-gray-500">2105 Stella St</p>
        </div>
      </div>

      

      {/* Connect and Deny Buttons */}
      <div className="mt-4 flex justify-end">
        <button className="w-20 mr-2 rounded-lg bg-green-500 text-white py-2 hover:bg-green-600">
          Connect
        </button>
        <button className="w-20 ml-2 rounded-lg bg-red-500 text-white py-2 hover:bg-red-600">
          Deny
        </button>
      </div>
    </div>
    );
  }
  