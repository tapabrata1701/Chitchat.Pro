import React, { useState } from 'react';
import { FiPaperclip, FiSend } from 'react-icons/fi';
import { BsMicFill } from 'react-icons/bs';

const MessageInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSend} className="flex items-center space-x-4 p-2 bg-white rounded-xl">
      <button type="button" className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
        <FiPaperclip className="text-gray-500 text-xl" />
      </button>
      <button type="button" className="p-3 rounded-full hover:bg-gray-100 cursor-pointer">
        <BsMicFill className="text-gray-500 text-xl" />
      </button>
      <input
        type="text"
        placeholder="Type a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 bg-transparent focus:outline-none "
      />
      <button
        type="submit"
        className="p-3 rounded-full text-black cursor-pointer"
      >
        <FiSend className="text-xl" />
      </button>
    </form>
  );
};

export default MessageInput;