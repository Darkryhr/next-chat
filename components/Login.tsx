import React from 'react';
import { BsWhatsapp } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@lib/auth';

const Login = () => {
  const auth = useAuth();

  return (
    <div className='flex flex-col w-full h-screen items-center justify-center bg-gray-800'>
      <BsWhatsapp size={200} className='fill-green-500' />
      <button
        className='mt-10 font-semibold text-black bg-white py-2 px-4 rounded flex  items-center border border-gray-100 transition hover:bg-gray-50'
        onClick={() => auth.signinWithGoogle()}
      >
        <FcGoogle size={22} className='mr-3' />
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
