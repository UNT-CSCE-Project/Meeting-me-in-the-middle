

import SideNav from '@/app/ui/sidenav';


import '@/app/ui/global.css';
import { lusitana } from '@/app/ui/fonts';

import { UserProvider } from '@/app/UserContext';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <UserProvider>
      <html lang="en">
          <body className={`${lusitana.className} antialiased`}>
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
              <SideNav /> 
              <div className="flex-grow bg-gray-100">{children}</div>
            </div>
      </body>
      </html>
    </UserProvider>
  );
}