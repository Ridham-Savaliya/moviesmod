import { useEffect, useState } from 'react';
import { adSlotsAPI } from '@/lib/api';

const AdSlotRenderer = ({ position, className = '' }) => {
  const [adSlots, setAdSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdSlots = async () => {
      try {
        setLoading(true);
        const response = await adSlotsAPI.getByPosition(position);
        
        if (response.data.success) {
          setAdSlots(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching ad slots:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (position) {
      fetchAdSlots();
    }
  }, [position]);

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-[100px] bg-gray-800 animate-pulse rounded ${className}`} />
    );
  }

  // Error or no ads
  if (error || adSlots.length === 0) {
    return null; // Don't show anything if no ads or error
  }

  // Render all active ad slots for this position
  return (
    <div className={className}>
      {adSlots.map((slot, index) => (
        <div
          key={index}
          className="ad-slot-container"
          style={slot.dimensions ? { 
            width: slot.dimensions.width, 
            height: slot.dimensions.height 
          } : {}}
          dangerouslySetInnerHTML={{ __html: slot.adCode }}
        />
      ))}
    </div>
  );
};

export default AdSlotRenderer;
