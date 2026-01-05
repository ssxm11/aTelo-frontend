import { useState } from 'react';
import api from '../../api/axios';
import './AddGoal.scss';

type GoalType = 'goal' | 'intention';

export default function AddGoal() {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GoalType>('goal');
  const [recurrence, setRecurrence] = useState<'daily' | 'weekly'>('daily');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || loading) return;

    try {
      setLoading(true);

      interface GoalPayload {
        title: string;
        description: string;
        type: GoalType;
        intention?: {
          enabled: boolean;
          recurrence: 'daily' | 'weekly';
        };
      }

      const payload: GoalPayload = {
        title,
        description,
        type
      };

      if (type === 'intention') {
        payload.intention = {
          enabled: true,
          recurrence
        };
      }

      await api.post('/goals', payload);

      // reset + cerrar
      setTitle('');
      setDescription('');
      setType('goal');
      setRecurrence('daily');
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // 👇 ESTADO CERRADO
  if (!open) {
    return (
      <button
        className="add-goal-trigger"
        onClick={() => setOpen(true)}
      >
        + Crear algo nuevo
      </button>
    );
  }

  // 👇 ESTADO ABIERTO
  return (
    <section className="add-goal">
      <h2>
        {type === 'goal' ? 'Nuevo objetivo' : 'Nueva intención'}
      </h2>

      <div className="type-selector">
        <button
          className={type === 'goal' ? 'active' : ''}
          onClick={() => setType('goal')}
        >
          Objetivo
        </button>

        <button
          className={type === 'intention' ? 'active' : ''}
          onClick={() => setType('intention')}
        >
          Intención
        </button>
      </div>

      <p className="type-hint">
        {type === 'goal'
          ? 'Algo concreto que te gustaría completar.'
          : 'Una invitación amable, sin presión.'}
      </p>

      <input
        placeholder={
          type === 'goal'
            ? '¿Qué quieres lograr?'
            : '¿Qué te gustaría intentar cuando sea posible?'
        }
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Descripción (opcional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      {type === 'intention' && (
        <div className="intention-config">
          <label htmlFor="recurrence-select">¿Cada cuánto debería aparecer?</label>
          <select
            id="recurrence-select"
            value={recurrence}
            onChange={e => setRecurrence(e.target.value as 'daily' | 'weekly')}
          >
            <option value="daily">Diariamente</option>
            <option value="weekly">Semanalmente</option>
          </select>
        </div>
      )}

      <div className="actions">
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creando…' : 'Crear'}
        </button>

        <button
          className="cancel"
          onClick={() => setOpen(false)}
        >
          Cancelar
        </button>
      </div>
    </section>
  );
}
