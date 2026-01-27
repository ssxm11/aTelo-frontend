import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

import GoalsList from '../../components/GoalsList/GoalsList';
import AddGoal from '../../components/AddGoal/AddGoal';
import AddIntention from '../../components/AddIntention/AddIntention';

import './Dashboard.scss';

interface Intention {
  _id: string;
  title: string;
  description?: string;

  recurrence: 'daily' | 'weekly';
  enabled: boolean;

  lastShownAt?: string;
  lastAcceptedAt?: string;

  createdAt: string;
  updatedAt: string;
}


export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [goals, setGoals] = useState<any[]>([]);
  const [intentions, setIntentions] = useState<Intention[]>([]);

  const [editMode, setEditMode] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [goalsCount, setGoalsCount] = useState(0);
  const isAcceptedToday = (intention: Intention) => {
  if (!intention.lastAcceptedAt) return false;

  const last = new Date(intention.lastAcceptedAt);
  const today = new Date();

  return (
    last.getFullYear() === today.getFullYear() &&
    last.getMonth() === today.getMonth() &&
    last.getDate() === today.getDate()
  );
};


  useEffect(() => {
  api.get('/goals')
    .then(res => setGoals(res.data.data));

  api.get('/intentions')
    .then(res => setIntentions(res.data.data));
}, [reloadKey]);

  const goalsOnly = goals;

  return (
    <section className="dashboard">

      {/* HEADER */}
      <header className="dashboard-header">
        <h1>Hola{user?.email ? `, ${user.name}` : ''}</h1>
        <p>Hoy puedes ir a tu ritmo.</p>
      </header>

      {/* CTA FOCO */}
      <div className="focus-entry">
        <button onClick={() => navigate('/focus')}>
          Entrar en espacio de foco
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dashboard-content">

        {/* INTENCIONES */}
        <section className="intentions-section">
  <h2>Intenciones</h2>

  <AddIntention onCreated={() => setReloadKey(v => v + 1)} />

  {intentions.length === 0 ? (
    <p className="empty">
      No hay intenciones activas por ahora.
    </p>
  ) : (
    <ul className="intentions">
      {intentions.map(intention => {
        const acceptedToday = isAcceptedToday(intention);

        return (
          <li
            key={intention._id}
            className={`intention-card ${
              acceptedToday ? 'accepted' : ''
            }`}
          >
            <h3>{intention.title}</h3>

            {intention.description && (
              <p>{intention.description}</p>
            )}

            <div className="intention-actions">
              {!acceptedToday ? (
                <button
                  onClick={() =>
                    api.post(`/intentions/${intention._id}/accept`)
                      .then(() =>
                        setReloadKey(v => v + 1)
                      )
                  }
                >
                  Aceptar hoy
                </button>
              ) : (
                <span className="done">
                  Intención cumplida hoy 🌱
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  )}
</section>

        {/* OBJETIVOS */}
        <section className="goals-section">
          <h2>Objetivos</h2>

          <div className="goals-actions">
            <AddGoal onGoalCreated={() => setReloadKey(v => v + 1)} />

            {goalsCount > 0 && (
              <button onClick={() => setEditMode(v => !v)}>
                {editMode ? 'Salir edición' : 'Editar'}
              </button>
            )}
          </div>

          <GoalsList
            goals={goalsOnly}
            editMode={editMode}
            onGoalsCountChange={setGoalsCount}
          />
        </section>

      </main>

    </section>
  );
}
