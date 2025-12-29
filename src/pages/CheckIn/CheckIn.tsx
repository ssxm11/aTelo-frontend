import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './CheckIn.scss';

export default function CheckIn() {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!answer.trim()) return;

    try {
      setLoading(true);

      const res = await api.post('/ai/check-in', {
        message: answer
      });

      const { canProceed } = res.data;

      if (canProceed) {
        navigate('/dashboard');
      } else {
        setBlocked(true);
      }
    } finally {
      setLoading(false);
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

      {blocked && (
        <div className="blocked">
          <p>
            Hoy quizá no sea un día para exigirte.
          </p>
          <span>
            Está bien ir más despacio o simplemente descansar.
          </span>

          <button onClick={() => navigate('/dashboard')}>
            Ir igual al dashboard
          </button>
        </div>
      )}
    </section>
  );
}
