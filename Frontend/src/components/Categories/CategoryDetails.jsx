import React from "react";
import { useParams } from "react-router-dom";
import { data } from "./data";  // Import your data

export default function CategoryDetails() {
  const { categoryId } = useParams();  // Capture the category ID from URL params
  const category = data.find((cat) => cat.category_id === parseInt(categoryId));

  if (!category) return <p>Category not found!</p>;

  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
          <p className="mt-4 text-lg text-gray-600">{category.description}</p>

          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
            {category.services.map((service, index) => (
              <div key={index} className="group relative">
                <div className="relative h-60 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <img
                    src={`/images/${service.image}`}  // Assuming the images are in the public/images folder
                    alt={service.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <h3 className="mt-6 text-sm text-gray-500">{service.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
