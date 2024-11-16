'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder, baseUrl}: { placeholder: string, baseUrl: string }) {
  const router = useRouter();

  // Debounce to avoid repeated calls on each keystroke
  const handleSearch = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams();
    params.set('page', '1'); // Ensure page is reset to 1 on new search
    if (query) {
      params.set('query', query);
    }

    // Use push to navigate to `/friends` with the query parameters
    router.push(`${baseUrl}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative w-2/3 flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only" style={{
      opacity: 1,
      color: "rgb(0, 0, 0)",
      backgroundColor: "rgb(44, 44, 44)",
    }}>
        Search
      </label>
      <input
        id="search" 
        className="peer block w-full rounded-md border border-gray-600 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-600"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)} // Directly pass the value
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-600 peer-focus:text-gray-900" />
    </div>
  );
}
