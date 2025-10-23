import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 bg-dark-100 text-white rounded hover:bg-dark-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <FiChevronLeft size={20} />
      </button>

      {/* First Page */}
      {currentPage > 3 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-4 py-2 bg-dark-100 text-white rounded hover:bg-dark-200 transition-colors"
          >
            1
          </button>
          {currentPage > 4 && <span className="text-gray-400">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded transition-colors ${
            page === currentPage
              ? 'bg-primary-500 text-white font-semibold'
              : 'bg-dark-100 text-white hover:bg-dark-200'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && <span className="text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 bg-dark-100 text-white rounded hover:bg-dark-200 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 bg-dark-100 text-white rounded hover:bg-dark-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
