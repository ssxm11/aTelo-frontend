// ============================================
// AddIntention.tsx
// ============================================

import { useState } from 'react';
import api from '../../api/axios';
import './AddIntention.scss';

interface AddIntentionProps {
  onIntentionCreated?: () => void;
}

export default function AddIntention({
  onIntentionCreated
}: AddIntentionProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recurrence, setRecurrence] =
    useState<'daily' | 'weekly'>('daily');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || loading) return;

    try {
      setLoading(true);

      await api.post('/intentions', {
        title,
        description,
        recurrence,
      });

      onIntentionCreated?.();

      setTitle('');
      setDescription('');
      setRecurrence('daily');
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        className="add-intention-trigger"
        onClick={() => setOpen(true)}
      >
        + Nueva intención
      </button>
    );
  }

  return (
    <section className="add-intention">
      <h2>Nueva intención</h2>

      <p className="type-hint">
        Una invitación amable, sin presión.
      </p>

      <input
        placeholder="¿Qué te gustaría intentar?"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Descripción (opcional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <label>¿Cada cuánto debería aparecer?</label>
      <select
        value={recurrence}
        onChange={e =>
          setRecurrence(e.target.value as 'daily' | 'weekly')
        }
      >
        <option value="daily">Diariamente</option>
        <option value="weekly">Semanalmente</option>
      </select>

      <div className="actions">
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creando…' : 'Crear intención'}
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
