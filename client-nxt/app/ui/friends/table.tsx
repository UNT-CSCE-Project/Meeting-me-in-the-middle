import { SendRequest, DeleteFriend, UpdateFriend } from "./buttons";
import FriendStatus from "./status";

export default async function Table({
    query,
    currentPage,
  }: {
    query: string;
    currentPage: number;
  }) {
    const friends = [
      { id: 1, name: 'Avijeet', email: 'S6Q6f@example.com', date: '2023-03-02', status: 'pending' },
      { id: 2, name: 'Nikhil', email: 'OYkZD@example.com',  date: '2023-03-02', status: 'connected' },
      { id: 3, name: 'Sahil', email: 'jzKu7@example.com',  date: '2023-03-02', status: 'not connected' },];
  
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
                    Date
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
                {friends?.map((friend) => (
                  <tr
                    key={friend.id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                            <img
                            className="h-20 w-20 rounded-full overflow-hidden"
                            src={"https://picsum.photos/200/300"} // Add dynamic avatar URL
                            alt="Avatar"
                            />
                            <div className="text-sm font-medium text-gray-900">{friend.name}</div>
                        </div>
                    </td>

                      
                    <td className="whitespace-nowrap px-3 py-3">
                      {friend.email}
                    </td>
                    
                    <td className="whitespace-nowrap px-3 py-3">
                      {(friend.date)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <FriendStatus status={friend.status} />
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      
                      {friend.status === 'pending' || friend.status === 'connected' ? (
                    <div className="flex justify-start gap-3">
                        <DeleteFriend id={friend.id} />
                        </div>
                    ) : (
                    <div className="flex justify-start gap-3">
                        <SendRequest request={friend} />
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
  