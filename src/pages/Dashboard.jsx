// src/components/TodoList.jsx
import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../utils/database/db';

const Dashboard = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  // States for inline editing
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // 1. Reactive live query from IndexedDB
  const tasks = useLiveQuery(
    () => db.tasks.orderBy('createdAt').reverse().toArray()
  );

  // 2. CREATE: Add a new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      await db.tasks.add({
        taskTitle: taskTitle.trim(),
        taskDescription: taskDescription.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      });

      // Clear input fields
      setTaskTitle('');
      setTaskDescription('');
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  // 3. TOGGLE COMPLETE: Quick update for checkbox/button
  const handleToggleComplete = async (id, currentStatus) => {
    try {
      await db.tasks.update(id, { completed: !currentStatus });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  // 4. EDIT: Enter edit mode for a specific task
  const handleStartEdit = (task) => {
    setEditingId(task.id);
    setEditTitle(task.taskTitle);
    setEditDescription(task.taskDescription || '');
  };

  // CANCEL EDIT
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  // 5. UPDATE: Save updated title and description to IndexedDB
  const handleSaveEdit = async (id) => {
    if (!editTitle.trim()) return;

    try {
      await db.tasks.update(id, {
        taskTitle: editTitle.trim(),
        taskDescription: editDescription.trim(),
      });
      setEditingId(null); // Exit edit mode
    } catch (error) {
      console.error('Failed to save edited task:', error);
    }
  };

  // 6. DELETE: Remove task by ID
  const handleDeleteTask = async (id) => {
    try {
      await db.tasks.delete(id);
      if (editingId === id) setEditingId(null); // Exit edit mode if deleted
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>Offline Todo List (IndexedDB)</h2>

      {/* Task Creation Form */}
      <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
          style={{ padding: '0.5rem' }}
        />
        <textarea
          placeholder="Task Description (Optional)"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          rows={3}
          style={{ padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem', cursor: 'pointer' }}>
          Add Task
        </button>
      </form>

      {/* Render Tasks */}
      <h3>Tasks</h3>
      {!tasks ? (
        <p>Loading database...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks saved yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                backgroundColor: task.completed ? '#f0f0f0' : '#fff',
              }}
            >
              {/* EDIT MODE UI */}
              {editingId === task.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{ padding: '0.4rem' }}
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={2}
                    style={{ padding: '0.4rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleSaveEdit(task.id)} style={{ padding: '0.25rem 0.5rem' }}>
                      Save
                    </button>
                    <button onClick={handleCancelEdit} style={{ padding: '0.25rem 0.5rem' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* READ-ONLY VIEW */
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4
                      style={{
                        margin: 0,
                        textDecoration: task.completed ? 'line-through' : 'none',
                      }}
                    >
                      {task.taskTitle}
                    </h4>
                    <div>
                      <button
                        onClick={() => handleToggleComplete(task.id, task.completed)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        {task.completed ? 'Undo' : 'Complete'}
                      </button>
                      <button
                        onClick={() => handleStartEdit(task)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </div>
                  </div>
                  {task.taskDescription && (
                    <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', color: '#555' }}>
                      {task.taskDescription}
                    </p>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;