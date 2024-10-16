"use client";
import { useUser } from "@/app/UserContext";
import {UserAvatar} from "./userAvatar";

export default function ProfileInfo() {
    const {  userData } = useUser();
    return (
        <>
            
            <UserAvatar firstName={userData?.firstName} lastName={userData?.lastName} />
            <p className="mt-2 mr-4 text-white">{(userData?.firstName|| "")+" "+(userData?.lastName|| "")}</p>
        </>
    )
}