// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// const port = 5000;

// // Middleware to parse JSON in request body
// app.use(bodyParser.json());
// app.use(cors());

// // MongoDB connection URI (replace with your MongoDB connection string)
// const uri = "mongodb://localhost:27017/todoListDB";

// // Set up Mongoose connection
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// // Define the task schema
// const taskSchema = new mongoose.Schema({
//   text: String,
//   completed: Boolean,
// });

// // Create a Mongoose model based on the task schema
// const Task = mongoose.model("Task", taskSchema);

// // Set up routes after successful Mongoose connection

// // Route to get all tasks
// app.get("/tasks", async (req, res) => {
//   try {
//     const tasks = await Task.find({});
//     res.json(tasks);
//   } catch (error) {
//     console.error("Error fetching tasks from MongoDB:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// // Route to add a new task
// app.post("/tasks/add", async (req, res) => {
//   const newTask = req.body;
//   try {
//     await Task.create(newTask);
//     res.json({ success: true, message: "Task added successfully" });
//   } catch (error) {
//     console.error("Error adding task to MongoDB:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// // Route to mark a task as complete
// app.patch("/tasks/complete/:id", async (req, res) => {
//   const taskId = req.params.id;
//   try {
//     await Task.findByIdAndUpdate(taskId, { $set: { completed: true } });
//     res.json({ success: true, message: "Task marked as complete" });
//   } catch (error) {
//     console.error("Error updating task in MongoDB:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// // Route to delete a task
// app.delete("/tasks/delete/:id", async (req, res) => {
//   const taskId = req.params.id;
//   try {
//     console.log(`Deleting task with id: ${taskId}`);
//     await Task.findByIdAndDelete(taskId);
//     console.log(`Task deleted successfully`);
//     res.json({ success: true, message: "Task deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting task from MongoDB:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// });

// // Start the server after Mongoose connection
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const port = 5000;

// Middleware to parse JSON in the request body
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection URI (replace with your MongoDB connection string)
const uri = "mongodb://localhost:27017/todoListDB";

// Set up Mongoose connection
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Define the task schema
const taskSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

// Create a Mongoose model based on the task schema
const Task = mongoose.model("Task", taskSchema);

// Set up routes after successful Mongoose connection

// Route to get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks from MongoDB:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Route to add a new task
app.post("/tasks/add", async (req, res) => {
  const newTask = req.body;
  try {
    await Task.create(newTask);
    res.json({ success: true, message: "Task added successfully" });
  } catch (error) {
    console.error("Error adding task to MongoDB:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Route to mark a task as complete
app.patch("/tasks/complete/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    await Task.findByIdAndUpdate(taskId, { $set: { completed: true } });
    res.json({ success: true, message: "Task marked as complete" });
  } catch (error) {
    console.error("Error updating task in MongoDB:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Route to delete a task
app.delete("/tasks/delete/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    console.log(`Deleting task with id: ${taskId}`);
    await Task.findByIdAndDelete(taskId);
    console.log(`Task deleted successfully`);
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task from MongoDB:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Route to send tasks data to user's email
app.post("/tasks/send-email", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const tasks = await Task.find({});
    sendEmail(userEmail, tasks);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Email sending function with less secure app access
async function sendEmail(userEmail, tasks) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ameer.innovapath@gmail.com",
      pass: "ameerhamza007",
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: userEmail,
    subject: "To-Do List Tasks",
    text: JSON.stringify(tasks, null, 2),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Start the server after Mongoose connection
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
