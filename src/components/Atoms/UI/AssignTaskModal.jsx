import React, { useState } from 'react';

const AssignTaskModal = ({ isOpen, onClose, onSubmit, initialData = null, users = [] }) => {
  const [tasks, setTasks] = useState(
    initialData?.tasks || [
      { title: '', description: '', assignTo: '' },
      { title: '', description: '', assignTo: '' }
    ]
  );

  const addTaskField = () => {
    setTasks([...tasks, { title: '', description: '', assignTo: '' }]);
  };

  const removeTaskField = (index) => {
    if (tasks.length > 2) {
      const newTasks = [...tasks];
      newTasks.splice(index, 1);
      setTasks(newTasks);
    }
  };

  const handleChange = (index, field, value) => {
    const newTasks = [...tasks];
    newTasks[index][field] = value;
    setTasks(newTasks);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filteredTasks = tasks.filter(
      task => task.title.trim() !== '' && task.description.trim() !== ''
    );
    onSubmit(filteredTasks);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden overflow-y-auto">
        <div className="bg-sky-500 text-white p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold">Assign Task</h2>
          <p className="text-sm text-sky-100 mt-1">
            Make changes to staff task assign here. Click save when you're done.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          {tasks.map((task, index) => (
            <div key={index} className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-black">Task {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeTaskField(index)}
                  className="text-red-500 hover:text-red-700"
                  disabled={tasks.length <= 2}
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-black mb-2">Title</label>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                    placeholder={`Enter task title ${index + 1}`}
                  />
                </div>
                
                <div>
                  <label className="block text-black mb-2">Description</label>
                  <textarea
                    value={task.description}
                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black h-32"
                    placeholder={`Enter task description ${index + 1}`}
                  />
                </div>
                
                <div>
                  <label className="block text-black mb-2">Assign To</label>
                  <select
                    value={task.assignTo}
                    onChange={(e) => handleChange(index, 'assignTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-black"
                  >
                    <option value="">Select Staff</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTaskField}
            className="w-full py-3 border-2 border-dashed border-sky-300 text-sky-500 hover:bg-sky-50 rounded-lg mb-6"
          >
            + Add more task fields
          </button>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskModal;