import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Don't show layout on login page
  if (router.pathname === '/login') {
    return (
      <>
        <Head>
          <title>{title ? `${title} | Admin` : 'Admin Panel'}</title>
        </Head>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return null;
  }

  return (
    <>
      <Head>
        <title>{title ? `${title} | Admin` : 'Admin Panel'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="flex h-screen bg-gray-100">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
          <Header toggleSidebar={toggleSidebar} />
          
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Layout;
