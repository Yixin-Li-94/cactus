const DB_NAME = 'LingoLearnDB'
const DB_VERSION = 1

let db: IDBDatabase | null = null

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject(new Error('Failed to open database'))
    }

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      if (!database.objectStoreNames.contains('users')) {
        const userStore = database.createObjectStore('users', { keyPath: 'id' })
        userStore.createIndex('email', 'email', { unique: true })
      }

      if (!database.objectStoreNames.contains('progress')) {
        const progressStore = database.createObjectStore('progress', { keyPath: 'id' })
        progressStore.createIndex('userId', 'userId', { unique: false })
        progressStore.createIndex('courseId', 'courseId', { unique: false })
      }

      if (!database.objectStoreNames.contains('achievements')) {
        database.createObjectStore('achievements', { keyPath: 'id' })
      }

      if (!database.objectStoreNames.contains('posts')) {
        const postStore = database.createObjectStore('posts', { keyPath: 'id' })
        postStore.createIndex('userId', 'userId', { unique: false })
      }

      if (!database.objectStoreNames.contains('comments')) {
        const commentStore = database.createObjectStore('comments', { keyPath: 'id' })
        commentStore.createIndex('postId', 'postId', { unique: false })
      }

      if (!database.objectStoreNames.contains('studyRecords')) {
        const recordStore = database.createObjectStore('studyRecords', { keyPath: 'id' })
        recordStore.createIndex('userId', 'userId', { unique: false })
        recordStore.createIndex('date', 'date', { unique: false })
      }
    }
  })
}

export const getDB = (): IDBDatabase | null => db

export const addData = <T>(storeName: string, data: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'))
      return
    }

    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.add(data)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(new Error('Failed to add data'))
  })
}

export const putData = <T>(storeName: string, data: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'))
      return
    }

    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.put(data)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(new Error('Failed to update data'))
  })
}

export const getData = <T>(storeName: string, key: string): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'))
      return
    }

    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.get(key)

    request.onsuccess = () => resolve(request.result as T | undefined)
    request.onerror = () => reject(new Error('Failed to get data'))
  })
}

export const getAllData = <T>(storeName: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'))
      return
    }

    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result as T[])
    request.onerror = () => reject(new Error('Failed to get all data'))
  })
}

export const getDataByIndex = <T>(storeName: string, indexName: string, value: string | number): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'))
      return
    }

    const transaction = db.transaction(storeName, 'readonly')
    const store = transaction.objectStore(storeName)
    const index = store.index(indexName)
    const request = index.getAll(value)

    request.onsuccess = () => resolve(request.result as T[])
    request.onerror = () => reject(new Error('Failed to get data by index'))
  })
}

export const deleteData = (storeName: string, key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'))
      return
    }

    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.delete(key)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(new Error('Failed to delete data'))
  })
}

export const clearStore = (storeName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('Database not initialized'))
      return
    }

    const transaction = db.transaction(storeName, 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(new Error('Failed to clear store'))
  })
}
