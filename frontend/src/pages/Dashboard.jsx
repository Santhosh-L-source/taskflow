import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService'
import Navbar from '../components/Navbar'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'

const FILTERS      = ['all', 'todo', 'in_progress', 'done']
const FILTER_LABELS = { all: 'All', todo: 'To Do', in_progress: 'In Progress', done: 'Done' }

export default function Dashboard() {
  const { user } = useAuth()
  const [tasks, setTasks]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [filter, setFilter]       = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTask, setEditTask]   = useState(null)
  const [error, setError]         = useState('')

  /* ── Fetch ───────────────────────────────────────────── */
  const fetchTasks = useCallback(async () => {
    if (!user) return
    try {
      setError('')
      const params = filter !== 'all' ? { status: filter } : {}
      const data = await getTasks(user.uid, params)
      setTasks(data)
    } catch (err) {
      setError('Failed to load tasks. ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [user, filter])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  /* ── CRUD ────────────────────────────────────────────── */
  const handleSave = async (payload, id) => {
    if (id) {
      const updated = await updateTask(id, payload)
      setTasks(ts => ts.map(t => t.id === id ? { ...t, ...updated } : t))
    } else {
      const created = await createTask(user.uid, payload)
      setTasks(ts => [created, ...ts])
    }
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this task?')) return
    await deleteTask(id)
    setTasks(ts => ts.filter(t => t.id !== id))
  }

  const handleStatusChange = async (id, newStatus) => {
    await updateTask(id, { status: newStatus })
    setTasks(ts => ts.map(t => t.id === id ? { ...t, status: newStatus } : t))
  }

  const openCreate = () => { setEditTask(null); setModalOpen(true) }
  const openEdit   = task => { setEditTask(task); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditTask(null) }

  /* ── Stats ───────────────────────────────────────────── */
  const all    = tasks
  const stats  = {
    total:    all.length,
    todo:     all.filter(t => t.status === 'todo').length,
    progress: all.filter(t => t.status === 'in_progress').length,
    done:     all.filter(t => t.status === 'done').length,
    high:     all.filter(t => t.priority === 'high' && t.status !== 'done').length,
  }
  const donePercent = stats.total ? Math.round((stats.done / stats.total) * 100) : 0

  /* ── Greeting ────────────────────────────────────────── */
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = (user?.displayName || user?.email || 'there').split(/[\s@]/)[0]

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-main">
        {/* Header */}
        <div className="dash-header">
          <div>
            <h1 className="dash-greeting">
              {greeting}, <span className="gradient-text">{firstName}</span> 👋
            </h1>
            <p className="text-secondary" style={{ marginTop: 4 }}>
              {stats.total === 0
                ? 'You have no tasks yet — create one to get started!'
                : `${stats.todo + stats.progress} active task${stats.todo + stats.progress !== 1 ? 's' : ''}${stats.high > 0 ? `, ${stats.high} high-priority` : ''}.`}
            </p>
          </div>
          <button id="new-task-btn" className="btn btn-primary" onClick={openCreate}>
            <span style={{ fontSize: '1.1rem' }}>+</span> New Task
          </button>
        </div>

        {/* Stat Cards */}
        <div className="stat-grid">
          <StatCard label="Total"       value={stats.total}    color="var(--primary-light)" icon="📋" />
          <StatCard label="To Do"       value={stats.todo}     color="#94a3b8"              icon="⏳" />
          <StatCard label="In Progress" value={stats.progress} color="var(--primary-light)" icon="🔄" />
          <StatCard label="Done"        value={stats.done}     color="var(--success)"       icon="✅" />
        </div>

        {/* Progress Bar */}
        {stats.total > 0 && (
          <div className="progress-section glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Overall Progress</span>
              <span className="gradient-text" style={{ fontWeight: 700 }}>{donePercent}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${donePercent}%` }} />
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f}
              id={`filter-${f}`}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => { setFilter(f); setLoading(true) }}
            >
              {FILTER_LABELS[f]}
              {f !== 'all' && (
                <span className="filter-count">
                  {f === 'todo' ? stats.todo : f === 'in_progress' ? stats.progress : stats.done}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

        {/* Task List */}
        {loading ? (
          <div className="flex-center" style={{ padding: '60px 0' }}>
            <div className="spinner" style={{ width: 36, height: 36 }} />
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state glass">
            <div className="empty-icon">
              {filter === 'done' ? '🎉' : filter === 'in_progress' ? '🔄' : '📋'}
            </div>
            <h3>No {filter !== 'all' ? FILTER_LABELS[filter] : ''} tasks</h3>
            <p className="text-secondary text-sm" style={{ marginTop: 8 }}>
              {filter === 'all'
                ? 'Click "New Task" to add your first task.'
                : `No ${FILTER_LABELS[filter].toLowerCase()} tasks right now.`}
            </p>
            {filter === 'all' && (
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={openCreate}>
                + Create First Task
              </button>
            )}
          </div>
        ) : (
          <div className="task-list">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEdit}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {modalOpen && (
        <TaskModal task={editTask} onClose={closeModal} onSave={handleSave} />
      )}

      <style>{`
        .dashboard { min-height: 100vh; position: relative; z-index: 1; }
        .dashboard-main { max-width: 860px; margin: 0 auto; padding: 36px 24px 60px; }
        .dash-header {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 20px;
          margin-bottom: 32px; flex-wrap: wrap;
        }
        .dash-greeting { font-size: clamp(1.4rem, 4vw, 2rem); }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px; margin-bottom: 20px;
        }
        @media (max-width: 600px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
        .progress-section { border-radius: var(--radius-md); padding: 16px 20px; margin-bottom: 24px; }
        .progress-track { height: 8px; border-radius: 999px; background: var(--border); overflow: hidden; }
        .progress-fill {
          height: 100%; border-radius: 999px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          transition: width 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .filter-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
        .filter-tab {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 18px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border);
          background: var(--bg-surface);
          color: var(--text-secondary);
          font-family: inherit; font-size: 0.88rem; font-weight: 500;
          cursor: pointer; transition: all var(--transition);
        }
        .filter-tab:hover { border-color: var(--border-hover); color: var(--text-primary); }
        .filter-tab.active {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border-color: transparent; color: #fff;
          box-shadow: 0 4px 14px var(--primary-glow);
        }
        .filter-count {
          background: rgba(255,255,255,0.18);
          border-radius: 99px; padding: 1px 7px;
          font-size: 0.75rem; font-weight: 700;
        }
        .task-list { display: flex; flex-direction: column; gap: 12px; }
        .empty-state { border-radius: var(--radius-xl); padding: 60px 24px; text-align: center; }
        .empty-icon { font-size: 3rem; margin-bottom: 16px; }
      `}</style>
    </div>
  )
}

function StatCard({ label, value, color, icon }) {
  return (
    <div className="glass stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
      <div className="stat-label">{label}</div>
      <style>{`
        .stat-card { border-radius: var(--radius-lg); padding: 18px 16px; transition: all var(--transition); }
        .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
        .stat-icon { font-size: 1.4rem; margin-bottom: 8px; }
        .stat-value { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.03em; line-height: 1; margin-bottom: 4px; }
        .stat-label { font-size: 0.78rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
      `}</style>
    </div>
  )
}
