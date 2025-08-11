import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = ({ user, userId, setUser }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [message, setMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  const fetchTasks = async () => {
    try {
      if (userId) {
        const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
        setTasks(response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setMessage("Failed to load tasks. Please try again.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userId, fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim() || !userId) {
      setMessage("Task cannot be empty.");
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/tasks/${userId}`, { task: newTaskText });
      setMessage('✅ Task added successfully!');
      setNewTaskText('');
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      setMessage("Failed to add task. Please try again.");
    }
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    if (!editTaskText.trim()) {
      setMessage("Task cannot be empty.");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/tasks/${editTaskId}`, { task: editTaskText });
      setMessage('✏️ Task updated successfully!');
      setEditTaskId(null);
      setEditTaskText('');
      fetchTasks();
    } catch (error) {
      console.error("Error editing task:", error);
      setMessage("Failed to edit task. Please try again.");
    }
  };

  const handleDeleteClick = (taskId) => {
    setTaskToDeleteId(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskToDeleteId}`);
      setMessage('🗑️ Task deleted successfully!');
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      setMessage("Failed to delete task. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setTaskToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDeleteId(null);
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
  };

  return (
    <div className="flex flex-col space-y-6 font-poppins">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-2xl font-bold text-gray-800">📋 Your Tasks</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition-transform transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      {/* Add Task Form */}
      <form
        onSubmit={handleAddTask}
        className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2"
      >
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="✨ Add a new task..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
        />
        <button
          type="submit"
          className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transition-transform transform hover:scale-105"
        >
          ➕ Add Task
        </button>
      </form>

      {message && <p className="text-center text-sm font-medium text-purple-600">{message}</p>}

      {/* Task List */}
      <ul className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-400 italic">No tasks yet. Add your first one! 🎯</p>
        ) : (
          tasks.map((task) => (
            <li
              key={task._id}
              className="p-4 bg-white rounded-lg shadow hover:shadow-lg border border-gray-100 flex items-center justify-between transition-all duration-200 transform hover:scale-[1.02]"
            >
              {editTaskId === task._id ? (
                <form onSubmit={handleEditTask} className="flex flex-grow items-center space-x-2">
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditTaskId(null);
                      setEditTaskText('');
                    }}
                    className="px-3 py-2 text-sm text-gray-500 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span className="flex-grow text-gray-700">{task.task}</span>
                  <div className="flex items-center space-x-2 text-xs">
                    {task.modifiedAt && (
                      <span className="italic text-gray-400">
                        (Edited {new Date(task.modifiedAt).toLocaleDateString()})
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setEditTaskId(task._id);
                        setEditTaskText(task.task);
                      }}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(task._id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="p-8 bg-white rounded-lg shadow-xl text-center max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg shadow hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
