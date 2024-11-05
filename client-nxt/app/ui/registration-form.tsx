
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
        if(firstName=='') {
          setIsError(true);
          return
        } else if(lastName=='') {
          setIsError(true);
          return
        }
        else if(phoneNumber=='' || phoneNumber.length < 8) {
          setIsError(true);
          return
        } else  if(!phoneNumber.match(/^\d{3}-\d{3}-\d{4}$/)) {
          setErrorMessage('Please give an input of the form XXX-XXX-XXXX');
          setIsError(true);
          return
        }
        else if(streetAddress=='') {
          setIsError(true);
          return
        }
        else  if(city=='') {
          setIsError(true);
          return
        }
        else  if(state=='') {
          setIsError(true);
          return
        }
        else  if(zipCode=='') {
          setIsError(true);
          return
        }
        else if(email=='') {
          setIsError(true);
          return
        }
        else if(password=='') {
          setIsError(true);
          return
        }
        else if(confirmPassword=='') {
          setIsError(true);
          return
        } else if(password !== confirmPassword) {
          setErrorMessage('Passwords do not match');
          setIsError(true);
          return
        }
        try {

                setIsError(false);
                          // console.log(email, password)
                const user = await emailSignUp(email, password);
                
                const formData = new FormData();
                formData.append('email', email);
                formData.append('password', password);
                formData.append('firstName', firstName);
                formData.append('lastName', lastName);
                formData.append('phoneNumber', phoneNumber);                 
                formData.append('streetAddress', streetAddress);
                formData.append('city', city);
                formData.append('state', state);
                formData.append('zipCode', zipCode);
                
                
                if(user && user?.uid) {
                    formData.append('uid', user?.uid as string);
                    setErrorMessage('');
                    const response = await addUser(formData);
                    if(response?.status !== 200) {
                        setErrorMessage(response.message);
                        await deleteUser(user as any);
                        return;
                    } else {
                      setSuccessMessage('Registration successful, redirecting to login...');
                      setTimeout(() => {

                          router.push('/login');
                      }, 3000)

                    }
                } 
                
      } catch (error) {
            console.error('An error occurred:', error?.message || error);
            setErrorMessage(error?.message || 'An error occurred');

        }
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4">
        
            <div className="flex-grow p-6 md:p-12 flex items-center justify-center">
            <div>
                <div className="flex items-center mb-4">
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
              <label htmlFor="state"  className={state === '' && isError ? 'text-red-500' : ''}>State</label>
              <input
                type="text"
                name="state"
                id="state"
                placeholder="State"
                className={`border rounded p-2 mb-4 w-full ${state === '' && isError ? 'border-red-500' : ''}`}
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
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