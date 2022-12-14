import React, { useState } from 'react';

export const SearchBar = ({ search, setSearch }) => {
  return (
    <form className='px-4 py-2'>
      <div className='bg-gray-700 w-full flex rounded-lg '>
        <button type='submit' className='py-2 px-3'>
          <svg
            aria-hidden='true'
            className='w-5 h-5 text-gray-100'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            ></path>
          </svg>
        </button>
        <input
          type='search'
          className='bg-transparent w-full outline-none'
          placeholder='Search...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          required
        />
      </div>
    </form>
  );
};
