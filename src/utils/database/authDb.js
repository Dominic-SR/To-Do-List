const DATABASE_NAME = 'to-do-list-db'
const DATABASE_VERSION = 1
const USERS_STORE = 'users'

const openDatabase = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

  request.onupgradeneeded = () => {
    const database = request.result
    if (!database.objectStoreNames.contains(USERS_STORE)) {
      const users = database.createObjectStore(USERS_STORE, { keyPath: 'id', autoIncrement: true })
      users.createIndex('email', 'email', { unique: true })
    }
  }

  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})

const withStore = async (mode, operation) => {
  const database = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(USERS_STORE, mode)
    const request = operation(transaction.objectStore(USERS_STORE))

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
    transaction.oncomplete = () => database.close()
    transaction.onerror = () => reject(transaction.error)
  })
}

export const findUserByEmail = (email) => withStore('readonly', (users) => (
  users.index('email').get(email.trim().toLowerCase())
))

export const findUserById = (id) => withStore('readonly', (users) => users.get(id))

export const createUser = ({ name, email, passwordHash }) => withStore('readwrite', (users) => (
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
  if (!email) return withStore('readwrite', (users) => users.add({ ...profile, provider: 'google' }))

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
  const encoded = new TextEncoder().encode(password)
  const hash = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('')
}