const express = require('express');
const { addTask, getTasksByUserId, updateTask, deleteTask } = require('../controller/TaskController');
const router = express.Router();

router.post('/tasks/:userId', addTask);
router.get('/tasks/:userId', getTasksByUserId);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

module.exports = router;