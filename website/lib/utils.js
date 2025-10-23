// Utility functions

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getImageUrl = (path) => {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}${path}`;
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const getQualityColor = (quality) => {
  const colors = {
    'CAM': 'bg-red-500',
    'HDRip': 'bg-blue-500',
    'BluRay': 'bg-green-500',
    'WEB-DL': 'bg-purple-500',
    '4K': 'bg-yellow-500',
  };
  return colors[quality] || 'bg-gray-500';
};

export const getRatingColor = (rating) => {
  if (rating >= 8) return 'text-green-500';
  if (rating >= 6) return 'text-yellow-500';
  return 'text-red-500';
};

export const formatViews = (views) => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + 'M';
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  }
  return views.toString();
};
