"use client"; // Make this a client component

import { fetchUsersByQuery } from "@/app/lib/users/data";
import { SendRequest, DeleteFriend, UpdateFriend } from "./buttons";
import FriendStatus from "./status";
import { useUser } from "@/app/UserContext";
import { useEffect, useState } from "react";
import { UserAvatar } from "../userAvatar";

export default function Table({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const { currentUser } = useUser();
  const [searchList, setSearchList] = useState<any>([]);
  const currentUserId = currentUser?.uid; // Replace with authenticated user ID
  const fetchData = async () => {
    if (currentUserId) {
      const result = await fetchUsersByQuery(query, currentUserId);
      // console.log(result);
      setSearchList(result);
    }
  };
  useEffect(() => {
    fetchData();
  }, [query, currentUserId]);
  console.log(searchList);
  const handleOps = () => {
    fetchData(); // Call fetchData() after sendRequest is successful
  };
  
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-blue-50 p-2 md:pt-0 ml-4 mr-4">
          {
            searchList.length === 0 ? (
              <div className="w-full text-center">
                No users found
              </div>
            ) : (
              <table className="hidden min-w-full text-gray-900 md:table">
              <thead className="rounded-lg text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Status
                  </th>
                  <th scope="col" className="relative py-3 pl-6 pr-3 ">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {searchList.map((item : any) => (
                  <tr
                    key={item.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar firstName={item.firstName} lastName={item.lastName} />
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                      </div>
                    </td>
  
                    <td className="whitespace-nowrap px-3 py-3">
                      {item.email}
                    </td>
  
                    <td className="whitespace-nowrap px-3 py-3">
                      <FriendStatus status={item.status} />
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      {item.status === 'pending' || item.status === 'connected' ? (
                    <div className="flex justify-start gap-3">
                        {item.requestId !== null && (
                          <DeleteFriend request_id={item.requestId} onDelete={handleOps}/>
                        )}
                        </div>
                    ) : (
                    <div className="flex justify-start gap-3">
                      {
                        item !== null && (
                        <SendRequest request={item} onSendRequest={handleOps}/>                          
                        )
                      }

                    </div>
              )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )
          }
         
        </div>
      </div>
    </div>
  );
}
