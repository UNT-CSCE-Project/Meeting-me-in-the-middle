import { useUser } from "@/app/UserContext";
import { UserAvatar } from "./userAvatar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProfileInfo({ firstName, lastName, email }: { firstName: string, lastName: string, email: string }) {
  return (
    <div className="flex items-center">
      {firstName && lastName && (
        <>
          <UserAvatar firstName={firstName} lastName={lastName} />
          <div className="text-sm text-white font-semibold text-gray-600 ml-2">
            <div className="font-bold">{firstName} {lastName}</div>
            <div className="text-xs font-semibold text-blue-300">{email}</div>
          </div>
        </>
      )}
    </div>
  );
}