import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './CheckIn.scss';

export default function CheckIn() {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const BLOCKING_DIAGNOSES = ['tired', 'overwhelmed', 'foggy'];
  const [diagnosis, setDiagnosis] = useState<string | null>(null);

  const navigate = useNavigate();

  
  const handleSubmit = async () => {
  if (!answer.trim() || loading) return;

  try {
    setLoading(true);

    const res = await api.post('/ai/check-in', {
      message: answer
    });

    const { diagnosis } = res.data;
    setDiagnosis(diagnosis);

    if (BLOCKING_DIAGNOSES.includes(diagnosis)) {
      setBlocked(true);
    } else {
      navigate('/dashboard');
    }
  } finally {
    setLoading(false);
  }
};
const DIAGNOSIS_COPY: Record<string, { title: string; text: string }> = {
  tired: {
    title: 'Hoy estás cansado.',
    text: 'Tal vez avanzar despacio sea mejor que exigirte.'
  },
  overwhelmed: {
    title: 'Hoy todo se siente un poco demasiado.',
    text: 'Reducir la carga también es una forma de avanzar.'
  },
  foggy: {
    title: 'Hoy hay algo de niebla mental.',
    text: 'Quizá no es momento de decisiones grandes.'
  }
};


  return (
    <section className="check-in">
      <h1>Antes de continuar…</h1>

      <p className="question">
        ¿Cómo te sientes hoy para trabajar, estudiar o avanzar?
      </p>

      <textarea
        placeholder="Puedes escribir libremente, no hay respuestas correctas…"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
      />

      <button onClick={handleSubmit} disabled={loading}>
        Continuar
      </button>

      {blocked && diagnosis && (
  <div className="blocked">
    <p className="blocked-title">
      {DIAGNOSIS_COPY[diagnosis].title}
    </p>

    <p className="blocked-text">
      {DIAGNOSIS_COPY[diagnosis].text}
    </p>

    <div className="blocked-actions">
      <button
        className="secondary"
        onClick={() => navigate('/dashboard')}
      >
        Ir al dashboard igual
      </button>

      <button
        className="primary"
        onClick={() => setBlocked(false)}
      >
        Reescribir respuesta
      </button>
    </div>
  </div>
)}

    </section>
  );
}
