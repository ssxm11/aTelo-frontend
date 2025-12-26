import { useEffect, useState } from 'react';
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
      </header>

      <section className="tasks-section">
        <h2>Tareas</h2>
        <div className="new-task">
  <input
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

        {tasks.length === 0 ? (
          <p className="empty">Aún no hay tareas en este objetivo.</p>
        ) : (
          <ul className="tasks">
            {tasks.map(task => (
              <li
  key={task._id}
  className={task.status}
  onClick={() => toggleTaskStatus(task._id, task.status)}
>
  {task.title}
</li>

            ))}
          </ul>
        )}

        <button className="add-task">
          + Nueva tarea
        </button>
      </section>
    </div>
  );
}
