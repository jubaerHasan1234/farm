"use client";
import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import Message from "./Message";

const ProductCreateAndEdit = ({
  product = null,
  onSave,
  onCancel,
  loading,
  error,
  success,
}) => {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    description: "",
    price: "",
    unit: "",
    stock: "",
    farmLocation: "",
    harvestDate: "",
    features: [],
  });

  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const isEditMode = Boolean(product);

  // Initialize form data when product prop changes (for edit mode)
  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || "",
        category: product.category || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        unit: product.unit || "",
        stock: product.stock?.toString() || "",
        farmLocation: product.farmLocation || "",
        harvestDate: product.harvestDate || "",
        features: product.features || [],
      });

      // Set existing images for edit mode
      if (product.images) {
        const existingImages = product.images.map((img, index) => ({
          id: `existing-${index}`,
          preview: img.url || img.preview || img,
          name: img.name || `Image ${index + 1}`,
          isExisting: true,
          originalUrl: img.url || img.preview || img,
        }));
        setImages(existingImages);
      }
    }
  }, [product]);

  const categories = [
    { value: "vegetables", label: "Vegetables" },
    { value: "fruits", label: "Fruits" },
    { value: "grains", label: "Grains" },
    { value: "dairy", label: "Dairy" },
    { value: "herbs", label: "Herbs" },
    { value: "honey", label: "Honey" },
  ];

  const units = [
    { value: "kg", label: "Kilogram (kg)" },
    { value: "lbs", label: "Pounds (lbs)" },
    { value: "piece", label: "Piece" },
    { value: "liter", label: "Liter" },
    { value: "dozen", label: "Dozen" },
    { value: "bundle", label: "Bundle" },
  ];

  const features = [
    "organic",
    "pesticide-free",
    "fresh",
    "non-gmo",
    "local",
    "sustainable",
    "fair-trade",
    "gluten-free",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFeatureChange = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));

    // Clear features error when user selects a feature
    if (errors.features) {
      setErrors((prev) => ({
        ...prev,
        features: "",
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        images: "Maximum 5 images allowed",
      }));
      return;
    }

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setErrors((prev) => ({
          ...prev,
          images: "Each image must be less than 10MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            file: file,
            preview: event.target.result,
            name: file.name,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    // Clear images error
    if (errors.images) {
      setErrors((prev) => ({
        ...prev,
        images: "",
      }));
    }
  };

  const removeImage = (imageId) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productName.trim())
      newErrors.productName = "Product name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.stock || parseInt(formData.stock) < 0)
      newErrors.stock = "Valid stock quantity is required";
    if (!formData.farmLocation.trim())
      newErrors.farmLocation = "Farm location is required";
    if (!formData.harvestDate)
      newErrors.harvestDate = "Harvest date is required";
    if (formData.features.length === 0)
      newErrors.features = "At least one product feature is required";
    if (images.length === 0) newErrors.images = "At least 1 image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const productData = {
        ...formData,
        images: images.map((img) => ({
          name: img.name,
          base64: img.preview,
        })),
        id: product?.id || Date.now(), // Use existing ID for edit, generate new for create
      };

      // Call onSave callback if provided
      if (onSave) {
        if (isEditMode) {
          productData._id = product._id;
          productData.createdBy = product.createdBy;

          productData.activeStatus = product.activeStatus;
        }
        onSave(productData);
      } else {
        console.log(productData);

        alert(`Product ${isEditMode ? "updated" : "created"} successfully!`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? "Edit Product" : "Add New Product"}
        </h1>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* Basic Information */}
        <div>
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
                value={formData.productName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.productName
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="e.g., Organic Tomatoes"
              />
              {errors.productName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.productName}
                </p>
              )}
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
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.category
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
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
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="Describe your product, growing methods, quality, etc."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div>
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
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.price
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="45.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
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
                value={formData.unit}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.unit
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="">Select Unit</option>
                {units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <p className="mt-1 text-sm text-red-600">{errors.unit}</p>
              )}
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
                value={formData.stock}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.stock
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="100"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
              )}
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Product Images
          </h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Upload Images (1-5 images required) *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-green-500 transition cursor-pointer ${
                  errors.images
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={images.length >= 5}
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {images.length >= 5
                      ? "Maximum images reached"
                      : "Click to upload images"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB each ({images.length}/5)
                  </p>
                </label>
              </div>
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
              )}

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {image.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Farm Information */}
        <div>
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
                value={formData.farmLocation}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.farmLocation
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                placeholder="e.g., Sylhet, Bangladesh"
              />
              {errors.farmLocation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.farmLocation}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="harvestDate"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Harvest Date *
              </label>
              <input
                type="date"
                id="harvestDate"
                name="harvestDate"
                // value={formData.harvestDate}
                value={
                  formData.harvestDate
                    ? new Date(formData.harvestDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  errors.harvestDate
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.harvestDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.harvestDate}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Product Features */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Product Features *
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature) => (
              <label
                key={feature}
                className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  errors.features
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.features.includes(feature)}
                  onChange={() => handleFeatureChange(feature)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm capitalize">
                  {feature.replace("-", " ")}
                </span>
              </label>
            ))}
          </div>
          {errors.features && (
            <p className="mt-1 text-sm text-red-600">{errors.features}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
            onClick={handleSubmit}
            disabled={loading}
          >
            {isEditMode ? "Update Product" : "Add Product"}
            {loading && "..."}
          </button>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      <Message type="success" message={success} />
    </div>
  );
};

export default ProductCreateAndEdit;
