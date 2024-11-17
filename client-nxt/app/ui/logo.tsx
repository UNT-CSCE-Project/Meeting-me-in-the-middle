import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Logo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white flex-shrink-0`}
    >
      {/* Using Next.js Image component to reference logo.png in the public folder */}
      <Image 
        src="/logo.png"     // Path relative to the public folder
        alt="Logo" 
        width={80}          // Set the width of the image
        height={80}         // Set the height of the image
        priority
      />
      <p className="text-[20px] px-1 ml-2  text-gray-600">Meet Me In The Middle</p>
    </div>
  );
}
