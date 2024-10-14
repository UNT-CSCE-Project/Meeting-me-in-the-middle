// page.tsx

import "@/app/ui/global.css";
import React from 'react';
export default function Home() {
  return (
    <div className="flex h-screen flex-col md:flex-row ">
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        {/* You can add your main content here */}
        <h1 className="text-2xl font-bold">Welcome to Meet Me dsad in the Middle!</h1>
        {/* You can add more content or components here */}
      </div>
    </div>
  );
}
