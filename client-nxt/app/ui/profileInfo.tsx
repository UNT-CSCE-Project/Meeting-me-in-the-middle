"use client";
import { useUser } from "@/app/UserContext";
import {UserAvatar} from "./userAvatar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProfileInfo({firstName, lastName}:{firstName: string, lastName: string}) {

    
    return (
        <>
            {firstName && lastName && (
                <>
                    <UserAvatar firstName={firstName} lastName={lastName} />
                    <p className="mt-2 mr-4 text-white">{firstName + " " + lastName}</p>
                </>
            )}
        </>
    )
}