import React from 'react';
import { RiChatSmile2Fill } from 'react-icons/ri';
import Logo from './Logo';

const LandingScreen = () => {
  return (
    <div className='bg-gray-800 grow sm:flex hidden w-full  justify-center items-center '>
      <div className='flex flex-col justify-center items-center space-y-3'>
        <Logo />
        <h1 className='text-4xl font-thin text-green-500'>Welcome to Octa</h1>
        <p className='text-center text-sm px-32 text-gray-200'>
          Id aliquip in quis dolore ipsum nisi nostrud laboris pariatur
          reprehenderit voluptate nostrud elit velit.
        </p>
      </div>
    </div>
  );
};

export default LandingScreen;
