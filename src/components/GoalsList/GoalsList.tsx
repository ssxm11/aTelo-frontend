import { useEffect, useState } from 'react';
import api from '../../api/axios';
import './GoalsList.scss';

interface Goal {
  _id: string;
  title: string;
  completed: boolean;
}

export default function GoalsList() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/goals')
      .then(res => setGoals(res.data))
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
        <li key={goal._id} className={goal.completed ? 'done' : ''}>
          {goal.title}
        </li>
      ))}
    </ul>
  );
}
