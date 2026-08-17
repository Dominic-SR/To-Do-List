import React, { useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import SheetUpdate from '../utils/helper/SheetUpdate'

const Task = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tasks, setTasks] = useState([])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!title.trim() || !description.trim()) return

    setTasks((current) => [
      ...current,
      { id: Date.now(), title: title.trim(), description },
    ])
    setTitle('')
    setDescription('')
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-200/50">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Task Manager</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Create and Track Tasks</h1>
          
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="task-title" className="mb-2 block text-sm font-medium text-slate-700">
                Task Title
              </label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Task Description
              </label>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm shadow-slate-100">
                <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  onChange={(event, editor) => {
                    const data = editor.getData()
                    setDescription(data)
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Add Task
            </button>
          </div>
        </form>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Tasks</h2>
              <p className="text-sm text-slate-500">Review your active tasks below.</p>
            </div>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No tasks yet. Add one above to get started.
            </div>
          ) : (
            <ul className="space-y-4">
              {tasks.map((task) => (
                <li key={task.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">{task.title}</h3>
                   
                   <div className="flex gap-2">
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700 cursor-pointer">🖋️</span>

                    <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700 cursor-pointer">🗑️</span>
                    
                    <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                      ID: {task.id}
                    </span>
                    </div>
                  </div>
                  <div
                    className="mt-3 text-sm leading-6 text-slate-600"
                    dangerouslySetInnerHTML={{ __html: task.description }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <SheetUpdate />
      </div>
    </div>
  )
}

export default Task