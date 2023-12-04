const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 5000;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// MongoDB connection URI (replace with your MongoDB connection string)
const uri = 'mongodb://localhost:27017/todoListDB';

// Sample in-memory storage for tasks
let tasks = [];

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }

  // Access the todoListDB database
  const db = client.db('todoListDB');

  // Access the tasks collection
  const tasksCollection = db.collection('tasks');

  // Set up routes after successful MongoDB connection

  // Route to get all tasks
  app.get('/tasks', async (req, res) => {
    try {
      const tasks = await tasksCollection.find({}).toArray();
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks from MongoDB:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  // Route to add a new task
  app.post('/tasks/add', async (req, res) => {
    const newTask = req.body;
    try {
      await tasksCollection.insertOne(newTask);
      res.json({ success: true, message: 'Task added successfully' });
    } catch (error) {
      console.error('Error adding task to MongoDB:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  // Route to mark a task as complete
  app.patch('/tasks/complete/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
      await tasksCollection.updateOne({ _id: taskId }, { $set: { completed: true } });
      res.json({ success: true, message: 'Task marked as complete' });
    } catch (error) {
      console.error('Error updating task in MongoDB:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  // Route to delete a task
  app.delete('/tasks/delete/:id', async (req, res) => {
    const taskId = req.params.id;
    try {
      await tasksCollection.deleteOne({ _id: taskId });
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task from MongoDB:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  // Start the server after MongoDB connection
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
