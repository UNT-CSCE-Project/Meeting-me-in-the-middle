import { fetchUsersByQuery } from "@/app/lib/users/data";
import { SendRequest, DeleteFriend, UpdateFriend } from "./buttons";
import FriendStatus from "./status";

export default async function Table({
    query,
    currentPage,
  }: {
    query: string;
    currentPage: number;
  }) {
  
    /* TODO: fetch user list */

    const currentUserId = "xo1sAzsKwYHfUoTaq2jN"; // Replace with authenticated user ID
    const searchList = await fetchUsersByQuery(query, currentUserId);
    console.log(searchList)
    /* TODO: ADD filter functionality */
    /* TODO: Add sorting functionality */
    /* TODO: Add pagination */


    return (
      <div className="mt-6 flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-blue-50 p-2 md:pt-0 ml-4 mr-4">
           
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
                {searchList?.map((item) => (
                  <tr
                    key={item.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                            <img
                            className="h-20 w-20 rounded-full overflow-hidden"
                            src={"https://picsum.photos/200/300"} // Add dynamic avatar URL
                            alt="Avatar"
                            />
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
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
                        <DeleteFriend request_id= {item.requestId} />
                        </div>
                    ) : (
                    <div className="flex justify-start gap-3">
                        <SendRequest request={item} />
                    </div>
              )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  