import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar.jsx';
import SearchResults from './SearchResults.jsx';
//import {data} from './data'; // Import your data

const Final = () => {
  //const [searchResults, setSearchResults] = useState(data);

  const handleSearch = (filters) => {
    const filteredData = data.filter((item) => {
      return (
        (!filters.searchTerm || item.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
        (!filters.city || item.city.toLowerCase().includes(filters.city.toLowerCase())) &&
        (!filters.category || item.category === filters.category) &&
        (!filters.priceRange.min || parseInt(item.priceRange.split('-')[0].replace('$', '').replace(',', '')) >= parseInt(filters.priceRange.min)) &&
        (!filters.priceRange.max || parseInt(item.priceRange.split('-')[1].replace('$', '').replace(',', '')) <= parseInt(filters.priceRange.max)) &&
        (!filters.recentlyAdded || new Date(item.recentlyAdded) >= new Date(filters.recentlyAdded))
      );
    });
    setSearchResults(filteredData);
  };

  useEffect(() => {
    // Optionally, you could initialize or fetch data here
   // console.log(data)
  }, []);

  return (
    <div className="App">
     <SearchBar onSearch={handleSearch} /> 
    
      <SearchResults /*data={searchResults} *//>
    </div>
  );
};

export default Final;
