import { useState, useEffect } from 'react'

const DEFAULT_FORM = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: '',
}

export default function TaskModal({ task, onClose, onSave }) {
  const isEdit = Boolean(task)
  const [form, setForm]     = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  useEffect(() => {
    if (task) {
      setForm({
        title:       task.title || '',
        description: task.description || '',
        status:      task.status || 'todo',
        priority:    task.priority || 'medium',
        due_date:    task.due_date
          ? new Date(task.due_date).toISOString().slice(0, 16)
          : '',
      })
    } else {
      setForm(DEFAULT_FORM)
    }
  }, [task])

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    setError('')
    setLoading(true)
    try {
      const payload = {
        ...form,
        due_date: form.due_date ? new Date(form.due_date).toISOString() : null,
      }
      await onSave(payload, task?.id)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal glass-2">
        <div className="modal-header">
          <h3 style={{ fontSize: '1.15rem' }}>{isEdit ? 'Edit Task' : 'New Task'}</h3>
          <button
            id="modal-close"
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            style={{ fontSize: '1rem' }}
          >✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Title *</label>
            <input
              id="task-title"
              name="title"
              type="text"
              className="form-input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              name="description"
              className="form-textarea"
              placeholder="Add details (optional)"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="task-status">Status</label>
              <select id="task-status" name="status" className="form-select" value={form.status} onChange={handleChange}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="task-priority">Priority</label>
              <select id="task-priority" name="priority" className="form-select" value={form.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-due">Due Date</label>
            <input
              id="task-due"
              name="due_date"
              type="datetime-local"
              className="form-input"
              value={form.due_date}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer" style={{ marginTop: 8 }}>
            <button type="button" id="modal-cancel" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" id="modal-save" className="btn btn-primary" disabled={loading}>
              {loading
                ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Saving…</>
                : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
