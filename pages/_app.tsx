import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '@lib/auth';
import Layout from '@components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;