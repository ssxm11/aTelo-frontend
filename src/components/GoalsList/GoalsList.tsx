import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../api/axios';
import './GoalsList.scss';

interface Goal {
  _id: string;
  title: string;
  completed: boolean;
}
interface GoalsListProps {
  editMode: boolean;
  onGoalsCountChange: (count: number) => void;
}

export default function GoalsList({
  editMode,
  onGoalsCountChange
}: GoalsListProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const navigate = useNavigate();

  const handleUpdateGoal = async (goalId: string) => {
  if (!editingTitle.trim()) return;

  await api.patch(`/goals/${goalId}`, {
    title: editingTitle
  });

  setGoals(prev =>
    prev.map(goal =>
      goal._id === goalId
        ? { ...goal, title: editingTitle }
        : goal
    )
  );

  setEditingGoalId(null);
  setEditingTitle('');
};

const handleDeleteGoal = async (goalId: string) => {
  await api.delete(`/goals/${goalId}`);

  setGoals(prev => prev.filter(goal => goal._id !== goalId));
};

useEffect(() => {
  onGoalsCountChange(goals.length);
}, [goals, onGoalsCountChange]);

  useEffect(() => {
    api.get('/goals')
      .then(res => setGoals(res.data.data)) 
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Cargando tus objetivos…</p>;
  }

  if (goals.length === 0) {
    return (
      <div className="empty">
        <p>No tienes objetivos aún.</p>
        <span>Está bien empezar poco a poco.</span>
      </div>
    );
  }

  return (
   <ul className="goals">
  {goals.map(goal => (
    <li className="goal-item">
  {editingGoalId === goal._id ? (
    <>
      <input
        value={editingTitle}
        onChange={e => setEditingTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleUpdateGoal(goal._id)}
        autoFocus
      />
      <button onClick={() => handleUpdateGoal(goal._id)}>💾</button>
      <button onClick={() => setEditingGoalId(null)}>✖</button>
    </>
  ) : (
    <>
      <span
        onClick={() =>
          !editMode && navigate(`/goals/${goal._id}`)
        }
      >
        {goal.title}
      </span>

      {editMode && (
        <div className="goal-actions">
          <button
            onClick={() => {
              setEditingGoalId(goal._id);
              setEditingTitle(goal.title);
            }}
          >
            ✏️
          </button>

          <button onClick={() => handleDeleteGoal(goal._id)}>
            🗑️
          </button>
        </div>
      )}
    </>
  )}
</li>

  ))}
</ul>
  );
}
