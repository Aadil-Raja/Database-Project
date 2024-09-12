import React, { useState } from 'react';
import './SearchBar.css'; // Separate CSS file

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
    <header className="header">
      <nav className="nav">
        <div className="nav-container">
          <div className="logo">
            <h1 className="logo-text">
              Service<span className="logo-highlight">Provider</span>
            </h1>
          </div>
          <div className="search-bar-container">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search person by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar-input"
              />
              <button type="submit" className="search-bar-button">
                Search
              </button>
            </form>
          </div>
          <div className="search-options">
            <form onSubmit={handleSearch}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="search-option-input"
              >
                <option value="">Category</option>
                <option value="Tutor">Tutor</option>
                <option value="Plumber">Plumber</option>
                <option value="Electrician">Electrician</option>
                <option value="Web Developer">Web Developer</option>
                <option value="Painter">Painter</option>
                <option value="Mechanic">Mechanic</option>
                {/* Add more categories as needed */}
              </select>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="search-option-input"
              />
              <input
                type="number"
                placeholder="Min price"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, min: e.target.value })
                }
                className="search-option-input"
              />
              <input
                type="number"
                placeholder="Max price"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ ...priceRange, max: e.target.value })
                }
                className="search-option-input"
              />
              <input
                type="date"
                value={recentlyAdded}
                onChange={(e) => setRecentlyAdded(e.target.value)}
                className="search-option-input"
              />
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default SearchBar;
