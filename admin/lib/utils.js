// Utility functions for admin panel

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getImageUrl = (path) => {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const baseUrl = apiUrl.replace('/api', '');
  return `${baseUrl}${path}`;
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const getStatusColor = (status) => {
  const colors = {
    published: 'bg-green-500',
    draft: 'bg-yellow-500',
    archived: 'bg-gray-500',
    approved: 'bg-green-500',
    pending: 'bg-yellow-500',
    rejected: 'bg-red-500',
  };
  return colors[status] || 'bg-gray-500';
};

export const getRoleColor = (role) => {
  const colors = {
    admin: 'bg-red-500',
    editor: 'bg-blue-500',
    moderator: 'bg-green-500',
  };
  return colors[role] || 'bg-gray-500';
};
