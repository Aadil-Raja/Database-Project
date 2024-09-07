import React, { useState } from "react";
import "./ServicePage.css";

const ServicePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Dummy data for service providers
  const serviceProviders = [
    { name: "Fabtechsol", service: "Web Application", rating: 4.9, reviews: 191 },
    { name: "Tasleem K", service: "HTML Parser & Scraping", rating: 4.8, reviews: 19 },
    { name: "Anas Mustafa", service: "Web Scraping", rating: 5.0, reviews: 12 },
    { name: "Muneeb A", service: "Image Processing with Python", rating: 4.8, reviews: 117 },
  ];

  const categories = [
    "Web Application",
    "Scripting",
    "Desktop Applications",
    "API & Integrations",
    "Bug Fixes"
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const filteredServiceProviders = serviceProviders.filter(provider =>
    (provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.service.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedCategory === "" || provider.service.includes(selectedCategory))
  );

  return (
    <div className="service-page-container">
      <h2>Find the Service You Need</h2>


      <div className="categories">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`category-button ${selectedCategory === category ? 'selected' : ''}`}
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="service-providers-list">
        <h3>Available Service Providers</h3>
        <div className="providers-grid">
          {filteredServiceProviders.map((provider, index) => (
            <div className="provider-card" key={index}>
              <div className="provider-info">
                <h4>{provider.name}</h4>
                <p>{provider.service}</p>
                <p>Rating: {provider.rating} ⭐ ({provider.reviews} reviews)</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
