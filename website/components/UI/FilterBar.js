import { useState } from 'react';
import Select from 'react-select';

const FilterBar = ({ onFilterChange, categories }) => {
  const [filters, setFilters] = useState({
    category: null,
    genre: null,
    year: null,
    quality: null,
    sort: 'latest',
  });

  const genreOptions = [
    { value: 'Action', label: 'Action' },
    { value: 'Comedy', label: 'Comedy' },
    { value: 'Drama', label: 'Drama' },
    { value: 'Horror', label: 'Horror' },
    { value: 'Romance', label: 'Romance' },
    { value: 'Thriller', label: 'Thriller' },
    { value: 'Sci-Fi', label: 'Sci-Fi' },
    { value: 'Adventure', label: 'Adventure' },
  ];

  const qualityOptions = [
    { value: 'CAM', label: 'CAM' },
    { value: 'HDRip', label: 'HDRip' },
    { value: 'BluRay', label: 'BluRay' },
    { value: 'WEB-DL', label: 'WEB-DL' },
    { value: '4K', label: '4K' },
  ];

  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'title', label: 'Title (A-Z)' },
  ];

  const categoryOptions = categories?.map((cat) => ({
    value: cat.slug,
    label: cat.name,
  })) || [];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: '#27272a',
      borderColor: '#3f3f46',
      '&:hover': { borderColor: '#0ea5e9' },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#27272a',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? '#3f3f46' : '#27272a',
      color: '#fff',
      '&:hover': { backgroundColor: '#3f3f46' },
    }),
    singleValue: (base) => ({
      ...base,
      color: '#fff',
    }),
    input: (base) => ({
      ...base,
      color: '#fff',
    }),
  };

  return (
    <div className="bg-dark-100 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Category</label>
          <Select
            options={categoryOptions}
            value={filters.category}
            onChange={(value) => handleFilterChange('category', value)}
            isClearable
            placeholder="All Categories"
            styles={customStyles}
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Genre</label>
          <Select
            options={genreOptions}
            value={filters.genre}
            onChange={(value) => handleFilterChange('genre', value)}
            isClearable
            placeholder="All Genres"
            styles={customStyles}
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Year</label>
          <Select
            options={yearOptions}
            value={filters.year}
            onChange={(value) => handleFilterChange('year', value)}
            isClearable
            placeholder="All Years"
            styles={customStyles}
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Quality</label>
          <Select
            options={qualityOptions}
            value={filters.quality}
            onChange={(value) => handleFilterChange('quality', value)}
            isClearable
            placeholder="All Qualities"
            styles={customStyles}
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-2">Sort By</label>
          <Select
            options={sortOptions}
            value={sortOptions.find((opt) => opt.value === filters.sort)}
            onChange={(value) => handleFilterChange('sort', value?.value || 'latest')}
            placeholder="Sort By"
            styles={customStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
