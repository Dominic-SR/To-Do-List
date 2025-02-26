import { useState,useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDoneOutline } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import './App.css'

function App() {
  
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (input.trim() === "") return;
    setTasks([...tasks, { text: input, completed: false }]);
    setInput("");
  };

  const toggleTask = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const editTask = (index) =>{
    // console.log(tasks.find((_,i) => i == index).text); 
    setInput(tasks.find((_,i) => i == index).text)
  }


  return (
    <div className="main-container">
      <div className="box-container">
      <h2 className="title">To Do List</h2>
      
      <div className="task-input-container">
        <input
          type="text"
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="primary-button"
          onClick={addTask}
        >
          Add
        </button>
      </div>
      <ul className="task-listing">
      <h2 className="title">Pending List</h2>
        {tasks.map((task, index) => 
          !task.completed && (
          <li
            key={index}
          >
            <span>
              {task.text}
            </span>
            <div className="button-row-container">
            <MdOutlineDoneOutline onClick={() => toggleTask(index)} />
            <FaEdit onClick={() => editTask(index)}/>
            <MdDelete onClick={() => deleteTask(index)} />
            </div>
          </li>
        ))}
      </ul>
        
       
      <ul className="task-listing">
      <h2 className="title">Completed List</h2>
        {tasks.map((task, index) => 
          task.completed && (
          <li
            key={index}
          >
            <span onClick={() => toggleTask(index)} className="cursor-pointer">
              {task.text}
            </span>
            <div className="button-row-container">
            <MdCancel onClick={() => toggleTask(index)} />
            <MdDelete onClick={() => deleteTask(index)} />
            </div>
          </li>
          )
        )}
      </ul>

      </div>
    </div>
  )
}

export default App

