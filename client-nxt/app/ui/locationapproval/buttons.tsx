import { useState } from "react";
import { updateStatus } from "@/app/lib/locationApproval/actions";
export function AcceptInvitation({item_id, onAccept}: {
    item_id: string;
    onAccept:  () => void;
}) {
    const [id, _] = useState(item_id);
    const [isLoading, setIsLoading] = useState(false);
    const handleAcceptRequest = async () => {
        setIsLoading(true);
        const response = await updateStatus(id, "accepted");
        if(response?.status === 200) {
            onAccept();
        } else {
            console.error("Error accepting invitation request:", response?.message);    
        }
        setIsLoading(false);
    };
    return (
        <button
            onClick={handleAcceptRequest}
            className={`ml-auto bg-blue-600 text-white py-1 px-3 rounded focus:outline-none ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
            >
            Accept
        </button>
    );
}
export function DeclineInvitation({item_id, onDecline}: {
    item_id: string;
    onDecline:  () => void;
}) {
    const [id, _] = useState(item_id);
    const [isLoading, setIsLoading] = useState(false);
    const handleDeclineRequest = async () => {
        setIsLoading(true);
        const response = await updateStatus(id, "declined");
        if(response?.status === 200) {
            onDecline();
        } else {
            console.error("Error accepting invitation request:", response?.message);    
        }
        setIsLoading(false);
    };
    return (
        <button
            onClick={handleDeclineRequest}
            className={`ml-3 bg-red-600 text-white py-1 px-3 rounded focus:outline-none ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
            >
            Decline
        </button>
    );
}