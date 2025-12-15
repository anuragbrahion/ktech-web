const StatusBadge = ({ status }) => {
  const statusStyles = {
    Active: 'bg-green-100 text-green-700',
    Inactive: 'bg-orange-100 text-orange-700',
  };

  return (
    <span className={`px-3 py-1 rounded-full  cursor-pointer text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default StatusBadge