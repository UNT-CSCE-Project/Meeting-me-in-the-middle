import { useState } from 'react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default function RegistrationForm() {
    const [name, setName] = useState(''); // State for name input
    const [email, setEmail] = useState(''); // State for email input
    const [phone, setPhone] = useState(''); // State for phone input
    const [address, setAddress] = useState(''); // State for address input
    const [password, setPassword] = useState(''); // State for password input
    const [error, setError] = useState(''); // State for error messages
    const [loadingSignup, setLoadingSignup] = useState(false); // Loading state for email signup
    const [successMessage, setSuccessMessage] = useState(''); // State for displaying success message
  
    const handleEmailSignup = async (e) => {
      e.preventDefault();
  
      // Clear previous error before starting the process
      setError('');
      setSuccessMessage(''); // Clear previous success message
  
      // Validation: Ensure all fields are filled out
      if (!name || !email || !phone || !address || !password) {
        setError('All fields are required.');
        return;
      }
  
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
  
      setLoadingSignup(true); // Set loading state for email signup
  
      try {
        const additionalData = {
          name,
          phone,
          address,
          email,
        };
  
        // // Attempt email signup
        // const user = await emailSignUp(email, password, additionalData);
        // console.log('Signed up:', user);
  
        // // Store additional user information in Firestore
        // const userRef = doc(firestore, 'users', user.uid);
  
        // // Ensure Firestore document gets created with all user data
        // await setDoc(userRef, additionalData, { merge: true });
  
        // Clear input fields after successful registration
        setName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setPassword('');
  
        // Show success message
        setSuccessMessage('Registration complete. Going to Signin page in 5 seconds.');
  
        // Delay redirect to allow the user to read the success message
        setTimeout(() => {
          redirect('/login');
        }, 5000);  // 3 seconds delay for better user experience
      } catch (error) {
        // Show specific error message from Firebase
        setError(`Failed to sign up: ${error.message}`);
        console.error('Error during signup:', error);
      } finally {
        setLoadingSignup(false); // Turn off loading state for email signup
      }
    };
  
    return (
        <div className="flex min-h-screen bg-black">
        {/* Left side: logo */}
        <div className="flex flex-col justify-center items-center bg-teal-400 w-2/5">
          <div className="bg-white p-4 rounded shadow-md">
            <Image src={logo} alt="Logo" width={200} height={200} />
          </div>
        </div>
  
        {/* Right side: form */}
        <div className="flex flex-col justify-center items-center w-3/5 bg-white p-8">
          <div className="w-96">
            <h2 className="text-center text-blue-600 text-3xl font-semibold mb-4">Create your account</h2>
            {error && <p className="text-red-600">{error}</p>} {/* Display error message */}
            {successMessage && <p className="text-green-600">{successMessage}</p>} {/* Display success message */}
            <form onSubmit={handleEmailSignup}>
              <label className="block text-gray-700 font-bold mb-2">Name</label>
              <input
                className="w-full p-2 mb-4 bg-gray-200"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
  
              <label className="block text-gray-700 font-bold mb-2">Email</label>
              <input
                className="w-full p-2 mb-4 bg-gray-200"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
  
              <label className="block text-gray-700 font-bold mb-2">Phone</label>
              <input
                className="w-full p-2 mb-4 bg-gray-200"
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
  
              <label className="block text-gray-700 font-bold mb-2">Address</label>
              <input
                className="w-full p-2 mb-4 bg-gray-200"
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
  
              <label className="block text-gray-700 font-bold mb-2">Password</label>
              <input
                className="w-full p-2 mb-6 bg-gray-200"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
  
              <button
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4"
                type="submit"
                disabled={loadingSignup}  // Disable the button during email signup
              >
                {loadingSignup ? 'Registering...' : 'Sign up'}
              </button>
  
            </form>
  
            <p className="text-center text-gray-600">
              Already have an account? <Link href="/signin" className="text-blue-600 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
      );
}