import React from 'react';

const ChatScreen = ({ children, name }) => {
  return (
    <>
      <div className='box-border overflow-y-scroll w-full h-full flex flex-col pb-[144px]'>
        <div className='flex w-full sm:max-w-none max-w-[200px] mx-auto'>
          <span className='text-sm bg-gray-400 p-2 rounded mx-auto my-3 text-center'>
            This is the start of your conversation with {name}
          </span>
        </div>
        {children}
      </div>
    </>
  );
};

export default ChatScreen;
