import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Home = ({ user, userId, setUser }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState('');
  const [message, setMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);

  // Wrap fetchTasks in useCallback to ensure it's a stable function
  const fetchTasks = useCallback(async () => {
    try {
      if (userId) {
        const response = await axios.get(`http://localhost:5000/api/tasks/${userId}`);
        setTasks(response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setMessage("Failed to load tasks. Please try again.");
    }
  }, [userId]); // The dependency is userId, so the function only changes if userId changes

  // useEffect hook now depends on the stable fetchTasks function
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskText.trim() || !userId) {
      setMessage("Task cannot be empty.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/tasks/${userId}`, {
        task: newTaskText
      });
      setMessage('Task added successfully!');
      setNewTaskText('');
      fetchTasks(); // Re-fetch tasks to update the list
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
      await axios.put(`http://localhost:5000/api/tasks/${editTaskId}`, {
        task: editTaskText
      });
      setMessage('Task updated successfully!');
      setEditTaskId(null);
      setEditTaskText('');
      fetchTasks(); // Re-fetch tasks to update the list
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
      setMessage('Task deleted successfully!');
      fetchTasks(); // Re-fetch tasks to update the list
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
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Your Tasks</h2>
        <button
          onClick={handleLogout}
          className="p-2 text-sm bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all duration-200"
        >
          Logout
        </button>
      </div>

      {/* Form for adding a new task */}
      <form onSubmit={handleAddTask} className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
        />
        <button
          type="submit"
          className="p-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Add Task
        </button>
      </form>

      {message && <p className="text-red-500 text-center">{message}</p>}

      {/* List of tasks */}
      <ul className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500">No tasks found. Add a new one!</p>
        ) : (
          tasks.map((task) => (
            <li key={task._id} className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center justify-between transition-all duration-200 hover:shadow-md">
              {editTaskId === task._id ? (
                <form onSubmit={handleEditTask} className="flex flex-grow items-center space-x-2">
                  <input
                    type="text"
                    value={editTaskText}
                    onChange={(e) => setEditTaskText(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    className="p-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditTaskId(null);
                      setEditTaskText('');
                    }}
                    className="p-2 text-sm text-gray-600 hover:text-gray-900 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span className="flex-grow text-gray-700">{task.task}</span>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {task.modifiedAt && (
                      <span className="italic">
                        (Edited: {new Date(task.modifiedAt).toLocaleDateString()})
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setEditTaskId(task._id);
                        setEditTaskText(task.task);
                      }}
                      className="p-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(task._id)}
                      className="p-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
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

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="p-8 bg-white rounded-lg shadow-xl text-center">
            <h3 className="text-xl font-bold mb-4">Are you sure you want to delete this task?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-200"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 font-bold rounded-lg hover:bg-gray-400 transition-all duration-200"
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
