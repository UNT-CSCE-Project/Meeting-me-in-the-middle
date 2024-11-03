import { UserAvatar } from '@/app/ui/userAvatar';
import {  BellIcon, MagnifyingGlassIcon,  ArrowRightEndOnRectangleIcon} from '@heroicons/react/24/outline';
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
    <div className="animate-pulse">
      <div className="relative flex flex ml-4 items-center justify-center h-10 w-10 bg-gray-200 rounded-full">
        <BellIcon className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-900" />
        <span className="relative top-0 right-0 h-3 w-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">0</span>
        <div className="object-cover sb-avatar sb-avatar--text" style={{ display: 'inline-block', verticalAlign: 'middle', width: '50px', height: '50px', borderRadius: '100%', fontFamily: 'Helvetica, Arial, sans-serif' }}>
          <div className="object-cover sb-avatar__text" title="Avijeet Shil" style={{ width: '50px', height: '50px', lineHeight: 'initial', textAlign: 'center', color: 'rgb(255, 255, 255)', borderRadius: '100%', background: 'linear-gradient(to right, #eee 8%, #ddd 18%, #eee 33%)', backgroundSize: '200px 100%', animation: 'loading 1.5s infinite' }}>
            <div style={{ display: 'table', tableLayout: 'fixed', width: '100%', height: '100%', fontSize: '16.6667px' }}>
              <span style={{ display: 'table-cell', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                <span> ADADASD ASDASD ADAS</span>
              </span>
            </div>
          </div>
        </div>
        <button
                type="button"
               
                className="text-white"
              >
                <ArrowRightEndOnRectangleIcon className="h-10 w-10" />
              </button>        
      </div>
    </div>
  );
}

export function SearchSkeleton() {
  return (
<>
  <div className={`${shimmer} relative w-2/3 flex flex-1 flex-shrink-0  `}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        id="search"
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
         // Directly pass the value
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
    <ProfileInfoSkeleton />
  
</>
    
  );
}