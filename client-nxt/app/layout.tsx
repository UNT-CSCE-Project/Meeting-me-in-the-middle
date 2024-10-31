

import SideNav from '@/app/ui/sidenav';
import Navbar from '@/app/ui/Navbar';
import '@/app/ui/global.css';
import { lusitana } from '@/app/ui/fonts';

import { UserProvider } from '@/app/UserContext';
import { usePathname } from 'next/navigation';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
 
  return (
    <UserProvider>
      <html lang="en">
          <body className={`${lusitana.className} antialiased`}>
          <div className="flex flex-col h-full">
            <div className="flex flex-row h-full">
              <SideNav />
              <div className="flex flex-col flex-grow">
                <Navbar />
                <div className="flex flex-col lg:flex-row h-screen w-full bg-gray-100">{children}</div>
              </div>
            </div>
          </div>
      </body>
      </html>
    </UserProvider>
  );
}