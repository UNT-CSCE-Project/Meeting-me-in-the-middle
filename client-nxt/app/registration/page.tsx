"use client";
import RegistrationForm from "@/app/ui/registration-form";
import Image from "next/image";
import logo from  "@/app/ui/logo.png";
import Link from "next/link";
export default async function Registration() {
    return (
        <div className="flex min-h-screen bg-black">
        {/* Left side: logo */}
        <div className="flex flex-col justify-center items-center bg-teal-400 w-2/5">
          <div className="bg-white p-4 rounded shadow-md">
            <Image src={logo} alt="Logo" width={200} height={200} />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-3/5 bg-white p-8">
        <div className="w-128">
          <h2 className="text-center text-blue-600 text-3xl font-semibold mb-4">Create your account</h2>

          <RegistrationForm />
          

          <p className="text-center text-gray-600">
            Already have an account? <Link href="/login" className="text-blue-600 hover:text-blue-800 underline">Sign in</Link>
          </p>
        </div>
      </div>
      </div>
    );

}