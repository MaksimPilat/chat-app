import React from 'react'
import socket from '../socket';
import { Message } from './Message';
import { IoMdSend } from 'react-icons/io';
import { BsPeopleFill } from 'react-icons/bs';
import { ImExit } from 'react-icons/im';

export const Room = ({ id, userName, users, messages }) => {

  const textareaRef = React.useRef(null);
  const chatRef = React.useRef(null);

  const [sidebar, setSidebar] = React.useState(false);

  const onSend = () => {
    if (textareaRef.current.value.trim() === "") return;
    socket.emit('ROOM:NEW_MESSAGE', {
      roomId: id,
      userName: userName,
      text: textareaRef.current.value
    });
    textareaRef.current.value = "";
  }

  React.useLayoutEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);
  
  return (
   <div className="shadow-xl flex flex-col flex-1 relative media-container" >
      <div className="py-3 px-4 bg-gray-200 flex justify-between items-center">
        <BsPeopleFill onClick={() => setSidebar(prev => !prev)} size={20} cursor={'pointer'} />
        <span>
          <span className="font-bold">Room: </span>{id}
        </span>
        <ImExit onClick={() => window.location.reload()} size={20} color='crimson' cursor={'pointer'} />
      </div>

      <div className="flex h-full overflow-hidden">
        <div className={`overflow-y-auto overflow-x-hidden h-full border-y-2 border-white bg-gray-100 transition-max-w duration-500 ${sidebar ? "max-w-xs" : "max-w-0"}`}>
          <div className="px-3 mt-1 mb-3">
            <div className="p-2 whitespace-nowrap">
              <span className="font-bold">Users ({users.length})</span>
            </div>
            <div className="">
              {users.map((user, index) =>
              <div key={index} className="px-4 py-2 mt-2 bg-gray-200 rounded">
                {user}
              </div>
            )}
            </div>
          </div>
        </div>
        <div ref={chatRef} className={`flex-1 overflow-y-auto scroll-smooth`}>
          <div className="mb-3 mt-2">
            {messages.map(({ userName: author, text }, index) =>
              <Message key={index} userName={author} text={text} own={author === userName} />
            )}
          </div>
        </div>
      </div>

      <div className=" bottom-0 left-0 right-0 bg-white z-10">
        <div className="flex gap-3 p-3 border-t border-gray-200">
          <textarea
            ref={textareaRef}
            className="w-full border-none resize-none"
            type='text'
            placeholder='Write a message...'
          />
          <button
            onClick={onSend}
            className="px-3 w-10 h-10 rounded-lg bg-emerald-500 disabled:bg-emerald-600 active:bg-emerald-600 text-white self-center">
            <IoMdSend size={19} />
          </button>
        </div>
      </div>
    </div>
  )
}
