'use client'; // This component needs to be a client component
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();
    
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return redirect('/login'); // Handle unauthorized access

  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.name}!</p>
      {/* Add dashboard content here */}
    </div>
  );
}
