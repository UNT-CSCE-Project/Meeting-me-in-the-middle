import SideNav from '@/app/ui/sidenav';
 
const experimental_ppr = true;

import '@/app/ui/global.css';
import { lusitana } from '@/app/ui/fonts';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lusitana.className} antialiased`}><div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow">{children}</div>
    </div></body>
    </html>
  );
}
