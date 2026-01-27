import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './IntentionsPanel.scss';

interface Intention {
  _id: string;
  title: string;
  description?: string;
  intention?: {
    enabled: boolean;
    recurrence: 'daily' | 'weekly';
  };
}

// interface Props {
//   intentions: Intention[];
// }

export default function IntentionsPanel() {
  const [intentions, setIntentions] = useState<Intention[]>([]);

useEffect(() => {
  api.get('/goals')
    .then(res =>
      setIntentions(
        res.data.data.filter((g: any) => g.type === 'intention')
      )
    );
}, []);

  if (intentions.length === 0) {
    return (
      <div className="intentions-empty">
        <p>No hay intenciones aún</p>
        <span>Las intenciones aparecen cuando tenga sentido</span>
      </div>
    );
  }

  return (
    <div className="intentions-panel">
      <h3>Podrías intentar hoy</h3>

      {intentions.map(intention => (
        <div key={intention._id} className="intention-card">
          <h4>{intention.title}</h4>

          {intention.description && (
            <p>{intention.description}</p>
          )}

          <span className="soft-hint">
            Si te nace, puedes hacerlo hoy 🌱
          </span>
        </div>
      ))}
    </div>
  );
}


