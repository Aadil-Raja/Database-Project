import React from 'react';
import './SearchResults.css'; // Import any CSS styles if needed

const SearchResults = ({ data }) => {
  return (
    <div className="search-results">
      {data.length > 0 ? (
        data.map((item) => (
          <div key={item.id} className="result-item">
            <h2 className="result-name">{item.name}</h2>
            <p className="result-city">City: {item.city}</p>
            <p className="result-price-range">Price Range: {item.priceRange}</p>
            <p className="result-category">Category: {item.category}</p>
            <p className="result-country">Country: {item.country}</p>
            <p className="result-date">Recently Added: {new Date(item.recentlyAdded).toLocaleDateString()}</p>
          </div>
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResults;
