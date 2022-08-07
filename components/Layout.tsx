import React from 'react';

import { useAuth } from '@lib/auth';
import Sidebar from './Sidebar';
import Login from './Login';

const Layout = ({ children }) => {
  const auth = useAuth();

  if (!auth.user && !auth.loading) return <Login />;

  return (
    auth.user && (
      <div className='flex h-screen overflow-hidden bg-gray-800 text-gray-50'>
        <Sidebar />
        {auth.loading ? <div>Loading...</div> : children}
      </div>
    )
  );
};

export default Layout;
