import React, { useState } from 'react';

const MyOrders = () => {
  const [orders, setOrders] = useState([
    { 
      id: 1, 
      customerName: 'Rahul Sharma', 
      email: 'rahul.sharma@email.com', 
      mobileNumber: '+91 9876543210', 
      address: '123 Main Street', 
      area: 'Powai', 
      city: 'Mumbai', 
      pincode: '400076', 
      productName: 'Wireless Bluetooth Headphones', 
      price: 2499, 
      purchaseQuantity: 1, 
      totalPaidAmount: 2499, 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      orderDate: '02/12/2025',
      status: 'Delivered',
      orderId: 'ORD-001'
    },
    { 
      id: 2, 
      customerName: 'Priya Patel', 
      email: 'priya.patel@email.com', 
      mobileNumber: '+91 8765432109', 
      address: '456 Park Avenue', 
      area: 'Sector 15', 
      city: 'Noida', 
      pincode: '201301', 
      productName: 'Smart Watch Series 5', 
      price: 12999, 
      purchaseQuantity: 2, 
      totalPaidAmount: 25998, 
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      orderDate: '01/12/2025',
      status: 'Shipped',
      orderId: 'ORD-002'
    },
    { 
      id: 3, 
      customerName: 'Amit Verma', 
      email: 'amit.verma@email.com', 
      mobileNumber: '+91 7654321098', 
      address: '789 MG Road', 
      area: 'Indiranagar', 
      city: 'Bangalore', 
      pincode: '560038', 
      productName: 'Running Shoes Pro', 
      price: 3299, 
      purchaseQuantity: 1, 
      totalPaidAmount: 3299, 
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      orderDate: '30/11/2025',
      status: 'Processing',
      orderId: 'ORD-003'
    },
    { 
      id: 4, 
      customerName: 'Sneha Reddy', 
      email: 'sneha.reddy@email.com', 
      mobileNumber: '+91 6543210987', 
      address: '321 Jubilee Hills', 
      area: 'Hitech City', 
      city: 'Hyderabad', 
      pincode: '500033', 
      productName: 'Premium Laptop Backpack', 
      price: 1499, 
      purchaseQuantity: 3, 
      totalPaidAmount: 4497, 
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
      orderDate: '29/11/2025',
      status: 'Pending',
      orderId: 'ORD-004'
    },
    { 
      id: 5, 
      customerName: 'Vikram Singh', 
      email: 'vikram.singh@email.com', 
      mobileNumber: '+91 5432109876', 
      address: '654 Marine Drive', 
      area: 'Colaba', 
      city: 'Mumbai', 
      pincode: '400005', 
      productName: 'Waterproof Fitness Tracker', 
      price: 1999, 
      purchaseQuantity: 2, 
      totalPaidAmount: 3998, 
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
      orderDate: '28/11/2025',
      status: 'Cancelled',
      orderId: 'ORD-005'
    },
  ]);

  const [filters, setFilters] = useState({
    name: '',
    email: '',
    city: '',
    productName: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      name: '',
      email: '',
      city: '',
      productName: ''
    });
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    return (
      (filters.name === '' || order.customerName.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.email === '' || order.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.city === '' || order.city.toLowerCase().includes(filters.city.toLowerCase())) &&
      (filters.productName === '' || order.productName.toLowerCase().includes(filters.productName.toLowerCase()))
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tableHeaders = [
    'Customer Name', 'E-mail', 'Mobile Number', 'Address', 'Area', 'City', 
    'Pincode', 'Product Name', 'Price', 'Purchase Quantity', 'Total paid amount', 'Image', 'Details of Order'
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calculate order summary
  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPaidAmount, 0);
  const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Order Show Panel</h1>
        <p className="text-gray-600 mt-2">View and manage all customer orders</p>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-blue-800 mt-2">{totalOrders}</p>
            </div>
            <div className="text-3xl text-blue-500">📦</div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-green-800 mt-2">₹ {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="text-3xl text-green-500">💰</div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Average Order Value</p>
              <p className="text-2xl font-bold text-purple-800 mt-2">₹ {averageOrderValue}</p>
            </div>
            <div className="text-3xl text-purple-500">📊</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <select
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--- no select ---</option>
              {Array.from(new Set(orders.map(o => o.customerName))).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--- no select ---</option>
              {Array.from(new Set(orders.map(o => o.email))).map(email => (
                <option key={email} value={email}>{email}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--- no select ---</option>
              {Array.from(new Set(orders.map(o => o.city))).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              name="productName"
              value={filters.productName}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">--- no select ---</option>
              {Array.from(new Set(orders.map(o => o.productName))).map(product => (
                <option key={product} value={product}>{product}</option>
              ))}
            </select>
          </div>
          
          <div>
            <button 
              onClick={handleResetFilters}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-[1400px]">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  {tableHeaders.map((header, index) => (
                    <th key={index} className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order, index) => (
                    <tr 
                      key={order.id} 
                      className={`border-b border-gray-200 hover:bg-blue-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{order.customerName}</div>
                        <div className="text-xs text-gray-500 mt-1">ID: {order.orderId}</div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="text-gray-700 truncate max-w-[180px]">{order.email}</div>
                      </td>
                      
                      <td className="py-4 px-4 text-gray-700">{order.mobileNumber}</td>
                      
                      <td className="py-4 px-4">
                        <div className="text-gray-700 max-w-[150px] truncate">{order.address}</div>
                      </td>
                      
                      <td className="py-4 px-4 text-gray-700">{order.area}</td>
                      
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {order.city}
                        </span>
                      </td>
                      
                      <td className="py-4 px-4 text-gray-700">{order.pincode}</td>
                      
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-800">{order.productName}</div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-800">₹{order.price.toFixed(2)}</div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center">
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            {order.purchaseQuantity}
                          </span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="font-bold text-lg text-green-600">
                          ₹{order.totalPaidAmount.toFixed(2)}
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={order.image} 
                            alt={order.productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
                            }}
                          />
                        </div>
                      </td>
                      
                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.orderDate}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="py-12 text-center">
                      <div className="text-4xl mb-4">📋</div>
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">No results.</h3>
                      <p className="text-gray-500">
                        {Object.values(filters).some(f => f !== '') 
                          ? "No orders match your filter criteria" 
                          : "No orders available."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredOrders.length)} of {filteredOrders.length} orders
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

      {/* Status Legend */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm text-gray-700">Delivered</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
            <span className="text-sm text-gray-700">Shipped</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm text-gray-700">Processing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-sm text-gray-700">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm text-gray-700">Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;