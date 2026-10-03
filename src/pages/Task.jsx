import { useEffect, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { addTask, deleteTask, getTasks, updateTask } from '../utils/database/authDb'

class LocalUploadAdapter {
  constructor(loader) {
    this.loader = loader
  }

  upload() {
    return this.loader.file.then((file) => new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => resolve({ default: reader.result })
      reader.onerror = () => reject(new Error('Could not read the selected image.'))
      reader.readAsDataURL(file)
    }))
  }

  abort() {}
}

function localUploadAdapter(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => (
    new LocalUploadAdapter(loader)
  )
}

const addDocumentUploadButton = (editor) => {
  const toolbarItems = editor.ui.view.toolbar.element.querySelector('.ck-toolbar__items')
  if (!toolbarItems) return

  const button = document.createElement('button')
  const fileInput = document.createElement('input')

  button.type = 'button'
  button.className = 'ck ck-button ck-off'
  button.title = 'Upload document'
  button.setAttribute('aria-label', 'Upload document')
  button.innerHTML = '<svg class="ck ck-icon ck-button__icon" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16V4m0 0L8 8m4-4 4 4M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"/></svg>'

  fileInput.type = 'file'
  fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv'
  fileInput.hidden = true
  document.body.appendChild(fileInput)
  toolbarItems.appendChild(button)

  button.addEventListener('click', () => fileInput.click())
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const fileName = escapeHtml(file.name)
      editor.setData(`${editor.getData()}<p><a href="${reader.result}" download="${fileName}">Download ${fileName}</a></p>`)
      fileInput.value = ''
    }
    reader.readAsDataURL(file)
  })

  editor.on('destroy', () => {
    button.remove()
    fileInput.remove()
  })
}

const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;',
}[character]))

const Task = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tasks, setTasks] = useState([])
  const [editingTaskId, setEditingTaskId] = useState(null)

  useEffect(() => {
    let isMounted = true

    getTasks().then((savedTasks) => {
      if (isMounted) setTasks(savedTasks)
    }).catch((error) => {
      console.error('Failed to load tasks:', error)
    })

    return () => {
      isMounted = false
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!title.trim() || !description.trim()) return

    if (editingTaskId !== null) {
      const updatedTask = tasks.find((task) => task.id === editingTaskId)
      if (!updatedTask) return

      const savedTask = { ...updatedTask, title: title.trim(), description }
      await updateTask(savedTask)
      setTasks((current) => current.map((task) => (
        task.id === editingTaskId ? savedTask : task
      )))
    } else {
      const newTask = { id: Date.now(), title: title.trim(), description }
      await addTask(newTask)
      setTasks((current) => [...current, newTask])
    }

    setEditingTaskId(null)
    setTitle('')
    setDescription('')
  }

  const handleEdit = (task) => {
    setEditingTaskId(task.id)
    setTitle(task.title)
    setDescription(task.description)
  }

  const handleDelete = async (taskId) => {
    await deleteTask(taskId)
    setTasks((current) => current.filter((task) => task.id !== taskId))
    if (editingTaskId === taskId) {
      setEditingTaskId(null)
      setTitle('')
      setDescription('')
    }
  }

  const handleCancelEdit = () => {
    setEditingTaskId(null)
    setTitle('')
    setDescription('')
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 sm:p-8">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Task Manager</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Create and Track Tasks</h1>
          
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid min-w-0 gap-6 sm:grid-cols-2">
            <div className="min-w-0 sm:col-span-2">
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

            <div className="min-w-0 sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Task Description
              </label>
              <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm shadow-slate-100">
                <CKEditor
                  editor={ClassicEditor}
                  data={description}
                  key={editingTaskId ?? 'new-task'}
                  config={{
                    extraPlugins: [localUploadAdapter],
                    toolbar: [
                      'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                      'imageUpload', 'blockQuote', 'undo', 'redo',
                    ],
                  }}
                  onReady={addDocumentUploadButton}
                  onChange={(event, editor) => {
                    const data = editor.getData()
                    setDescription(data)
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              {editingTaskId === null ? 'Add Task' : 'Save Task'}
            </button>
            {editingTaskId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
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
                <li key={task.id} className="min-w-0 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50 sm:p-5">
                  <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                    <h3 className="min-w-0 break-words text-lg font-semibold text-slate-900">{task.title}</h3>

                    <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <button
                      type="button"
                      aria-label={`Edit ${task.title}`}
                      onClick={() => handleEdit(task)}
                      className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700 transition hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      aria-label={`Delete ${task.title}`}
                      onClick={() => handleDelete(task.id)}
                      className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700 transition hover:bg-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      Delete
                    </button>
                    
                    <span className="max-w-full break-all rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
                      ID: {task.id}
                    </span>
                    </div>
                  </div>
                  <div
                    className="mt-3 min-w-0 break-words text-sm leading-6 text-slate-600 [&_img]:h-auto [&_img]:max-w-full [&_a]:break-all"
                    dangerouslySetInnerHTML={{ __html: task.description }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        { /*<SheetUpdate /> */}
      </div>
    </div>
  )
}

export default Task