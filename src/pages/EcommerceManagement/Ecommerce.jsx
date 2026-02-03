/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../components/Atoms/TableData/TableData";
import {
  commerceProductsList,
  createCommerceProducts,
  updateCommerceProducts,
  deleteCommerceProducts,
  commerceCategoriesAllDocuments,
} from "../../redux/slices/commerce";
import axios from "axios";
import { apiUrl } from "../../utils/axiosProvider";
import { toast } from "react-toastify";

const ProductModal = ({
  isOpen,
  onClose,
  onSave,
  productData,
  categories,
  isEditing,
  loading,
}) => {
  const [formData, setFormData] = useState({
    productName: "",
    productCategory: "",
    mrp: "",
    sellingPrice: "",
    discount: "",
    description: "",
    images: [],
  });
  
  useEffect(() => {
  if (productData) {
    setFormData({
      productName: productData.name || "",
      productCategory: productData.category || "",
      mrp: productData.mrp?.toString() || "",
      sellingPrice: productData.sellingPrice?.toString() || "",
      discount: productData.discount?.toString() || "",
      description: productData.description || "",
      images: Array.isArray(productData.image) ? productData.image : []
    });
  } else {
    setFormData({
      productName: "",
      productCategory: "",
      mrp: "",
      sellingPrice: "",
      discount: "",
      description: "",
      images: [] // ✅
    });
  }
}, [productData]);

  const handleImageUpload = async (file) => {
    const uploadData = new FormData();
    uploadData.append("files", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${apiUrl}/files/upload`, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.data) {
        setFormData((prev) => ({
          ...prev,
          images: res.data.data,
        }));
      }
    } catch (err) {
      toast.error(err || "Image upload failed");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (
      (name === "mrp" || name === "sellingPrice") &&
      formData.mrp &&
      formData.sellingPrice
    ) {
      const mrp = parseFloat(name === "mrp" ? value : formData.mrp);
      const sellingPrice = parseFloat(
        name === "sellingPrice" ? value : formData.sellingPrice,
      );
      if (mrp > 0 && sellingPrice > 0) {
        const discount = ((mrp - sellingPrice) / mrp) * 100;
        setFormData((prev) => ({
          ...prev,
          discount: discount.toFixed(2),
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.productName ||
      !formData.productCategory ||
      !formData.mrp ||
      !formData.sellingPrice
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate prices
    const mrp = parseFloat(formData.mrp);
    const sellingPrice = parseFloat(formData.sellingPrice);

    if (isNaN(mrp) || mrp <= 0) {
      alert("Please enter a valid MRP");
      return;
    }

    if (isNaN(sellingPrice) || sellingPrice <= 0) {
      alert("Please enter a valid Selling Price");
      return;
    }

    if (sellingPrice > mrp) {
      alert("Selling Price cannot be greater than MRP");
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isEditing ? "Edit Product" : "Add Product"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                  required
                />
              </div>

              {/* Product Category */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Product Category
                </label>
                <select
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">MRP</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="mrp"
                      value={formData.mrp}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Selling Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="sellingPrice"
                      value={formData.sellingPrice}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Discount %</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      step="0.01"
                      min="0"
                      max="100"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  placeholder="Enter product description"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-gray-700 mb-2">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200">
                      <span className="text-gray-700">
                        {formData.images
                          ? formData.images.name
                          : "Choose Image"}
                      </span>
                      <span className="text-gray-500">📁</span>
                    </div>
                  </label>
                  <span className="text-gray-500 text-sm">
                    {formData.images ? "File selected" : "No file chosen"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Upload product image (JPG, PNG, GIF - Max 5MB)
                </p>
              </div> 
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Uploaded Product Image
                  </h4>
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={""}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div> 
            </div> 
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : isEditing
                    ? "Update Product"
                    : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Ecommerce = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
   const [filters, setFilters] = useState({
      search: ""
    });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const products = useSelector(
    (state) => state.commerce.commerceProductsListData?.data?.data?.list || [],
  );
    const productsTotal = useSelector(
    (state) => state.commerce.commerceProductsListData?.data?.data?.total || [],
  );
  const categories = useSelector(
    (state) =>
      state.commerce.commerceCategoriesAllDocumentsData?.data?.data?.list || [],
  );

  useEffect(() => {
    const params = {
      page: currentPage,
      size: itemsPerPage,
      ...(filters.search && { keyWord: filters.search }),
      searchFields: "name",
    };
    dispatch(commerceProductsList(params));
    dispatch(commerceCategoriesAllDocuments());
  }, [filters.search, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
     search: "",
    });
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditing(true);
    setShowModal(true);
  };


  const handleSaveProduct = (productData) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", productData.productName);
    formData.append("category", productData.productCategory);
    formData.append("mrp", productData.mrp);
    formData.append("sellingPrice", productData.sellingPrice);
    formData.append("discount", productData.discount);
    formData.append("description", productData.description); 
    formData.append(
  "image",
  JSON.stringify(
    Array.isArray(productData.images) ? productData.images : []
  )
);

    if (isEditing && selectedProduct) {
      formData.append("_id", selectedProduct._id);

      dispatch(updateCommerceProducts(formData))
        .then(() => {
          dispatch(
            commerceProductsList({ page: currentPage, size: itemsPerPage }),
          );
          setShowModal(false);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      dispatch(createCommerceProducts(formData))
        .then(() => {
          dispatch(
            commerceProductsList({ page: currentPage, size: itemsPerPage }),
          );
          setShowModal(false);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteCommerceProducts({ id: productId })).then(() => {
        dispatch(commerceProductsList());
      });
    }
  };

  const totalPages = Math.ceil(productsTotal / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);
 

  const tableHeaders = [
    "Product Image",
    "Product Name",
    "Product Category",
    "MRP",
    "Selling Price",
    "Discount %",
     "Actions",
  ];

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown Category";
  };

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <p className="text-gray-600 mt-2">
          Manage your e-commerce product catalog
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
         <div className="flex justify-between gap-4 w-full mb-6">
          <div>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search product name"
              className="w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> 
          <div className="flex gap-6">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
          >
            Reset
          </button>

          <button
            onClick={handleAddProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
            disabled={loading}
          >
            <span>+</span>
            <span>{loading ? "Processing..." : "Add Product"}</span>
          </button>
          </div>
        </div>

         <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
  data={currentProducts}
  currentPage={currentPage}
  totalPages={totalPages}
  handlePageChange={setCurrentPage}
            renderRow={(product, index) => (
              <tr
                key={product._id}
                className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="py-4 px-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    {product.image && product.image.length > 0 ? (
                      <img
                        src={product.image[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className=" text-gray-800 capitalize">
                    {product.name}
                  </div> 
                </td>
                <td className="py-4 px-4 capitalize">
                  {getCategoryName(product.category)}
                </td>
                <td className="py-4 px-4">
                  <div className="text-gray-700">
                    ₹{product.mrp?.toFixed(2) || "0.00"}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="text-lg text-green-600">
                      ₹{product.sellingPrice?.toFixed(2) || "0.00"}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col items-center text-green-600">
                    {product.discount || 0}% OFF
                  </div>
                </td> 
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewProduct(product)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg"
                      title="View Product"
                    >
                      <span className="text-xl">👁️</span>
                    </button>
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg"
                      title="Edit Product"
                    >
                      <span className="text-xl">✏️</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg"
                      title="Delete Product"
                    >
                      <span className="text-xl">🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div> 
      </div>

      <ProductModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
        productData={selectedProduct}
        categories={categories}
        isEditing={isEditing}
        loading={loading}
      />
    </div>
  );
};

export default Ecommerce;
