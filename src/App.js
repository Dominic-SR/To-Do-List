import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./Components/Header/Header";
import Todolist from "./Pages/TodoList/Todolist";


function App() {
  return (
  <div className="main-container">
    <Header />
    <Todolist />
  </div>
  );
}

export default App;
