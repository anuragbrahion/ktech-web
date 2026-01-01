import React, { useState } from 'react';
import AssignModal from '../../components/Atoms/UI/AssignModal';
import Table from '../../components/Atoms/TableData/TableData';

const RoleGoalAssign = () => {
  const [staff, setStaff] = useState([
    { 
      id: 1, 
      name: 'Irfan guiammustufa patel', 
      referralCode: '95060abc80fa', 
      role: 'Teacher', 
      phoneNo: '9879867620', 
      createdAt: '05/12/2025',
      assignedRole: '',
      assignedGoal: ''
    },
    { 
      id: 2, 
      name: 'Husen', 
      referralCode: '407210baafc5', 
      role: 'Teacher', 
      phoneNo: '9638802418', 
      createdAt: '04/12/2025',
      assignedRole: '',
      assignedGoal: ''
    },
    { 
      id: 3, 
      name: 'Hasim Mohsin Shakh', 
      referralCode: '8086acc10646', 
      role: 'Teacher', 
      phoneNo: '9328329381', 
      createdAt: '03/12/2025',
      assignedRole: '',
      assignedGoal: ''
    },
    { 
      id: 4, 
      name: 'rahul', 
      referralCode: '949a64cf16c4', 
      role: 'Student', 
      phoneNo: '9998379375', 
      createdAt: '30/11/2025',
      assignedRole: '',
      assignedGoal: ''
    },
    { 
      id: 5, 
      name: 'Tanzila', 
      referralCode: '86d29cb90Tba', 
      role: 'Student', 
      phoneNo: '9696969698', 
      createdAt: '24/11/2025',
      assignedRole: '',
      assignedGoal: ''
    },
    { 
      id: 6, 
      name: 'Husen', 
      referralCode: '08ebc584b22e', 
      role: 'Student', 
      phoneNo: '9638802418', 
      createdAt: '24/11/2025',
      assignedRole: '',
      assignedGoal: ''
    },
    { 
      id: 7, 
      name: 'Shaisia Nasir Shakh', 
      referralCode: '000r7914ac7e', 
      role: 'Teacher', 
      phoneNo: '8799211218', 
      createdAt: '18/11/2025',
      assignedRole: '',
      assignedGoal: ''
    },
    { 
      id: 8, 
      name: 'shakh amin faruk', 
      referralCode: '46e6d1055e6b', 
      role: 'Teacher', 
      phoneNo: '9726197045', 
      createdAt: '12/11/2025',
      assignedRole: '',
      assignedGoal: ''
    },
    { 
      id: 9, 
      name: 'mahin firoz shakh', 
      referralCode: '25963e213975', 
      role: 'Teacher', 
      phoneNo: '8155900053', 
      createdAt: '12/11/2025',
      assignedRole: '',
      assignedGoal: ''
    },
  ]);

  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignType, setAssignType] = useState('role'); // 'role' or 'goal'
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const roles = ['Teacher', 'Student', 'Admin', 'Coordinator', 'Supervisor', 'Assistant'];
  const goals = [
    'Complete Syllabus by Month End',
    'Achieve 90% Student Pass Rate',
    'Conduct 4 Parent Meetings',
    'Submit Monthly Reports',
    'Complete Training Module',
    'Improve Student Feedback Score',
    'Attend All Staff Meetings',
    'Develop New Course Material'
  ];

  const handleAssignRole = (staff) => {
    setSelectedStaff(staff);
    setAssignType('role');
    setShowAssignModal(true);
  };

  const handleAssignGoal = (staff) => {
    setSelectedStaff(staff);
    setAssignType('goal');
    setShowAssignModal(true);
  };

  const handleSaveAssignment = (type, value, assignTo) => {
    setStaff(prevStaff => 
      prevStaff.map(s => {
        if (s.id === selectedStaff.id) {
          if (type === 'role') {
            return { ...s, assignedRole: value };
          } else {
            return { ...s, assignedGoal: value };
          }
        }
        return s;
      })
    );
    setShowAssignModal(false);
    setSelectedStaff(null);
  };

  const filteredStaff = staff.filter(person => {
    const matchesSearch = 
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.referralCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phoneNo.includes(searchTerm);
    
    const matchesRole = 
      roleFilter === 'all' || 
      (roleFilter === 'teacher' && person.role === 'Teacher') ||
      (roleFilter === 'student' && person.role === 'Student');
    
    return matchesSearch && matchesRole;
  });

  // const stats = {
  //   total: staff.length,
  //   teachers: staff.filter(s => s.role === 'Teacher').length,
  //   students: staff.filter(s => s.role === 'Student').length,
  //   assignedRoles: staff.filter(s => s.assignedRole).length,
  //   assignedGoals: staff.filter(s => s.assignedGoal).length
  // };

  const tableHeaders = [
    'Staff Name',
    'Referral Code',
    'Role',
    'Phone No.',
    'Created At',
    'Assigned Role',
    'Assigned Goal',
    'Actions'
  ];

  return (
    <div className="">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Assign Role/Goal to Teacher</h1>
          <p className="text-black mt-2">Manage role and goal assignments for staff members</p>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-sky-50 p-6 rounded-lg shadow border border-sky-100">
            <h3 className="text-lg font-semibold text-sky-700">Total Staff</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.total}</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-700">Teachers</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.teachers}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow border border-purple-100">
            <h3 className="text-lg font-semibold text-purple-700">Students</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.students}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow border border-green-100">
            <h3 className="text-lg font-semibold text-green-700">Roles Assigned</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.assignedRoles}</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow border border-yellow-100">
            <h3 className="text-lg font-semibold text-yellow-700">Goals Assigned</h3>
            <p className="text-3xl font-bold text-black mt-2">{stats.assignedGoals}</p>
          </div>
        </div> */}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none">
                <input
                  type="text"
                  placeholder="Search by name, referral code, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                />
              </div>
              <div className="flex-1 md:flex-none">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                >
                  <option value="all">All Roles</option>
                  <option value="teacher">Teachers Only</option>
                  <option value="student">Students Only</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredStaff.length} of {staff.length} staff members
            </div>
          </div>

          <Table
            headers={tableHeaders}
            data={filteredStaff}
            renderRow={(person, index) => (
              <tr 
                key={person.id} 
                className={`hover:bg-sky-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-4 px-4 text-black font-medium">{person.name}</td>
                <td className="py-4 px-4 text-black font-mono text-sm">{person.referralCode}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    person.role === 'Teacher' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {person.role}
                  </span>
                </td>
                <td className="py-4 px-4 text-black">{person.phoneNo}</td>
                <td className="py-4 px-4 text-black">{person.createdAt}</td>
                <td className="py-4 px-4">
                  {person.assignedRole ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {person.assignedRole}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Not assigned</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {person.assignedGoal ? (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm max-w-xs truncate inline-block">
                      {person.assignedGoal}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">Not assigned</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAssignRole(person)}
                      className="px-3 py-1 bg-sky-500 text-white text-sm rounded-md hover:bg-sky-600"
                    >
                      Assign Role
                    </button>
                    <button
                      onClick={() => handleAssignGoal(person)}
                      className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600"
                    >
                      Assign Goal
                    </button>
                  </div>
                </td>
              </tr>
            )}
          />
        </div> 
      </div>

      <AssignModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedStaff(null);
        }}
        staffData={selectedStaff}
        assignType={assignType}
        roles={roles}
        goals={goals}
        onSave={handleSaveAssignment}
      />
    </div>
  );
};

export default RoleGoalAssign;