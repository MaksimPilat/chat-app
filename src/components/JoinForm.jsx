import React from "react";
import axios from "axios";

export const JoinForm = ({ onEnter }) => {

    const roomIdRef = React.useRef(null);
    const userNameRef = React.useRef(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const onJoin = async () => {
        const data = {
            roomId: roomIdRef.current.value,
            userName: userNameRef.current.value
        };
        if (Object.values(data).some(value => !value)) return alert('All fields are required!');
        if (data.userName.trim() === "admin") return alert('This username is reserved, please try another one!');
        setIsLoading(true);
        const { users } = (await axios.get(`/api/rooms/${data.roomId}`)).data;
        if (users.find(user => user === data.userName)) {
            setIsLoading(false);
            return alert('There is already a user with this name in this room!');
        }
        await axios.post('/api/rooms', data);
        onEnter(data);
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-3 w-80 mx-auto mb-20 flex flex-col gap-4">
                <h1 className="text-3xl font-bold mb-3">Join The Room</h1>
                <form className="flex flex-col gap-2">
                    <input
                        className="p-2 border-2 border-gray-300 focus:border-gray-400 rounded"
                        type='text'
                        placeholder='Room ID'
                        ref={roomIdRef}
                    />
                    <input
                        className="p-2 border-2 border-gray-300 focus:border-gray-400 rounded"
                        type='text'
                        placeholder='Your Name'
                        ref={userNameRef}
                    />
                </form>
                <button
                    disabled={isLoading}
                    onClick={onJoin}
                    className="p-2 bg-emerald-500 disabled:bg-emerald-700/75 active:bg-emerald-700/75 hover:bg-emerald-600 font-bold uppercase text-white rounded">
                    {isLoading ? 'Joining...' : 'Join'}
                </button>
            </div>
        </div>
    );
};
