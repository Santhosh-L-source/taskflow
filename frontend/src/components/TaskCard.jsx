const STATUS_MAP = {
  todo:        { label: 'To Do',       cls: 'badge-todo',     next: 'in_progress' },
  in_progress: { label: 'In Progress', cls: 'badge-progress', next: 'done'        },
  done:        { label: 'Done',        cls: 'badge-done',      next: 'todo'        },
}

const PRIORITY_MAP = {
  low:    { label: 'Low',    cls: 'badge-low'    },
  medium: { label: 'Medium', cls: 'badge-medium' },
  high:   { label: 'High',   cls: 'badge-high'   },
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  const now = new Date()
  const diff = d - now
  if (diff < 0) return { label: 'Overdue', overdue: true }
  const days = Math.ceil(diff / 86400000)
  if (days === 0) return { label: 'Due today', overdue: false }
  if (days === 1) return { label: 'Due tomorrow', overdue: false }
  return { label: `Due ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, overdue: false }
}

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const status   = STATUS_MAP[task.status]   || STATUS_MAP.todo
  const priority = PRIORITY_MAP[task.priority] || PRIORITY_MAP.medium
  const due      = formatDate(task.due_date)

  const handleCycleStatus = () => onStatusChange(task.id, status.next)

  return (
    <div className={`task-card glass ${task.status === 'done' ? 'task-done' : ''}`}>
      <div className="task-card-top">
        {/* Status toggle */}
        <button
          className={`task-check ${task.status === 'done' ? 'checked' : ''}`}
          onClick={handleCycleStatus}
          title="Cycle status"
          id={`task-check-${task.id}`}
        >
          {task.status === 'done' && '✓'}
        </button>

        <div className="task-content">
          <p className={`task-title ${task.status === 'done' ? 'strikethrough' : ''}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="task-desc">{task.description}</p>
          )}
          <div className="task-meta">
            <span className={`badge ${status.cls}`}>{status.label}</span>
            <span className={`badge ${priority.cls}`}>{priority.label}</span>
            {due && (
              <span className="task-due" style={{ color: due.overdue ? 'var(--danger)' : 'var(--text-muted)' }}>
                🗓 {due.label}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="task-actions">
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => onEdit(task)}
            title="Edit task"
            id={`task-edit-${task.id}`}
          >✏️</button>
          <button
            className="btn btn-danger btn-icon"
            onClick={() => onDelete(task.id)}
            title="Delete task"
            id={`task-delete-${task.id}`}
          >🗑</button>
        </div>
      </div>

      <style>{`
        .task-card {
          border-radius: var(--radius-lg);
          padding: 18px 20px;
          transition: all var(--transition);
          animation: slideUp 0.3s ease;
        }
        .task-card:hover {
          border-color: var(--border-hover);
          box-shadow: var(--shadow-md);
          transform: translateY(-1px);
        }
        .task-done { opacity: 0.6; }
        .task-card-top { display: flex; align-items: flex-start; gap: 14px; }
        .task-check {
          flex-shrink: 0;
          width: 22px; height: 22px;
          border-radius: 6px;
          border: 2px solid var(--border-hover);
          background: transparent;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--success);
          transition: all var(--transition);
          margin-top: 2px;
        }
        .task-check:hover { border-color: var(--primary); }
        .task-check.checked { background: rgba(74,222,128,0.15); border-color: var(--success); }
        .task-content { flex: 1; min-width: 0; }
        .task-title { font-weight: 600; font-size: 0.97rem; margin-bottom: 4px; }
        .strikethrough { text-decoration: line-through; color: var(--text-muted); }
        .task-desc { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 10px; line-height: 1.5; }
        .task-meta { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .task-due { font-size: 0.78rem; }
        .task-actions { display: flex; gap: 6px; flex-shrink: 0; opacity: 0; transition: opacity var(--transition); }
        .task-card:hover .task-actions { opacity: 1; }
      `}</style>
    </div>
  )
}
