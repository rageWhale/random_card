// =============================
// IndexedDB Module
// Database Utility Functions
// =============================

// Open or create database
function openDB(dbName, version = 1) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(dbName, version)

    request.onsuccess = (e) => {
      const db = e.target.result
      console.log("Database opened successfully", db)
      resolve(db)
    }

    request.onerror = (e) => {
      console.log("Failed to open database", e.target.error)
      reject(e.target.error)
    }

    // Create object store and indexes when upgrading
    request.onupgradeneeded = (e) => {
      const db = e.target.result
      console.log("Database upgraded", db)

      const objectStore = db.createObjectStore("info", {
        keyPath: "id",
        autoIncrement: true
      })

      objectStore.createIndex("index1", "id", { unique: true })
      objectStore.createIndex("index2", "name", { unique: false })
    }
  })
}

// Add or update data
function addData(db, storeName, data) {
  return new Promise((resolve, reject) => {
    const request = db.transaction([storeName], "readwrite")
      .objectStore(storeName)
      .put(data)

    request.onsuccess = () => {
      console.log("Data saved successfully")
      resolve(true)
    }

    request.onerror = (e) => {
      console.log("Failed to save data", e.target.error)
      reject(e.target.error)
    }
  })
}

// Get data by primary key
function getDataByKey(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const request = db.transaction([storeName], "readonly")
      .objectStore(storeName)
      .get(key)

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = (e) => {
      reject(e.target.error)
    }
  })
}

// Get all data using cursor
function getDataByCursor(db, storeName) {
  return new Promise((resolve, reject) => {
    const list = []
    const request = db.transaction([storeName], "readonly")
      .objectStore(storeName)
      .openCursor()

    request.onsuccess = (e) => {
      const cursor = e.target.result
      if (cursor) {
        list.push(cursor.value)
        cursor.continue()
      } else {
        resolve(list)
      }
    }

    request.onerror = (e) => {
      reject(e.target.error)
    }
  })
}

// Get data by index
function getDataByIndex(db, storeName, indexName, indexValue) {
  return new Promise((resolve, reject) => {
    const request = db.transaction([storeName], "readonly")
      .objectStore(storeName)
      .index(indexName)
      .get(indexValue)

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = (e) => {
      reject(e.target.error)
    }
  })
}

// Get data by index with cursor
function getDataByIndexAndCursor(db, storeName, indexName, indexValue) {
  return new Promise((resolve, reject) => {
    const list = []
    const request = db.transaction([storeName], "readonly")
      .objectStore(storeName)
      .index(indexName)
      .openCursor(IDBKeyRange.only(indexValue))

    request.onsuccess = (e) => {
      const cursor = e.target.result
      if (cursor) {
        list.push(cursor.value)
        cursor.continue()
      } else {
        resolve(list)
      }
    }

    request.onerror = (e) => {
      reject(e.target.error)
    }
  })
}

// Delete data by primary key
function deleteData(db, storeName, key) {
  return new Promise((resolve, reject) => {
    const request = db.transaction([storeName], "readwrite")
      .objectStore(storeName)
      .delete(key)

    request.onsuccess = () => {
      console.log("Data deleted successfully")
      resolve(true)
    }

    request.onerror = (e) => {
      reject(e.target.error)
    }
  })
}

// Close database
function closeDB(db) {
  db.close()
  console.log("Database closed")
}

export {
  openDB,
  addData,
  getDataByIndex,
  getDataByCursor,
  getDataByIndexAndCursor,
  deleteData,
  closeDB
}
