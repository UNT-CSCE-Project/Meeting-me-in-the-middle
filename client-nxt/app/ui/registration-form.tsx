'use client';
import { useState } from 'react';
import {emailSignUp} from '@/app/lib/firebaseClient';
import { addUser } from '../lib/users/actions';
import { deleteUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
export default function RegistrationForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [phoneNumber, setphoneNumber] = useState('');
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setErrorMessage('');
  
      // Validation checks
      const validationChecks = [
          { condition: firstName === '', message: 'First name is required' },
          { condition: lastName === '', message: 'Last name is required' },
          { condition: phoneNumber === '' || phoneNumber.length < 8, message: 'Valid phone number is required' },
          { condition: !phoneNumber.match(/^\d{3}-\d{3}-\d{4}$/), message: 'Please give an input of the form XXX-XXX-XXXX' },
          { condition: streetAddress === '', message: 'Street address is required' },
          { condition: city === '', message: 'City is required' },
          { condition: state === '', message: 'State is required' },
          { condition: zipCode === '', message: 'Zip code is required' },
          { condition: email === '', message: 'Email is required' },
          { condition: password === '', message: 'Password is required' },
          { condition: confirmPassword === '', message: 'Please confirm your password' },
          { condition: password !== confirmPassword, message: 'Passwords do not match' }
      ];
  
      // Check all validations
      for (const check of validationChecks) {
          if (check.condition) {
              setIsError(true);
              setErrorMessage(check.message);
              return;
          }
      }
  
      try {
          setIsError(false);
          const user = await emailSignUp(email, password);
          console.log(user);
          // Check if user creation was successful  
          if (!user || !user.uid) {
              setErrorMessage('Failed to create user account');
              return;
          }
          console.log(user);
  
          const formData = new FormData();
          const formFields = {
              email,
              password,
              firstName,
              lastName,
              phoneNumber,
              streetAddress,
              city,
              state,
              zipCode,
              uid: user.uid
          };
  
          // Append all form fields
          Object.entries(formFields).forEach(([key, value]) => {
              formData.append(key, value);
          });
  
          const response = await addUser(formData);
          console.log(response);
          if (response?.status !== 200) {
              setErrorMessage(response.message || 'Failed to create user profile');
              // Optionally handle user deletion if profile creation fails
              // await deleteUser(user);
          } else {
              setSuccessMessage('Registration successful, redirecting to login...');
              setTimeout(() => {
                  router.push('/login');
              }, 3000);
          }
      } catch (error) {
          console.error('An error occurred:', error);
          
          // Properly handle the error message
          const errorMessage = error instanceof Error 
              ? error.message 
              : 'An unexpected error occurred during registration';
          
          setErrorMessage(errorMessage);
      }
  };
    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
          
            <div className="flex-grow p-6 md:p-6 flex items-center justify-center">
            <div>
                <div className="flex items-center">
                    <div className="w-1/2 pr-4">
                        <label htmlFor="firstName" className={firstName === '' && isError ? 'text-red-500' : ''}>First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          placeholder="First Name"
                          className={`border rounded p-2 w-full ${firstName === '' && isError ? 'border-red-500' : ''}`}
                          value={firstName}
                          onChange={(e) => setfirstName(e.target.value)}
                        />
                    </div>
                    <div className="w-1/2 pl-4">
                        <label htmlFor="lastName" className={lastName === '' && isError ? 'text-red-500' : ''}>Last Name</label>
                        <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Last Name"

                        className={`border rounded p-2 w-full ${lastName === '' && isError ? 'border-red-500' : ''}`}
                        value={lastName}
                        onChange={(e) => setlastName(e.target.value)}
                        />
                    </div>
                </div>

              <label htmlFor="phoneNumber"  className={phoneNumber === '' && isError ? 'text-red-500' : ''}>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="XXX-XXX-XXXX"
                className={`border rounded p-2 mb-4 w-full ${phoneNumber === '' && isError ? 'border-red-500' : ''}`}
                value={phoneNumber}
                onChange={(e) => setphoneNumber(e.target.value)}
              />
              <label htmlFor="streetAddress" className={streetAddress === '' && isError ? 'text-red-500' : ''}>Street Address</label>
              <input
                type="text"
                name="streetAddress"
                id="streetAddress"
                placeholder="Street Address"
                className={`border rounded p-2 mb-4 w-full ${streetAddress === '' && isError ? 'border-red-500' : ''}`}
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
              />
              <div className="flex justify-between w-full">
                <div className="w-1/2 mr-2">
                  <label htmlFor="city" className={city === '' && isError ? 'text-red-500' : ''}>City</label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="City"
                    className={`border rounded p-2 mb-4 w-full ${city === '' && isError ? 'border-red-500' : ''}`}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="state" className={state === '' && isError ? 'text-red-500' : ''}>State</label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    placeholder="State"
                    className={`border rounded p-2 mb-4 w-full ${state === '' && isError ? 'border-red-500' : ''}`}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
              </div>
              <label htmlFor="zipCode" className={zipCode === '' && isError ? 'text-red-500' : ''}>Zip Code</label>
              <input
                type="text"
                name="zipCode"
                id="zipCode"
                placeholder="Zip Code"
                className={`border rounded p-2 mb-4 w-full ${zipCode === '' && isError ? 'border-red-500' : ''}`}
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
              <label htmlFor="email" className={email === '' && isError ? 'text-red-500' : ''}>Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email address"
                className={`border rounded p-2 mb-4 w-full ${email === '' && isError ? 'border-red-500' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex items-center mb-4">
                <div className="w-1/2 pr-4">
                    <label htmlFor="password" className={password === '' && isError ? 'text-red-500' : ''}>Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        className={`border rounded p-2 mb-4 w-full ${password === '' && isError ? 'border-red-500' : ''}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                  <div className="w-1/2 pr-4">              
                    <label htmlFor="confirmPassword" className={confirmPassword === '' && isError ? 'text-red-500' : ''}>Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        className={`border rounded p-2 mb-4 w-full ${confirmPassword === '' && isError ? 'border-red-500' : ''}`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
              </div>
              {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
              {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
              <button
                type="submit"
                className="bg-blue-600 text-white rounded p-2 w-full"
              >
                Register
              </button>
            </div>
            </div>
        
        </form>     
    );
}