import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { categoriesAPI } from '@/lib/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children, title, description, keywords, ogImage }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'MoviesHub';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const defaultDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 
    'Watch and download latest movies in HD quality';

  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const pageDescription = description || defaultDescription;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {keywords && <meta name="keywords" content={keywords} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={siteUrl} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen bg-black">
        <Header categories={categories} />
        
        <main className="flex-1 pt-[180px]">
          {children}
        </main>
        
        <Footer categories={categories} />
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default Layout;
