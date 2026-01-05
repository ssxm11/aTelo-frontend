import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import api from '../../api/axios';
import './GoalPage.scss';

interface Goal {
  _id: string;
  title: string;
  completed: boolean;
}

interface Task {
  _id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}

export default function GoalPage() {
  const { goalId } = useParams<{ goalId: string }>();

  const [goal, setGoal] = useState<Goal | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const newTaskInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleCreateTask = async () => {
  if (!newTaskTitle.trim()) return;

  try {
    setCreating(true);

    const res = await api.post(`/goals/${goalId}/tasks`, {
      title: newTaskTitle
    });

    setTasks(prev => [...prev, res.data.data]);
    setNewTaskTitle('');
  } finally {
  setCreating(false);
  setNewTaskTitle('');
  setShowNewTaskInput(false);
}

};

const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
  const newStatus = currentStatus === 'completed'
    ? 'pending'
    : 'completed';

  await api.patch(`/tasks/${taskId}`, {
    status: newStatus
  });

  setTasks(prev =>
    prev.map(task =>
      task._id === taskId
        ? { ...task, status: newStatus }
        : task
    )
  );
};
const handleUpdateTask = async (taskId: string) => {
  if (!editingTitle.trim()) return;

  await api.patch(`/tasks/${taskId}`, {
    title: editingTitle
  });

  setTasks(prev =>
    prev.map(task =>
      task._id === taskId
        ? { ...task, title: editingTitle }
        : task
    )
  );

  setEditingTaskId(null);
  setEditingTitle('');
};
const handleDeleteTask = async (taskId: string) => {
  await api.delete(`/tasks/${taskId}`);

  setTasks(prev => prev.filter(task => task._id !== taskId));
};
useEffect(() => {
  if (showNewTaskInput) {
    newTaskInputRef.current?.focus();
  }
}, [showNewTaskInput]);

  useEffect(() => {
    if (!goalId) return;

    Promise.all([
      api.get(`/goals/${goalId}`),
      api.get(`/goals/${goalId}/tasks`)
    ])
      .then(([goalRes, tasksRes]) => {
        setGoal(goalRes.data.data);
        setTasks(tasksRes.data.data);
      })
      .finally(() => setLoading(false));
  }, [goalId]);

  if (loading) {
    return <p>Cargando objetivo…</p>;
  }

  if (!goal) {
    return <p>Objetivo no encontrado</p>;
  }
const completedTasks = tasks.filter(
  t => t.status === 'completed'
).length;

const progress =
  tasks.length > 0
    ? completedTasks / tasks.length
    : null;

  return (
    <div className="goal-page">
      <header className="goal-header">
        <button
    className="back-button"
    onClick={() => navigate(-1)}
  >
    ← Volver
  </button>
        <h1>{goal.title}</h1>
         {progress !== null && (
    <div className="goal-progress">
      <div
        className="goal-progress-bar"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )}
      </header>

      <section className="tasks-section">
        <h2>Tareas</h2>
{showNewTaskInput && (
  <div className="new-task">
    <input
      ref={newTaskInputRef}
      type="text"
      placeholder="Nueva tarea…"
      value={newTaskTitle}
      onChange={e => setNewTaskTitle(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && handleCreateTask()}
    />

    <button onClick={handleCreateTask} disabled={creating}>
      Añadir
    </button>

  </div>
)}
       
<div className="edit-bar">
  

  {tasks.length > 0 && (
    <button
      className="edit-mode"
      onClick={() => setEditMode(prev => !prev)}
    >
      {editMode ? 'Salir edición' : 'Editar'}
    </button>
  )}
</div>

        {tasks.length === 0 ? (
          <p className="empty">Aún no hay tareas en este objetivo.</p>
        ) : (
          <ul className="tasks">
  {tasks.map(task => (
    <li key={task._id} className={task.status}>
      {editingTaskId === task._id ? (
        <>
          <input
            value={editingTitle}
            onChange={e => setEditingTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleUpdateTask(task._id)}
            autoFocus
          />
          <button onClick={() => handleUpdateTask(task._id)}>💾</button>
          <button onClick={() => setEditingTaskId(null)}>✖</button>
        </>
      ) : (
        <>
          <span
            onClick={() =>
              !editMode && toggleTaskStatus(task._id, task.status)
            }
          >
            {task.title}
          </span>

          {editMode && (
            <div className="task-actions">
              <button
                onClick={() => {
                  setEditingTaskId(task._id);
                  setEditingTitle(task.title);
                }}
              >
                ✏️
              </button>

              <button onClick={() => handleDeleteTask(task._id)}>
                🗑️
              </button>
            </div>
          )}
        </>
      )}
    </li>
  ))}
</ul>

        )}

        <button
  className="add-task"
  onClick={() => setShowNewTaskInput(true)}
>
  + Nueva tarea
</button>

      </section>
    </div>
  );
}
