
import { useState } from 'react';
import {emailSignUp} from '@/app/lib/firebaseClient';
import { addUser } from '../lib/users/actions';
import { deleteUser } from 'firebase/auth';
export default function RegistrationForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        try {
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
            
            
            if(user?.uid) {
                formData.append('uid', user?.uid);
                const response = await addUser(formData);
                if(response?.errors) {
                    setErrorMessage(response.message);
                    await deleteUser(user);
                    return;
                }
            }
            setSuccessMessage('Registration successful');
           setErrorMessage('')
           setEmail('')
           setPassword('')
           setConfirmPassword('')
           setfirstName('')
           setlastName('')
           setphoneNumber('')
           setStreetAddress('')
           setCity('')
           setState('')
           setZipCode('')
            
        } catch (error) {
            console.error('An error occurred:', error);
            setErrorMessage('Registration failed');
        }
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4">
        
            <div className="flex-grow p-6 md:p-12 flex items-center justify-center">
            <div>
                <div className="flex items-center mb-4">
                    <div className="w-1/2 pr-4">
                        <label htmlFor="firstName">First Name</label>
                        <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="First Name"
                        required
                        className="border rounded p-2 w-full"
                        value={firstName}
                        onChange={(e) => setfirstName(e.target.value)}
                        />
                    </div>
                    <div className="w-1/2 pl-4">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Last Name"
                        required
                        className="border rounded p-2 w-full"
                        value={lastName}
                        onChange={(e) => setlastName(e.target.value)}
                        />
                    </div>
                </div>

              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder="XXX-XXX-XXXX"
                required
                className="border rounded p-2 mb-4 w-full"
                value={phoneNumber}
                onChange={(e) => setphoneNumber(e.target.value)}
              />
              <label htmlFor="streetAddress">Street Address</label>
              <input
                type="text"
                name="streetAddress"
                id="streetAddress"
                placeholder="Street Address"
                required
                className="border rounded p-2 mb-4 w-full"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
              />
              <label htmlFor="city">City</label>
              <input
                type="text"
                name="city"
                id="city"
                placeholder="City"
                required
                className="border rounded p-2 mb-4 w-full"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <label htmlFor="state">State</label>
              <input
                type="text"
                name="state"
                id="state"
                placeholder="State"
                required
                className="border rounded p-2 mb-4 w-full"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
              <label htmlFor="zipCode">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                id="zipCode"
                placeholder="Zip Code"
                required
                className="border rounded p-2 mb-4 w-full"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email address"
                required
                className="border rounded p-2 mb-4 w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex items-center mb-4">
                <div className="w-1/2 pr-4">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your password"
                        required
                        className="border rounded p-2 mb-4 w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                
                  <div className="w-1/2 pr-4">              
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        required
                        className="border rounded p-2 mb-4 w-full"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
              </div>
              {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}
              {successMessage && <p className="text-green-500 mb-2">{successMessage}</p>}
              <button
                type="submit"
                className="bg-blue-500 text-white rounded p-2 w-full"
              >
                Register
              </button>
            </div>
            </div>
        
        </form>     
    );
}