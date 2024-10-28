'use client';
 
import { Suspense, useEffect } from 'react';
 
export default function Error() {
  
 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className="flex h-full flex-col items-center justify-center">
        <h2 className="text-center">Something went wrong!</h2>
        
        
          Try again
        
      </main>
    </Suspense>
  );
}