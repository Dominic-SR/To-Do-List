// src/utils/database/db.jsx
import Dexie from 'dexie';

// 1. Create database instance
export const db = new Dexie('TodoListDB');

// 2. Define schema versions and object stores
db.version(1).stores({
  // Primary key: ++id (auto-incrementing integer)
  // Indexed attributes: taskTitle, createdAt, completed
  // Note: taskDescription does not need to be indexed unless you intend to query/filter by it specifically.
  tasks: '++id, taskTitle, completed, createdAt'
});