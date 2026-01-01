import React, { useState } from 'react';
import CoursePlanModal from '../../components/Atoms/UI/CoursePlanModal';
import Table from '../../components/Atoms/TableData/TableData';

const CoursePlans = () => {
  const [plans, setPlans] = useState([
    { 
      id: 1, 
      name: 'Plan A tally', 
      amount: '8000', 
      currency: '$',
      course: 'Tally accounting',
      status: 'active',
      createdAt: '24/11/2025'
    },
    { 
      id: 2, 
      name: 'Plan B mosfice', 
      amount: '4000', 
      currency: '$',
      course: 'ms office',
      status: 'active',
      createdAt: '24/11/2025'
    },
    { 
      id: 3, 
      name: 'PlanA Modlice', 
      amount: '5000', 
      currency: '$',
      course: 'ms office',
      status: 'inactive',
      createdAt: '18/11/2025'
    },
    { 
      id: 4, 
      name: 'Plan C Python', 
      amount: '12000', 
      currency: '$',
      course: 'Python Programming',
      status: 'active',
      createdAt: '15/12/2025'
    },
    { 
      id: 5, 
      name: 'Plan D Web Dev', 
      amount: '15000', 
      currency: '$',
      course: 'Web Development',
      status: 'active',
      createdAt: '10/12/2025'
    },
    { 
      id: 6, 
      name: 'Plan E Data Science', 
      amount: '20000', 
      currency: '$',
      course: 'Data Science',
      status: 'inactive',
      createdAt: '05/12/2025'
    },
    { 
      id: 7, 
      name: 'Plan F Digital Marketing', 
      amount: '9000', 
      currency: '$',
      course: 'Digital Marketing',
      status: 'active',
      createdAt: '01/12/2025'
    },
    { 
      id: 8, 
      name: 'Plan G UI/UX', 
      amount: '11000', 
      currency: '$',
      course: 'UI/UX Design',
      status: 'active',
      createdAt: '28/11/2025'
    },
  ]);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    name: 'all',
    amount: 'all',
    course: 'all',
    status: 'all',
    startDate: '',
    endDate: ''
  });

  const courses = ['Tally accounting', 'ms office', 'Python Programming', 'Web Development', 
                  'Data Science', 'Digital Marketing', 'UI/UX Design', 'C++ Programming', 
                  'Java', 'Mobile App Development'];

  const handleAddPlan = () => {
    setModalMode('add');
    setSelectedPlan(null);
    setShowPlanModal(true);
  };

  const handleEditPlan = (plan) => {
    setModalMode('edit');
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const handleSavePlan = (planData) => {
    if (modalMode === 'add') {
      const newPlan = {
        id: plans.length + 1,
        ...planData,
        currency: '$',
        status: 'active',
        createdAt: new Date().toLocaleDateString('en-GB')
      };
      setPlans([newPlan, ...plans]);
    } else {
      setPlans(plans.map(plan => 
        plan.id === selectedPlan.id 
          ? { ...plan, ...planData }
          : plan
      ));
    }
    setShowPlanModal(false);
    setSelectedPlan(null);
  };

  const handleToggleStatus = (planId) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, status: plan.status === 'active' ? 'inactive' : 'active' }
        : plan
    ));
  };

  const handleDeletePlan = (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      setPlans(plans.filter(plan => plan.id !== planId));
    }
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = 
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesName = filters.name === 'all' || true;
    const matchesAmount = filters.amount === 'all' || true;
    const matchesCourse = filters.course === 'all' || plan.course === filters.course;
    const matchesStatus = filters.status === 'all' || plan.status === filters.status;
    
    const matchesDate = () => {
      if (!filters.startDate && !filters.endDate) return true;
      
      const planDate = new Date(plan.createdAt.split('/').reverse().join('-'));
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      
      if (startDate && endDate) {
        return planDate >= startDate && planDate <= endDate;
      }
      if (startDate) return planDate >= startDate;
      if (endDate) return planDate <= endDate;
      
      return true;
    };
    
    return matchesSearch && matchesName && matchesAmount && matchesCourse && matchesStatus && matchesDate();
  });

  // const stats = {
  //   total: plans.length,
  //   active: plans.filter(p => p.status === 'active').length,
  //   inactive: plans.filter(p => p.status === 'inactive').length,
  //   totalRevenue: plans.reduce((sum, plan) => sum + parseInt(plan.amount), 0),
  //   averageAmount: Math.round(plans.reduce((sum, plan) => sum + parseInt(plan.amount), 0) / plans.length),
  //   mostExpensive: Math.max(...plans.map(p => parseInt(p.amount)))
  // };

  const tableHeaders = ['Course Plan Name', 'Amount', 'Course', 'Status', 'Created At', 'Actions'];

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-4">
            <div>
              <h1 className="text-3xl font-bold">Course Plans Management</h1>
              <p className="text-black mt-2">Manage pricing plans for all courses</p>
            </div>
            <button
              onClick={handleAddPlan}
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 font-medium flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Add Plan
            </button>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Plans</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
            <h3 className="text-lg font-semibold text-green-700">Active Plans</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.active}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-700">Total Revenue</h3>
            <p className="text-3xl font-bold text-black mt-2">${stats.totalRevenue}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-700">Avg. Plan Amount</h3>
            <p className="text-3xl font-bold text-black mt-2">${stats.averageAmount}</p>
          </div>
        </div> */}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div>
              <select
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">Select Name</option>
                <option value="plan-a">Plan A</option>
                <option value="plan-b">Plan B</option>
                <option value="plan-c">Plan C</option>
              </select>
            </div>
            
            <div>
              <select
                value={filters.amount}
                onChange={(e) => setFilters({...filters, amount: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">Select Amount</option>
                <option value="0-5000">$0 - $5000</option>
                <option value="5001-10000">$5001 - $10000</option>
                <option value="10001+">$10001+</option>
              </select>
            </div>
            
            <div>
              <select
                value={filters.course}
                onChange={(e) => setFilters({...filters, course: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">Select Course</option>
                {courses.map((course, index) => (
                  <option key={index} value={course}>{course}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              >
                <option value="all">Select Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                placeholder="Start Date"
              />
            </div>
            
            <div>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                placeholder="End Date"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search plans by name or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
              />
            </div>
            <div className="text-sm text-gray-600 ml-4">
              Showing {filteredPlans.length} of {plans.length} plans
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              headers={tableHeaders}
              data={filteredPlans}
              renderRow={(plan, index) => (
                <tr 
                  key={plan.id} 
                  className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-black">{plan.name}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-green-600 text-lg">
                      {plan.amount} {plan.currency}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {plan.course}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${
                        plan.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        plan.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-black">{plan.createdAt}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="text-sky-500 hover:text-sky-700 text-lg"
                        title="View/Edit Plan"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleToggleStatus(plan.id)}
                        className={`text-lg ${
                          plan.status === 'active' 
                            ? 'text-yellow-500 hover:text-yellow-700' 
                            : 'text-green-500 hover:text-green-700'
                        }`}
                        title={plan.status === 'active' ? 'Deactivate Plan' : 'Activate Plan'}
                      >
                        {plan.status === 'active' ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-500 hover:text-red-700 text-lg"
                        title="Delete Plan"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            />
          </div>

          {filteredPlans.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No plans found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || Object.values(filters).some(f => f !== 'all' && f !== '') 
                  ? "No plans match your search criteria" 
                  : "No course plans available. Add your first plan!"}
              </p>
              <button
                onClick={handleAddPlan}
                className="px-6 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600"
              >
                Add First Plan
              </button>
            </div>
          )}

          {filteredPlans.length > 0 && (
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                Previous
              </button>
              <div className="text-sm text-gray-600">
                Page 1 of {Math.ceil(filteredPlans.length / 10)}
              </div>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <CoursePlanModal
        isOpen={showPlanModal}
        onClose={() => {
          setShowPlanModal(false);
          setSelectedPlan(null);
        }}
        planData={selectedPlan}
        mode={modalMode}
        courses={courses}
        onSubmit={handleSavePlan}
      />
    </div>
  );
};

export default CoursePlans;