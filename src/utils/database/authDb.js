import SHA256 from 'crypto-js/sha256'

const DATABASE_NAME = 'TodoListDB'
const DATABASE_VERSION = 2
const USERS_STORE = 'users'
const TASKS_STORE = 'tasks'

const openDatabase = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

  request.onupgradeneeded = () => {
    const database = request.result
    if (!database.objectStoreNames.contains(USERS_STORE)) {
      const users = database.createObjectStore(USERS_STORE, { keyPath: 'id', autoIncrement: true })
      users.createIndex('email', 'email', { unique: true })
    }
    if (!database.objectStoreNames.contains(TASKS_STORE)) {
      database.createObjectStore(TASKS_STORE, { keyPath: 'id' })
    }
  }

  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})

const withStore = async (storeName, mode, operation) => {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(storeName, mode)
    const request = operation(transaction.objectStore(storeName))

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => reject(transaction.error)
  })
}

export const findUserByEmail = (email) => withStore(USERS_STORE, 'readonly', (users) => (
  users.index('email').get(email.trim().toLowerCase())
))

export const findUserById = (id) => withStore(USERS_STORE, 'readonly', (users) => users.get(id))

export const createUser = ({ name, email, passwordHash }) => withStore(USERS_STORE, 'readwrite', (users) => (
  users.add({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    provider: 'local',
    createdAt: new Date().toISOString(),
  })
))

export const saveGoogleUser = async (profile) => {
  const email = profile.email?.trim().toLowerCase()
  if (!email) return withStore(USERS_STORE, 'readwrite', (users) => users.add({ ...profile, provider: 'google' }))

  const database = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(USERS_STORE, 'readwrite')
    const users = transaction.objectStore(USERS_STORE)
    const lookup = users.index('email').get(email)

    lookup.onsuccess = () => {
      const existingUser = lookup.result
      const savedUser = existingUser
        ? { ...existingUser, ...profile, email, provider: 'google' }
        : { ...profile, email, provider: 'google', createdAt: new Date().toISOString() }
      users.put(savedUser)
    }
    lookup.onerror = () => reject(lookup.error)
    transaction.oncomplete = () => {
      database.close()
      resolve(findUserByEmail(email))
    }
    transaction.onerror = () => reject(transaction.error)
  })
}

export const hashPassword = async (password) => {
  if (globalThis.crypto?.subtle) {
    const encoded = new TextEncoder().encode(password)
    const hash = await globalThis.crypto.subtle.digest('SHA-256', encoded)
    return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('')
  }

  return SHA256(password).toString()
}

export const getTasks = () => withStore(TASKS_STORE, 'readonly', (tasks) => tasks.getAll())

export const addTask = (task) => withStore(TASKS_STORE, 'readwrite', (tasks) => tasks.add(task))

export const updateTask = (task) => withStore(TASKS_STORE, 'readwrite', (tasks) => tasks.put(task))

export const deleteTask = (taskId) => withStore(TASKS_STORE, 'readwrite', (tasks) => tasks.delete(taskId))
