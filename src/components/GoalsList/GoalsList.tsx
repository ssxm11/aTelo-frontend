import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../../api/axios';
import './GoalsList.scss';

interface Goal {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
}
 
interface GoalsListProps {
  editMode: boolean;
  
  reloadKey: number;
  onGoalsCountChange: (count: number) => void;
}

export default function GoalsList({
  editMode,
  reloadKey,
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
  setLoading(true);

  api.get('/goals')
    .then(res => setGoals(res.data.data))
    .finally(() => setLoading(false));
}, [reloadKey]);

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
    <li key={goal._id} className="goal-item">
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
      <div
  className="goal-content"
  onClick={() =>
    !editMode && navigate(`/goals/${goal._id}`)
  }
>
  <h3 className="goal-title">{goal.title}</h3>

  {goal.description && (
    <p className="goal-description">
      {goal.description}
    </p>
  )}
</div>

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
