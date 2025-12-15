import CreatableSelect from 'react-select/creatable';

const AgentSelectDropdown = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  options = [],
  className = '',
  setIsAddModalOpen
}) => {
  // Prepare the options list
  const agentOptions = options.map(opt => ({
    value: opt.label,
    label: opt.label,
    id: opt.value,
  }));

  // Find the currently selected agent
  const selectedOption = agentOptions.find(opt => opt.id === value) || null;

  // Handle change from dropdown selection
  const handleChange = (selected) => {
    onChange({
      target: {
        name,
        value: selected?.id || '',
      },
    });
  };

  // Handle creation of a new option
  const handleCreateOption = (inputValue) => {
    if (setIsAddModalOpen) {
      setIsAddModalOpen(true);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} <span className="text-red-500">*</span>
        </label>
      )}
      <CreatableSelect
        isClearable
        placeholder={placeholder || 'Select or enter value'}
        options={agentOptions}
        onChange={handleChange}
        onCreateOption={handleCreateOption}
        value={selectedOption}
        className={`capitalize ${className}`}
        classNamePrefix="react-select"
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default AgentSelectDropdown;
