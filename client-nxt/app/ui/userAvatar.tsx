import Avatar from 'react-avatar';
export const UserAvatar = ({ firstName, lastName }: { firstName: string, lastName: string }) => {
    return (
        <Avatar 
            name={`${firstName} ${lastName}`} 
            size="50" 
            round={true} 
            className="object-cover" 
        />
    );
};