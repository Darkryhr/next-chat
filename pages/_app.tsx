import React, { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '@lib/auth';
import Layout from '@components/Layout';
import Loader from '@components/Loader';

function MyApp({ Component, pageProps, router }: AppProps) {
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => {
      document.body.style.overflow = 'hidden';
      setPageLoading(true);
    };

    const handleComplete = () => {
      document.body.style.overflow = '';
      setPageLoading(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
  }, [router]);

  return (
    <AuthProvider>
      <Layout>
        {pageLoading ? (
          <div className='flex items-center justify-center w-full h-screen absolute bg-gray-800'>
            <Loader />
          </div>
        ) : (
          <Component {...pageProps} />
        )}
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
