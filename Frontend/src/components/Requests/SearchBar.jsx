import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [recentlyAdded, setRecentlyAdded] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      searchTerm,
      city,
      category,
      priceRange,
      recentlyAdded,
    });
  };

  return (
    <header className="bg-gray-100 border-b border-gray-300 py-1.5 px-2.5 w-full">
      <nav className="flex items-center justify-between">
        <div className="flex items-center w-full flex-wrap lg:flex-nowrap">
          {/* Logo */}
          <div className="mr-4">
            <h1 className="text-xl font-bold text-gray-800">
              Service<span className="text-blue-500">Provider</span>
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-grow mt-2 lg:mt-0">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-center">
              <input
                type="text"
                placeholder="Search person by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow py-1.5 px-2.5 text-sm border border-gray-300 lg:border-r-0 rounded-md lg:rounded-l-md lg:rounded-r-none placeholder-gray-600 w-full mb-2 lg:mb-0"
              />
              <button
                type="submit"
                className="py-1.5 px-3 text-sm bg-blue-500 text-white border border-blue-500 rounded-md lg:rounded-l-none lg:rounded-r-md cursor-pointer hover:bg-blue-600 w-full lg:w-auto"
              >
                Search
              </button>
            </form>
          </div>

          {/* Search Options */}
          <div className="flex items-center flex-wrap mt-2 lg:mt-0 lg:ml-3">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-center">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mr-0 lg:mr-2 mb-2 lg:mb-0 py-1 px-2 text-xs border border-gray-300 rounded placeholder-gray-600 w-full lg:w-auto"
              >
                <option value="">Category</option>
                <option value="Tutor">Tutor</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Web Developer">Web Developer</option>
                <option value="Painter">Painter</option>
                <option value="Mechanic">Mechanic</option>
              </select>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mr-0 lg:mr-2 mb-2 lg:mb-0 py-1 px-2 text-xs border border-gray-300 rounded placeholder-gray-600 w-full lg:w-auto"
              />
              <input
                type="number"
                placeholder="Min price"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                className="mr-0 lg:mr-2 mb-2 lg:mb-0 py-1 px-2 text-xs border border-gray-300 rounded placeholder-gray-600 w-full lg:w-auto"
              />
              <input
                type="number"
                placeholder="Max price"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                className="mr-0 lg:mr-2 mb-2 lg:mb-0 py-1 px-2 text-xs border border-gray-300 rounded placeholder-gray-600 w-full lg:w-auto"
              />
              <input
                type="date"
                value={recentlyAdded}
                onChange={(e) => setRecentlyAdded(e.target.value)}
                className="mr-0 mb-2 lg:mb-0 py-1 px-2 text-xs border border-gray-300 rounded placeholder-gray-600 w-full lg:w-auto"
              />
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default SearchBar;
