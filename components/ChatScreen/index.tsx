import React, { useEffect, useRef } from 'react';

const ChatScreen = ({ children, name }) => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.scrollTop = ref?.current?.scrollHeight;
  });
  return (
    <>
      <div
        ref={ref}
        className='box-border overflow-y-scroll w-full h-full flex flex-col pb-[144px]'
      >
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
