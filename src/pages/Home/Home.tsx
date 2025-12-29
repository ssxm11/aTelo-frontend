import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { needsCheckIn } from '../../utils/checkIn';
import './Home.scss';

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user && needsCheckIn()) {
    return <Navigate to="/check-in" replace />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <section className="home">
      <h1>Tu bienestar primero.</h1>

      <p>
        aTelo te ayuda a cumplir objetivos sin olvidarte de ti.
        No se trata de hacer más, sino de vivir mejor.
      </p>

      <div className="highlight">
        Hoy está bien avanzar lento.
      </div>

      <div>
        <button
          className="back-button"
          onClick={() => navigate('/dashboard')}
        >
          Ver Objetivos
        </button>
      </div>
    </section>
  );
}
