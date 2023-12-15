import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [userEmail, setUserEmail] = useState(""); // Added state for user's email

  useEffect(() => {
    // Fetch tasks from the server when the component mounts
    axios
      .get("http://localhost:5000/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []); // Empty dependency array ensures this effect runs only once

  const addTask = () => {
    if (newTask.trim() !== "") {
      axios
        .post("http://localhost:5000/tasks/add", {
          text: newTask,
          completed: false,
        })
        .then(() => fetchTasks())
        .catch((error) => console.error("Error adding task:", error));
      setNewTask("");
    }
  };

  const toggleComplete = (taskId) => {
    axios
      .patch(`http://localhost:5000/tasks/complete/${taskId}`)
      .then(() => fetchTasks())
      .catch((error) =>
        console.error("Error marking task as complete:", error)
      );
  };

  const deleteTask = (taskId) => {
    axios
      .delete(`http://localhost:5000/tasks/delete/${taskId}`)
      .then(() => fetchTasks())
      .catch((error) => console.error("Error deleting task:", error));
  };
  const fetchTasks = () => {
    axios
      .get("http://localhost:5000/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  const sendEmail = () => {
    if (userEmail.trim() !== "") {
      axios
        .post("http://localhost:5000/tasks/send-email", {
          email: userEmail,
        })
        .then(() => console.log("Email sent successfully"))
        .catch((error) => console.error("Error sending email:", error));
    }
  };
  return (
    <div className="App">
      <h2>To-Do List</h2>
      <div id="taskInputContainer">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className={task.completed ? "completed" : ""}>
            <span onClick={() => toggleComplete(task._id)} className="toggle">
              ☐
            </span>
            <span className="taskText">{task.text}</span>
            <span className="delete" onClick={() => deleteTask(task._id)}>
              ❌
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
