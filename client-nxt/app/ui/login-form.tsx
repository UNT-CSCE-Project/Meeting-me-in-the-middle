'use client';
import { useState } from 'react';
import '@/app/ui/global.css';
import { redirect, useRouter } from 'next/navigation'; // Import useRouter
import { emailSignIn } from '@/app/lib/firebaseClient';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { fetchUserByUidAndEmail } from '../lib/users/data';

import logo from "@/app/ui/logo.png";
import { deleteUser } from 'firebase/auth';

export default function LoginForm() {
  const router = useRouter(); // Initialize router for redirection
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, setIsPending] = useState(false); // Track pending state
  const [isError, setIsError] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setIsPending(true);
    
    setErrorMessage(''); // Reset previous errors
  
    try {
      if(email ===''){
        setIsError(true);
        
      } else if(password ===''){
        setIsError(true);
        
      } else{
        setIsError(false);
        const result = await emailSignIn(email, password) as any;
          console.log(result);
          if (result?.error ) {
            setIsPending(false);
            setErrorMessage(result.error);
            return;
          }
          if ('user' in result && result.user === null) {
            setIsPending(false);
            setErrorMessage('Invalid email or password');
            return;
          }
         const user = result;
         if(user) {
          const user = result;
          if (user && 'uid' in user && 'email' in user) {
            const response = await fetchUserByUidAndEmail(user.uid, user.email || "");
            console.log(response);
            if (response?.message) {
              setErrorMessage(response.message);
              if(response.message === 'Error fetching user')
                await deleteUser(user as any);
              return;
            } else {
              setIsPending(false);            
              setErrorMessage('');
              router.push('/midpoint-finder');
              return;
            }
          }
         }
         setIsPending(false);
      }
          

              // Store the user information in local storage
  //            localStorage.setItem('user', JSON.stringify(userData));
          
              // Redirect to the home page after successful login
              // Use router to redirect
            // Use the user object as needed
          
    } catch (error : any) {
      console.error(error);
      setErrorMessage(error?.message); // Handle any errors
    } finally {
      setIsPending(false); // Reset pending state
    }
  };

  return (
    
    <form onSubmit={handleSubmit}>

        <div className="flex-grow p-6 md:p-12 flex flex-col justify-center items-center">
          <div>
            <h1 className="text-2xl font-bold mb-4">Sign in to Meet Me in the Middle</h1>
            <label htmlFor="email" className={`${email === '' && isError ? 'text-red-500' : ''} block mb-2`}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              className=  {`border rounded p-2 mb-4 w-full ${email === '' && isError ? 'border-red-500' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update email state
            />
            <label htmlFor="password" className={`${password === '' && isError ? 'text-red-500' : ''} block mb-2`}>Password</label>
            <input
              type="password"
              name='password'
              id="password"
              placeholder="Enter your password"
              className=  {`border rounded p-2 mb-4 w-full ${password === '' && isError ? 'border-red-500' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state
            />
            <button 
              type="submit" // Ensure this is a submit button
              aria-disabled={isPending}
              className={`bg-blue-500 text-white rounded p-2 w-full ${isPending && 'opacity-50 cursor-not-allowed'}`}
            >
              Sign in
            </button>
            <p className="mt-2">
              <a href="#" className="text-blue-600">Forgot Password?</a>
            </p>
            <p className="mt-2">
              Don't have an account? <a href="/registration" className="text-blue-600">Sign up</a>
            </p>
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
 
    </form>
  );
}