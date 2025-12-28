import { useAuth } from '../../context/AuthContext';
import GoalsList from '../../components/GoalsList/GoalsList';
import AddGoal from '../../components/AddGoal/AddGoal';


import './Dashboard.scss';
import { useState } from 'react';

export default function Dashboard() {
  const { user } = useAuth();

   const [editMode, setEditMode] = useState(false);
   const [goalsCount, setGoalsCount] = useState(0);
   const [reloadGoals, setReloadGoals] = useState(0);

   
  return (
    <section className="dashboard">
      <header className="dashboard-header">
        <h1>Hola{user?.email ? `, ${user.name}` : ''}</h1>
        <p>Hoy puedes ir a tu ritmo.</p>
      </header>

      <div className="dashboard-actions">
        <AddGoal onGoalCreated={() => setReloadGoals(v => v + 1)} />

        {goalsCount > 0 && (
          <button
            className="edit-mode"
            onClick={() => setEditMode(prev => !prev)}
          >
            {editMode ? 'Salir edición' : 'Editar'}
          </button>
        )}
      </div>

      <GoalsList
        editMode={editMode}
        reloadKey={reloadGoals}
        onGoalsCountChange={setGoalsCount}
      />
    </section>
  );
}
