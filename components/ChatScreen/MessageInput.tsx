import React, { useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { newMessage } from '@lib/db';

export const MessageInput = ({ user, chatId, bottomRef }) => {
  const [input, setInput] = useState('');

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const sendMessage = async e => {
    e.preventDefault();
    try {
      await newMessage(user.uid, chatId, input, user.email);
      setInput('');
      scrollToBottom();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        className='flex p-4 items-center justify-between bottom-0 left-0 w-full sm:sticky fixed bg-gray-800 border-t border-gray-400'
        onSubmit={sendMessage}
      >
        <input
          type='text'
          placeholder='Type a message'
          className='p-2 rounded w-full bg-gray-700 transition-all ease outline-none focus:ring-1 focus:ring-green-500  focus:border-green-500'
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        {input && (
          <button
            type='submit'
            className='p-1 rounded-full ml-5 transition-all ease-in'
          >
            <AiOutlineSend className='text-green-500' size={24} />
          </button>
        )}
      </form>
    </>
  );
};
