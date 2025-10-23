import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { feedbackAPI } from '@/lib/api';
import { toast } from 'react-toastify';

const FeedbackForm = ({ movieId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    comment: '',
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      const response = await feedbackAPI.submit({
        ...formData,
        movie: movieId,
      });

      if (response.data.success) {
        toast.success('Feedback submitted successfully! It will be visible after approval.');
        setFormData({ name: '', email: '', rating: 0, comment: '' });
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit feedback';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-100 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Leave Your Feedback</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full bg-dark-200 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-2">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full bg-dark-200 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="your@email.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Rating *</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <FiStar
                  size={28}
                  className={`${
                    star <= (hoveredRating || formData.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-400'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Comment *</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            required
            rows={4}
            minLength={10}
            maxLength={1000}
            className="w-full bg-dark-200 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            placeholder="Share your thoughts about this movie..."
          />
          <p className="text-gray-400 text-xs mt-1">
            {formData.comment.length}/1000 characters (minimum 10)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
