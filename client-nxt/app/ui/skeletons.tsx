import { UserAvatar } from '@/app/ui/userAvatar';
import {  BellIcon } from '@heroicons/react/24/outline';
// Loading animation

const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-200" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </>
  );
}

export function ProfileInfoSkeleton() {


  return (
    <div className={`${shimmer}`}>
                <div className="relative flex ml-4 items-center justify-center h-10 w-10 bg-gray-200 rounded-full">
                                    <BellIcon className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-900" />
                                    <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">1</span>
                                </div>
            <UserAvatar firstName={"John"} lastName={"Doe"} />
            <p className={`mt-2 mr-4 text-white`}>{"John Doe"}</p>
      </div>
  );
}

