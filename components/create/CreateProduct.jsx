"use client";

import { useState } from "react";

export default function CreateProduct() {
  const [previewImages, setPreviewImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(imagePreviews);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary-600 text-white px-8 py-6">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-primary-100 mt-2">
            Share your fresh produce with customers
          </p>
        </div>

        {/* Form */}
        <form
          className="p-8 space-y-8"
          method="POST"
          encType="multipart/form-data"
        >
          {/* Basic Info */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Organic Tomatoes"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Category</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains</option>
                  <option value="dairy">Dairy</option>
                  <option value="herbs">Herbs</option>
                  <option value="honey">Honey</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe your product, growing methods, quality, etc."
                />
              </div>
            </div>
          </section>

          {/* Pricing & Inventory */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Pricing & Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Price per Unit (৳) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="45.00"
                />
              </div>

              <div>
                <label
                  htmlFor="unit"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Unit *
                </label>
                <select
                  id="unit"
                  name="unit"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Unit</option>
                  <option value="kg">Kilogram</option>
                  <option value="lbs">Pounds</option>
                  <option value="piece">Piece</option>
                  <option value="liter">Liter</option>
                  <option value="dozen">Dozen</option>
                  <option value="bundle">Bundle</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Available Stock *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="100"
                />
              </div>
            </div>
          </section>

          {/* Product Images */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Product Images
            </h2>
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Upload Images (Max 5 images) *
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 transition">
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label htmlFor="images" className="cursor-pointer block">
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Click to upload images
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </label>
              </div>

              {previewImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {previewImages.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`preview-${index}`}
                      className="rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Farm Information */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Farm Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="farmLocation"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Farm Location *
                </label>
                <input
                  type="text"
                  id="farmLocation"
                  name="farmLocation"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Sylhet, Bangladesh"
                />
              </div>

              <div>
                <label
                  htmlFor="harvestDate"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Harvest Date
                </label>
                <input
                  type="date"
                  id="harvestDate"
                  name="harvestDate"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </section>

          {/* Product Features */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Product Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "Organic",
                "Pesticide Free",
                "Fresh",
                "Non-GMO",
                "Local",
                "Sustainable",
                "Fair Trade",
                "Gluten-Free",
              ].map((feature) => (
                <label
                  key={feature}
                  className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <input
                    type="checkbox"
                    name="features[]"
                    value={feature.toLowerCase().replace(/ /g, "-")}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm">{feature}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
