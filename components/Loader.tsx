import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const Loader = () => {
  return (
    <>
      <div className='flex flex-col items-center justify-center'>
        <AiOutlineLoading3Quarters
          className='animate-spin fill-green-400'
          size={30}
        />
        <p className='text-sm font-semibold mt-3 text-green-500'>Loading...</p>
      </div>
    </>
  );
};

export default Loader;
