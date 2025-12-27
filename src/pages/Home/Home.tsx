import { useNavigate } from 'react-router-dom';
import './Home.scss';

export default function Home() {
  const navigate = useNavigate();
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
