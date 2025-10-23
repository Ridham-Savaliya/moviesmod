import { useEffect, useState } from 'react';

const AdUnit = ({ slot, format = 'auto', style, className }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // Don't render anything on server-side to prevent hydration errors
  if (!isMounted) {
    return (
      <div className={`${className} min-h-[100px]`} />
    );
  }

  if (!clientId) {
    // Show placeholder in development
    return (
      <div className={`bg-gray-800 border border-dashed border-gray-600 rounded p-4 text-center text-gray-400 ${className}`}>
        <p className="text-sm">Ad Placement</p>
        <p className="text-xs mt-1">Configure NEXT_PUBLIC_ADSENSE_CLIENT_ID</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdUnit;
