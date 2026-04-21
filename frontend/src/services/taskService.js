import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

const COL = 'tasks'

/** Fetch all tasks for a user, sorted newest-first (client-side) */
export async function getTasks(userId, filters = {}) {
  const q = query(collection(db, COL), where('userId', '==', userId))
  const snap = await getDocs(q)
  let tasks = snap.docs.map(d => ({ id: d.id, ...d.data() }))

  // client-side filter by status
  if (filters.status) tasks = tasks.filter(t => t.status === filters.status)

  // newest first — createdAt is a Firestore Timestamp
  tasks.sort((a, b) => {
    const ta = a.createdAt?.toMillis?.() ?? 0
    const tb = b.createdAt?.toMillis?.() ?? 0
    return tb - ta
  })
  return tasks
}

/** Create a new task document */
export async function createTask(userId, data) {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
  })
  return { id: ref.id, ...data, userId }
}

/** Update an existing task */
export async function updateTask(taskId, data) {
  await updateDoc(doc(db, COL, taskId), data)
  return { id: taskId, ...data }
}

/** Delete a task */
export async function deleteTask(taskId) {
  await deleteDoc(doc(db, COL, taskId))
}
