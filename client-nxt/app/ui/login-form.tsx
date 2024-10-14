'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { authenticate } from '@/app/lib/actions';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function LoginForm() {
  const router = useRouter(); // Initialize router for redirection
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState(false); // Track pending state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setIsPending(true);
    setErrorMessage(''); // Reset previous errors

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const result = await authenticate(undefined, formData);
      
      // Check if there's an error in the result
      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        // Redirect to the home page after successful login
        router.push('/'); // Use router to redirect
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message); // Handle any errors
    } finally {
      setIsPending(false); // Reset pending state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex h-screen">
        <div className="flex-none bg-cyan-500 w-1/3 flex items-center justify-center">
          <Image src="/logo.png" alt="Logo" width={200} height={200} />
        </div>
        <div className="flex-grow p-6 md:p-12 flex items-center justify-center">
          <div>
            <h1 className="text-2xl font-bold mb-4">Sign in to Meet Me in the Middle</h1>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              required
              className="border rounded p-2 mb-4 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
            />
            <input
              type="password"
              name='password'
              id="password"
              placeholder="Enter your password"
              required
              className="border rounded p-2 mb-4 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
            />
            <button 
              type="submit" // Ensure this is a submit button
              aria-disabled={isPending}
              className="bg-blue-500 text-white rounded p-2 w-full"
            >
              Sign in
            </button>
            <p className="mt-2">
              <a href="#" className="text-blue-600">Forgot Password?</a>
            </p>
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
