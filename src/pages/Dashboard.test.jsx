import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

let tasksData = [];

const mockAdd = vi.fn(async (task) => {
  const newId = tasksData.length + 1;
  const newTask = { id: newId, ...task };
  tasksData = [newTask, ...tasksData];
  return newId;
});

const mockUpdate = vi.fn(async (id, changes) => {
  tasksData = tasksData.map((t) => (t.id === id ? { ...t, ...changes } : t));
  return 1;
});

const mockDelete = vi.fn(async (id) => {
  tasksData = tasksData.filter((t) => t.id !== id);
  return 1;
});

vi.mock('../utils/database/db', () => ({
  db: {
    tasks: {
      orderBy: () => ({
        reverse: () => ({
          toArray: () => tasksData,
        }),
      }),
      add: mockAdd,
      update: mockUpdate,
      delete: mockDelete,
    },
  },
}));

vi.mock('dexie-react-hooks', () => ({
  useLiveQuery: (fn) => fn(),
}));

import Dashboard from './Dashboard.jsx';

beforeEach(() => {
  tasksData = [];
  vi.clearAllMocks();
});

test('renders empty state when there are no tasks', () => {
  render(<Dashboard />);
  expect(screen.getByText(/No tasks saved yet/i)).toBeInTheDocument();
});

test('adds a task and displays it', async () => {
  const { rerender } = render(<Dashboard />);

  const titleInput = screen.getByPlaceholderText(/Task Title/i);
  const descInput = screen.getByPlaceholderText(/Task Description/i);
  const addButton = screen.getByRole('button', { name: /Add Task/i });

  fireEvent.change(titleInput, { target: { value: 'New Task' } });
  fireEvent.change(descInput, { target: { value: 'New Description' } });
  fireEvent.click(addButton);

  expect(mockAdd).toHaveBeenCalled();

  // simulate DB change and re-render to reflect live query
  rerender(<Dashboard />);
  expect(screen.getByText('New Task')).toBeInTheDocument();
  expect(screen.getByText(/New Description/)).toBeInTheDocument();
});

test('toggles task completion', async () => {
  tasksData = [
    { id: 1, taskTitle: 'T1', taskDescription: '', completed: false, createdAt: new Date().toISOString() },
  ];

  const { rerender } = render(<Dashboard />);
  const completeButton = screen.getByRole('button', { name: /Complete/i });
  fireEvent.click(completeButton);

  expect(mockUpdate).toHaveBeenCalledWith(1, { completed: true });

  // reflect update
  await mockUpdate.mock.results[0].value;
  rerender(<Dashboard />);
});

test('edits a task title and description', async () => {
  tasksData = [
    { id: 1, taskTitle: 'Old', taskDescription: 'Old desc', completed: false, createdAt: new Date().toISOString() },
  ];

  const { rerender } = render(<Dashboard />);
  const editButton = screen.getByRole('button', { name: /Edit/i });
  fireEvent.click(editButton);

  const titleField = screen.getByDisplayValue('Old');
  const descField = screen.getByDisplayValue('Old desc');
  const saveButton = screen.getByRole('button', { name: /Save/i });

  fireEvent.change(titleField, { target: { value: 'Updated' } });
  fireEvent.change(descField, { target: { value: 'Updated desc' } });
  fireEvent.click(saveButton);

  expect(mockUpdate).toHaveBeenCalledWith(1, { taskTitle: 'Updated', taskDescription: 'Updated desc' });

  await mockUpdate.mock.results[0].value;
  rerender(<Dashboard />);
  expect(screen.getByText('Updated')).toBeInTheDocument();
});

test('deletes a task', async () => {
  tasksData = [
    { id: 1, taskTitle: 'ToDelete', taskDescription: '', completed: false, createdAt: new Date().toISOString() },
  ];

  const { rerender } = render(<Dashboard />);
  const deleteButton = screen.getByRole('button', { name: /Delete/i });
  fireEvent.click(deleteButton);

  expect(mockDelete).toHaveBeenCalledWith(1);

  await mockDelete.mock.results[0].value;
  rerender(<Dashboard />);
  expect(screen.queryByText('ToDelete')).not.toBeInTheDocument();
});
