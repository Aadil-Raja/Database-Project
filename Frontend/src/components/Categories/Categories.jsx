import React from "react";
import { Link } from "react-router-dom";
import { data } from "./data";  // Import your data

export default function Categories() {
  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-2xl font-bold text-gray-900">Collections</h2>

          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
            {data.map((category) => (
              <div key={category.category_id} className="group relative">
                <div className="relative h-60 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <img
                    src={`/images/${category.category.toLowerCase().replace(/ /g, "-")}.jpg`}  // Image per category
                    alt={category.category}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <h3 className="mt-6 text-sm text-gray-500">
                  <Link to={`/categories/${category.category_id}`}>
                    <span className="absolute inset-0" />
                    {category.category}
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
