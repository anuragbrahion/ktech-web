import React, { useEffect, useState } from 'react';
import Table from '../../components/Atoms/TableData/TableData';
const ProductModal = ({ isOpen, onClose, onSave, productData, isEditing }) => {
  const [formData, setFormData] = useState({
    productName: '',
    productCategory: '',
    mrp: '',
    sellingPrice: '',
    discount: '',
    description: '',
    imageFile: null
  });

  const [editorContent, setEditorContent] = useState('');

  const categories = [
    'Electronics',
    'Wearables',
    'Accessories',
    'Footwear',
    'Clothing',
    'Home & Kitchen',
    'Books',
    'Sports',
    'Beauty',
    'Toys'
  ];

  useEffect(() => {
    if (productData) {
      setFormData({
        productName: productData.productName || '',
        productCategory: productData.productCategory || '',
        mrp: productData.mrp?.toString() || '',
        sellingPrice: productData.sellingPrice?.toString() || '',
        discount: productData.discount?.toString() || '',
        description: productData.description || '',
        imageFile: null
      });
      setEditorContent(productData.description || '');
    } else {
      setFormData({
        productName: '',
        productCategory: '',
        mrp: '',
        sellingPrice: '',
        discount: '',
        description: '',
        imageFile: null
      });
      setEditorContent('');
    }
  }, [productData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate discount if MRP and Selling Price are provided
    if ((name === 'mrp' || name === 'sellingPrice') && formData.mrp && formData.sellingPrice) {
      const mrp = parseFloat(name === 'mrp' ? value : formData.mrp);
      const sellingPrice = parseFloat(name === 'sellingPrice' ? value : formData.sellingPrice);
      if (mrp > 0 && sellingPrice > 0) {
        const discount = ((mrp - sellingPrice) / mrp) * 100;
        setFormData(prev => ({
          ...prev,
          discount: discount.toFixed(2)
        }));
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.productName || !formData.productCategory || !formData.mrp || !formData.sellingPrice) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate prices
    const mrp = parseFloat(formData.mrp);
    const sellingPrice = parseFloat(formData.sellingPrice);
    
    if (isNaN(mrp) || mrp <= 0) {
      alert('Please enter a valid MRP');
      return;
    }
    
    if (isNaN(sellingPrice) || sellingPrice <= 0) {
      alert('Please enter a valid Selling Price');
      return;
    }
    
    if (sellingPrice > mrp) {
      alert('Selling Price cannot be greater than MRP');
      return;
    }

    // Calculate discount if not provided
    const discount = formData.discount 
      ? parseFloat(formData.discount) 
      : ((mrp - sellingPrice) / mrp) * 100;

    onSave({
      ...formData,
      mrp,
      sellingPrice,
      discount,
      description: editorContent || formData.description
    });
  };

  const editorButtons = [
    { label: 'B', title: 'Bold', tag: 'b' },
    { label: 'I', title: 'Italic', tag: 'i' },
    { label: 'U', title: 'Underline', tag: 'u' },
    { label: '%', title: 'Discount', tag: 'span' },
    { label: 'iE', title: 'Superscript', tag: 'sup' },
    { label: 'iE', title: 'Subscript', tag: 'sub' },
    { label: 'Ix', title: 'Strikethrough', tag: 's' },
  ];

  const formatText = (tag) => {
    const textarea = document.getElementById('description');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    
    let formattedText = '';
    switch(tag) {
      case 'b':
        formattedText = `<b>${selectedText}</b>`;
        break;
      case 'i':
        formattedText = `<i>${selectedText}</i>`;
        break;
      case 'u':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 's':
        formattedText = `<s>${selectedText}</s>`;
        break;
      case 'sup':
        formattedText = `<sup>${selectedText}</sup>`;
        break;
      case 'sub':
        formattedText = `<sub>${selectedText}</sub>`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = editorContent.substring(0, start) + formattedText + editorContent.substring(end);
    setEditorContent(newContent);
    setFormData(prev => ({ ...prev, description: newContent }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800"># Add/Edit Products:</h2>
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
                <label className="block text-gray-700 mb-2">Product Category</label>
                <select
                  name="productCategory"
                  value={formData.productCategory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">MRP</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
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
                  <label className="block text-gray-700 mb-2">Selling Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
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
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
              </div>

              {/* Description with Rich Text Editor */}
              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                
                {/* Editor Toolbar */}
                <div className="flex items-center gap-1 mb-2 p-2 bg-gray-100 rounded-t-md">
                  <span className="text-sm text-gray-600 mr-2">Normal</span>
                  {editorButtons.map((button, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => formatText(button.tag)}
                      className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 rounded text-sm font-medium"
                      title={button.title}
                    >
                      {button.label}
                    </button>
                  ))}
                </div>
                
                <textarea
                  id="description"
                  value={editorContent}
                  onChange={(e) => {
                    setEditorContent(e.target.value);
                    setFormData(prev => ({ ...prev, description: e.target.value }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  placeholder="Enter product description"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-gray-700 mb-2">File</label>
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
                        {formData.imageFile ? formData.imageFile.name : 'Choose Files'}
                      </span>
                      <span className="text-gray-500">📁</span>
                    </div>
                  </label>
                  <span className="text-gray-500 text-sm">
                    {formData.imageFile ? 'File selected' : 'No file chosen'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Upload product image (JPG, PNG, GIF - Max 5MB)
                </p>
              </div>

              {/* Preview Section (if editing) */}
              {productData && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Product</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                      <img 
                        src={productData.productImage} 
                        alt={productData.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{productData.productName}</p>
                      <p className="text-sm text-gray-600">{productData.productCategory}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-green-600 font-bold">₹{productData.sellingPrice.toFixed(2)}</span>
                        <span className="text-gray-500 text-sm line-through">₹{productData.mrp.toFixed(2)}</span>
                        <span className="text-red-600 text-sm font-medium">{productData.discount}% OFF</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                {isEditing ? 'Update Product' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Ecommerce = () => {
  const [products, setProducts] = useState([
    { 
      id: 1, 
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      productName: 'Wireless Bluetooth Headphones', 
      productCategory: 'Electronics', 
      productMap: true, 
      sellingPrice: 2499, 
      mrp: 2999, 
      discount: 16, 
      description: 'High-quality wireless headphones with noise cancellation feature',
      stock: 45,
      rating: 4.5
    },
    { 
      id: 2, 
      productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w-400&h=400&fit=crop',
      productName: 'Smart Watch Series 5', 
      productCategory: 'Wearables', 
      productMap: true, 
      sellingPrice: 12999, 
      mrp: 15999, 
      discount: 18, 
      description: 'Advanced smartwatch with health monitoring and GPS',
      stock: 28,
      rating: 4.7
    },
    { 
      id: 3, 
      productImage: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
      productName: 'Waterproof Fitness Tracker', 
      productCategory: 'Wearables', 
      productMap: false, 
      sellingPrice: 1999, 
      mrp: 2499, 
      discount: 20, 
      description: 'Water-resistant fitness band with heart rate monitor',
      stock: 75,
      rating: 4.3
    },
    { 
      id: 4, 
      productImage: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
      productName: 'Premium Laptop Backpack', 
      productCategory: 'Accessories', 
      productMap: true, 
      sellingPrice: 1499, 
      mrp: 1999, 
      discount: 25, 
      description: 'Durable laptop backpack with multiple compartments',
      stock: 60,
      rating: 4.6
    },
    { 
      id: 5, 
      productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      productName: 'Running Shoes Pro', 
      productCategory: 'Footwear', 
      productMap: true, 
      sellingPrice: 3299, 
      mrp: 4599, 
      discount: 28, 
      description: 'Comfortable running shoes with advanced cushioning',
      stock: 32,
      rating: 4.8
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filters, setFilters] = useState({
    productName: '',
    productCategory: '',
    priceRange: ''
  });

  // Filter handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      productName: '',
      productCategory: '',
      priceRange: ''
    });
  };

  // Action handlers
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
    if (isEditing && selectedProduct) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === selectedProduct.id 
          ? { 
              ...product, 
              ...productData,
              sellingPrice: parseFloat(productData.sellingPrice),
              mrp: parseFloat(productData.mrp),
              discount: parseFloat(productData.discount)
            }
          : product
      ));
    } else {
      // Add new product
      const newProduct = {
        id: products.length + 1,
        ...productData,
        sellingPrice: parseFloat(productData.sellingPrice),
        mrp: parseFloat(productData.mrp),
        discount: parseFloat(productData.discount),
        productMap: true,
        stock: 50,
        rating: 4.0,
        createdAt: new Date().toLocaleDateString('en-GB')
      };
      setProducts([...products, newProduct]);
    }
    setShowModal(false);
    setSelectedProduct(null);
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    return (
      (filters.productName === '' || product.productName.toLowerCase().includes(filters.productName.toLowerCase())) &&
      (filters.productCategory === '' || product.productCategory === filters.productCategory) &&
      (filters.priceRange === '' || 
        (filters.priceRange === 'low' && product.sellingPrice < 2000) ||
        (filters.priceRange === 'medium' && product.sellingPrice >= 2000 && product.sellingPrice < 5000) ||
        (filters.priceRange === 'high' && product.sellingPrice >= 5000)
      )
    );
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tableHeaders = ['Product Image', 'Product Name', 'Product Category', 'Product Map ✅', 'Selling Price ✅', 'Discount %', 'Actions'];

  // Calculate savings
  const calculateSavings = (mrp, sellingPrice) => {
    return mrp - sellingPrice;
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <p className="text-gray-600 mt-2">Manage your e-commerce product catalog</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <select
              name="productName"
              value={filters.productName}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--- no select ---</option>
              {Array.from(new Set(products.map(p => p.productName))).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              name="productCategory"
              value={filters.productCategory}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--- no select ---</option>
              {Array.from(new Set(products.map(p => p.productCategory))).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--- no select ---</option>
              <option value="low">Under ₹2000</option>
              <option value="medium">₹2000 - ₹5000</option>
              <option value="high">Above ₹5000</option>
            </select>
          </div>    
            <button 
              onClick={handleResetFilters}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
            >
              Filter
            </button>
            <button
              onClick={handleAddProduct}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
            >
              <span>+</span>
              <span>Add Product</span>
            </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table
            headers={tableHeaders}
            data={currentProducts}
            renderRow={(product, index) => (
              <tr 
                key={product.id} 
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <img 
                      src={product.productImage} 
                      alt={product.productName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
                      }}
                    />
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-800">{product.productName}</div>
                  <div className="text-sm text-gray-500 mt-1">ID: PROD-{product.id.toString().padStart(4, '0')}</div>
                </td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {product.productCategory}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                    product.productMap 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${product.productMap ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {product.productMap ? 'Mapped' : 'Not Mapped'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="space-y-1">
                    <div className="font-bold text-lg text-green-600">
                      ₹{product.sellingPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      ₹{product.mrp.toFixed(2)}
                    </div>
                    <div className="text-xs text-blue-600">
                      Save ₹{calculateSavings(product.mrp, product.sellingPrice).toFixed(2)}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col items-center">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
                      {product.discount}% OFF
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {product.stock} in stock
                    </div>
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No results.</h3>
            <p className="text-gray-500">
              {Object.values(filters).some(f => f !== '') 
                ? "No products match your filter criteria" 
                : "No products available. Click 'Add Product' to create one."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
            </div>
            
            <div className="flex items-center space-x-2 my-4 md:my-0">
              {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 4) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 3 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 4 && currentPage < totalPages - 2 && (
                <>
                  <span className="text-gray-500">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md ${
                      currentPage === totalPages
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                  currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                Previous
              </button>
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 ${
                  currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
        productData={selectedProduct}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Ecommerce;