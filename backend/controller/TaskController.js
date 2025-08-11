const { Task } = require('../db');

// Controller to add a new task
async function addTask(req, res) {
  const { task } = req.body;
  const { userId } = req.params;
  try {
    const newTask = new Task({ userId, task });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Error adding task', error: err.message });
  }
}

// Controller to get all tasks for a user
async function getTasksByUserId(req, res) {
  try {
    const tasks = await Task.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
}

// Controller to edit an existing task
async function updateTask(req, res) {
  const { task } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { task, modifiedAt: Date.now() },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error editing task', error: err.message });
  }
}

async function deleteTask(req, res) {
try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
}


module.exports = {
  addTask,
  getTasksByUserId,
  updateTask,
  deleteTask
};