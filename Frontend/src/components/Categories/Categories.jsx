import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";  // Import axios to make API calls

export default function Categories() {
  const [categories, setCategories] = useState([]);  // State to store categories

  // Fetch categories from backend on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("${VITE_BACKEND_URL}/categories");  // Call your API
        setCategories(response.data);  // Set the fetched categories to state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="bg-gray-100" >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div  className=" max-w-2xl mx-auto py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="  mt-35 text-2xl font-bold text-gray-900">Collections</h2>
  
          <div className=" pt-96 mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
            {/* Filter categories by status === 'active' */}
            {categories
              .filter((category) => category.status === 'active')  // Only active categories
              .map((category) => (
                <div key={category.category_id} className="group relative">
                  <div className="relative h-60 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <img
  src={`${VITE_BACKEND_URL}/images/${category.name.toLowerCase().replace(/ /g, '-')}.jpg`} 
  alt={category.name}
  className="h-full w-full object-cover object-center"
/>

                 

                  </div>
                  <h3 className="mt-6 text-sm text-gray-500">
                    <Link to={`/categories/${category.category_id}`}>
                      <span className="absolute inset-0" />
                      {category.name}
                    </Link>
                  </h3>
                  <p className="text-base font-semibold text-gray-900">{category.description}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
  
}
