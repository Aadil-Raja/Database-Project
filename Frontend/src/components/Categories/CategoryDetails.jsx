import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";  // Import axios to make API calls

export default function CategoryDetails() {
  const { categoryId } = useParams();  // Capture the category ID from URL params
  const [category, setCategory] = useState(null);  // State to store the category data
  const [services, setServices] = useState([]);  // State to store services for the category

  // Fetch category details and services by category ID
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        // Fetch category details separately
        const categoryResponse = await axios.get(`http://localhost:3000/categories/${categoryId}`);
        setCategory(categoryResponse.data);

        // Fetch services separately
        const servicesResponse = await axios.get(`http://localhost:3000/services/${categoryId}`);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error("Error fetching category or services:", error);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);
  if (!category) return <p></p>;

  return (
    <>
      {category.status === 'active' && (  // Check if the category is active
        <div className="bg-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
              <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
              <p className="mt-4 text-lg text-gray-600">{category.description}</p>
  
              <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
                {services
                  .filter(service => service.status === 'active')  // Filter active services
                  .map((service, index) => (
                    <div key={index} className="group relative">
                      <div className="relative h-60 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                        <img
                          src={`/images/${service.image}`}  // Assuming the images are in the public/images folder
                          alt={service.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <h3 className="mt-6 text-sm text-gray-500">
                      <Link to={`/categories/${service.service_id}/servicerequestform`}>
                      <span className="absolute inset-0" />
                      {service.name}
                    </Link></h3>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
  
}
