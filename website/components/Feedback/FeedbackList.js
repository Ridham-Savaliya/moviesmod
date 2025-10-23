import { useState, useEffect } from 'react';
import { FiStar, FiUser } from 'react-icons/fi';
import { feedbackAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const FeedbackList = ({ movieId }) => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFeedback();
  }, [movieId, page]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await feedbackAPI.getByMovie(movieId, page, 10);
      if (response.data.success) {
        setFeedback(response.data.data);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-dark-100 rounded-lg p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-dark-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-dark-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-dark-200 rounded w-24"></div>
              </div>
            </div>
            <div className="h-3 bg-dark-200 rounded mb-2"></div>
            <div className="h-3 bg-dark-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (feedback.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No feedback yet. Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedback.map((item) => (
        <div key={item._id} className="bg-dark-100 rounded-lg p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                <FiUser className="text-primary-500" size={20} />
              </div>
              <div>
                <h4 className="text-white font-semibold">{item.name}</h4>
                <p className="text-gray-400 text-xs">{formatDate(item.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={16}
                  className={`${
                    i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <p className="text-gray-300 leading-relaxed">{item.comment}</p>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-dark-100 text-white rounded hover:bg-dark-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 bg-dark-100 text-white rounded">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-dark-100 text-white rounded hover:bg-dark-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
